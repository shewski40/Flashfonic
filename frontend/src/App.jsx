import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

// Helper function to generate a simple UUID for browser compatibility
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">FlashFonic</div>
        <button onClick={onEnter} className="nav-cta">Enter Beta</button>
      </nav>

      <header className="landing-hero">
        <h1 className="landing-h1">The Future of Studying is Listening.</h1>
        <p className="landing-p">
          Introducing <span className="brand-bling">FlashFonic</span>, the world's first app that uses AI to instantly turn your spoken words, lectures, and audio notes into powerful flashcards.
        </p>
        <button onClick={onEnter} className="landing-cta">Start Flashing!</button>
      </header>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>CAPTURE</h3>
            <p>Record live audio or upload a file.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI GENERATE</h3>
            <p>Our AI transcribes and creates a Q&A flashcard.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>STUDY</h3>
            <p>Master your material with our advanced study tools.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>A Smarter Way to Learn</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🤖 Revolutionary Audio-to-Card AI</h3>
            <p>Stop typing, start talking. Our cutting-edge AI listens, transcribes, and intelligently crafts flashcards for you. Perfect for lectures, brainstorming, and hands-free learning.</p>
          </div>
          <div className="feature-card">
            <h3>⚡️ Hands-Free Capture Modes</h3>
            <p>Stay in the zone. Use the "Flash It!" voice command to manually create cards, or enable <strong>Auto-Flash</strong> to automatically generate a new card at set intervals during a lecture. Learning has never been this passive and powerful.</p>
          </div>
          <div className="feature-card">
            <h3>📚 Advanced Study Suite</h3>
            <p>Study your way. Flip, scramble, and flag cards. Listen to your deck with our Text-to-Speech engine, and even reorder cards with a simple drag-and-drop.</p>
          </div>
          <div className="feature-card">
            <h3>📂 Organize & Export with Ease</h3>
            <p>Keep your subjects sorted in folders. When you're ready to study offline, export any deck to a professional PDF or a simple CSV file in seconds.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <h2>Ready to change the way you learn?</h2>
        <button onClick={onEnter} className="landing-cta">Start Flashing!</button>
        <p className="footer-credit">Welcome to the FlashFonic Beta</p>
      </footer>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
const MainApp = () => {
  const [appMode, setAppMode] = useState('live');
  const [isListening, setIsListening] = useState(false);
  const [notification, setNotification] = useState('');
  const [duration, setDuration] = useState(15);
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  // Updated folders state to store objects with metadata and nested subfolders
  const [folders, setFolders] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mediaSrc, setMediaSrc] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [voiceActivated, setVoiceActivated] = useState(false);
  const [checkedCards, setCheckedCards] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [studyingFolder, setStudyingFolder] = useState(null);
  const [promptModalConfig, setPromptModalConfig] = useState(null); // For export prompts
  const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
  const [movingCard, setMovingCard] = useState(null);
  const [listeningDuration, setListeningDuration] = useState(1);
  const [isAutoFlashOn, setIsAutoFlashOn] = useState(false);
  const [autoFlashInterval, setAutoFlashInterval] = useState(20);
  const [isUploadAutoFlashOn, setIsUploadAutoFlashOn] = useState(false);
  const [uploadAutoFlashInterval, setUploadAutoFlashInterval] = useState(20); 
  const [usage, setUsage] = useState({ count: 0, limit: 25, date: '' });
  const [isDevMode, setIsDevMode] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioCacheId, setAudioCacheId] = useState(null);
  const [folderSortBy, setFolderSortBy] = useState('name'); // New state for folder sorting
  const [draggedFolderId, setDraggedFolderId] = useState(null); // For folder drag-and-drop
  // Changed to a Set to allow multiple folders to be expanded
  const [expandedFolderIds, setExpandedFolderIds] = useState(new Set()); 
  const [selectedCardsInExpandedFolder, setSelectedCardsInExpandedFolder] = useState({}); // Checkboxes in expanded folder

  // Centralized modal config for Add Subfolder, Rename, Delete
  const [modalConfig, setModalConfig] = useState(null);  

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    const safariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safariCheck);
    if (safariCheck) {
      console.log("Safari browser detected. Voice Activation and Silence Detection will be disabled.");
    }
  }, []);

  const audioChunksRef = useRef([]);
  const headerChunkRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningTimeoutRef = useRef(null);
  const autoFlashTimerRef = useRef(null);
  const uploadAutoFlashTimerRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const isGeneratingRef = useRef(isGenerating);
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  const isAutoFlashOnRef = useRef(isAutoFlashOn);
  useEffect(() => {
    isAutoFlashOnRef.current = isAutoFlashOn;
  }, [isAutoFlashOn]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('dev') === 'true') {
      setIsDevMode(true);
      setNotification('Developer mode active: Usage limit disabled.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const storedUsageJSON = localStorage.getItem('flashfonic-usage');
    let currentUsage = { count: 0, limit: 25, date: today };

    if (storedUsageJSON) {
      const storedUsage = JSON.parse(storedUsageJSON);
      if (storedUsage.date === today) {
        currentUsage = storedUsage;
      } else {
        currentUsage = { ...storedUsage, count: 0, date: today };
      }
    }
    
    setUsage(currentUsage);
    localStorage.setItem('flashfonic-usage', JSON.stringify(currentUsage));
  }, []);

  // Load folders with new structure
  useEffect(() => {
    const storedFolders = localStorage.getItem('flashfonic-folders');
    if (storedFolders) {
      const parsedFolders = JSON.parse(storedFolders);
      // Function to recursively convert old folder structure or ensure new properties
      const convertFolderStructure = (oldFolders) => {
        const newFolders = {};
        for (const key in oldFolders) {
          const folder = oldFolders[key];
          let newFolder;
          if (Array.isArray(folder)) { // Old format: "folderName": [cards]
            const folderId = generateUUID();
            newFolder = {
              id: folderId,
              name: key,
              createdAt: Date.now(),
              lastViewed: Date.now(),
              cards: folder,
              subfolders: {}
            };
          } else { // Already new format, but ensure all properties exist
            newFolder = { ...folder };
            if (!newFolder.id) newFolder.id = generateUUID();
            if (!newFolder.createdAt) newFolder.createdAt = Date.now();
            if (!newFolder.lastViewed) newFolder.lastViewed = Date.now();
            if (!newFolder.cards) newFolder.cards = [];
            if (!newFolder.subfolders) newFolder.subfolders = {};
            // Recursively convert subfolders
            newFolder.subfolders = convertFolderStructure(newFolder.subfolders);
          }
          // NEW: Data migration for individual cards
          newFolder.cards = (newFolder.cards || []).map(card => ({
            ...card,
            lastViewed: card.lastViewed || null,
            isFlagged: card.isFlagged || false,
          }));
          newFolders[newFolder.id] = newFolder;
        }
        return newFolders;
      };
      setFolders(convertFolderStructure(parsedFolders));
    }
  }, []);

  // Save folders with new structure
  useEffect(() => {
    localStorage.setItem('flashfonic-folders', JSON.stringify(folders));
  }, [folders]);

  const generateFlashcardRequest = useCallback(async (requestBody) => {
    setIsGenerating(true);
    setNotification('Generating flashcard...');
    try {
        const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate flashcard.');
        }
        
        const newCard = { ...data, id: Date.now(), lastViewed: null, isFlagged: false };
        setGeneratedFlashcards(prev => [newCard, ...prev]);
        
        if (!isDevMode) {
            setUsage(prevUsage => {
                const newUsage = { ...prevUsage, count: prevUsage.count + 1 };
                localStorage.setItem('flashfonic-usage', JSON.stringify(newUsage));
                return newUsage;
            });
        }
        setNotification('Card generated!');
    } catch (error) {
        console.error("Error:", error);
        setNotification(`Error: ${error.message}`);
    } finally {
        setIsGenerating(false);
    }
  }, [isDevMode]);

  const handleLiveFlashIt = useCallback(async () => {
    if (!isDevMode && usage.count >= usage.limit) {
      setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
      return;
    }
    if (isGeneratingRef.current) return;
    if (!headerChunkRef.current) {
        setNotification('Audio not ready. Wait a moment.');
        return;
    }

    const chunks = [...audioChunksRef.current];
    if (chunks.length < 3) {
        setNotification('Not enough audio captured.');
        return;
    }

    const grab = Math.min(duration, chunks.length);
    const slice = chunks.slice(-grab);
    const fileBlob = new Blob([headerChunkRef.current, ...slice], { type: mediaRecorderRef.current.mimeType });
    
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        generateFlashcardRequest({ audio_data: base64Audio, is_live_capture: true });
    };
  }, [duration, usage, isDevMode, generateFlashcardRequest]);

  const handleProcessAudio = useCallback(async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setNotification("Uploading and processing audio...");

    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onloadend = async () => {
        const base64File = reader.result.split(',')[1];
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/process-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio_data: base64File })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to process audio.');
            }
            
            setAudioCacheId(data.audioId);
            setNotification("Audio is ready! You can now flash it.");
        } catch (error) {
            console.error("Error processing audio:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };
  }, [uploadedFile]);

  const handleUploadFlash = useCallback(async () => {
    if (!isDevMode && usage.count >= usage.limit) {
      setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
      return;
    }
    if (isGeneratingRef.current) return;

    const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
    const requestBody = {
        startTime: activePlayer.currentTime,
        duration: duration,
        is_live_capture: false,
    };

    if (audioCacheId) {
        // FAST PATH: Use the cached audio ID
        requestBody.audioId = audioCacheId;
    } else {
        // SLOW PATH (Audio files): Upload the whole file
        if (!uploadedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            requestBody.audio_data = base64Audio;
            generateFlashcardRequest(requestBody);
        };
        return; // Exit here because the request is async
    }
    
    generateFlashcardRequest(requestBody);

  }, [uploadedFile, audioCacheId, duration, usage, isDevMode, fileType, generateFlashcardRequest]);

  useEffect(() => {
    if (autoFlashTimerRef.current) clearInterval(autoFlashTimerRef.current);
    autoFlashTimerRef.current = null;
    if (isListening && isAutoFlashOn) {
      autoFlashTimerRef.current = setInterval(handleLiveFlashIt, autoFlashInterval * 1000);
    }
    return () => clearInterval(autoFlashTimerRef.current);
  }, [isListening, isAutoFlashOn, autoFlashInterval, handleLiveFlashIt]);
  
  useEffect(() => {
    if (uploadAutoFlashTimerRef.current) clearInterval(uploadAutoFlashTimerRef.current);
    uploadAutoFlashTimerRef.current = null;
    if (appMode === 'upload' && isUploadAutoFlashOn && isPlaying && (fileType === 'audio' || audioCacheId)) {
        setNotification(`Auto-Flash started. Generating a card every ${formatAutoFlashInterval(uploadAutoFlashInterval)}.`);
        uploadAutoFlashTimerRef.current = setInterval(handleUploadFlash, uploadAutoFlashInterval * 1000);
    }
    return () => clearInterval(uploadAutoFlashTimerRef.current);
  }, [appMode, isUploadAutoFlashOn, isPlaying, uploadAutoFlashInterval, handleUploadFlash, fileType, audioCacheId]);


  const stopListening = () => {
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    
    setIsListening(false);
    setNotification('');
  };

  const startListening = async () => {
    if (!isDevMode && usage.count >= usage.limit) {
      setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setNotification('Listening...');

      const mimeType = isSafari ? 'audio/mp4' : 'audio/webm; codecs=opus';
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
      
      audioChunksRef.current = [];
      headerChunkRef.current = null;

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            if (!headerChunkRef.current) {
                headerChunkRef.current = event.data;
                
                if (listeningDuration > 0) {
                  listeningTimeoutRef.current = setTimeout(() => {
                    if (isAutoFlashOnRef.current) {
                      setNotification(`Listening timer finished. Generating final card...`);
                      handleLiveFlashIt();
                      setTimeout(() => stopListening(), 2500);
                    } else {
                      setNotification(`Listening timer finished after ${formatListeningDuration(listeningDuration)}.`);
                      stopListening();
                    }
                  }, listeningDuration * 60 * 1000);
                }
            }
        }
      });

      mediaRecorderRef.current.start(1000);

      if (voiceActivated && !isSafari) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
              recognitionRef.current = new SpeechRecognition();
              recognitionRef.current.continuous = true;
              recognitionRef.current.interimResults = true;
              recognitionRef.current.onresult = (event) => {
                  for (let i = event.resultIndex; i < event.results.length; ++i) {
                      if (event.results[i].isFinal) {
                          const transcript = event.results[i][0].transcript.trim().toLowerCase();
                          if (transcript.includes("flash")) {
                              console.log("Voice command 'flash' detected.");
                              handleLiveFlashIt();
                          }
                      }
                  }
              };
              recognitionRef.current.start();
          }
      }

    } catch (err) {
      console.error("Error starting listening:", err);
      setNotification("Microphone access denied or error.");
      setIsListening(false);
    }
  };

  const handleModeChange = (mode) => {
    if (isListening) stopListening();
    setAppMode(mode);
    setNotification('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMediaSrc(null);
    setUploadedFile(file);
    setFileName(file.name);
    setCurrentTime(0);
    setMediaDuration(0);
    setAudioCacheId(null);
    
    if (file.type.startsWith('video/')) {
      setFileType('video');
    } else if (file.type.startsWith('audio/')) {
      setFileType('audio');
    } else {
      setNotification("Unsupported file type. Please upload an audio or video file.");
      return;
    }

    setMediaSrc(URL.createObjectURL(file));
    setNotification('File selected. Press play and then flash it!');
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  }

  useEffect(() => {
    const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
    if (!activePlayer) return;

    const timeUpdate = () => setCurrentTime(activePlayer.currentTime);
    const loadedMeta = () => setMediaDuration(activePlayer.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    activePlayer.addEventListener('timeupdate', timeUpdate);
    activePlayer.addEventListener('loadedmetadata', loadedMeta);
    activePlayer.addEventListener('play', onPlay);
    activePlayer.addEventListener('pause', onPause);
    activePlayer.addEventListener('ended', onPause);

    return () => {
      activePlayer.removeEventListener('timeupdate', timeUpdate);
      activePlayer.removeEventListener('loadedmetadata', loadedMeta);
      activePlayer.removeEventListener('play', onPlay);
      activePlayer.removeEventListener('pause', onPause);
      activePlayer.removeEventListener('ended', onPause);
    };
  }, [mediaSrc, fileType]);

  const togglePlayPause = () => {
    const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
    if (activePlayer?.paused) {
      activePlayer.play();
    } else {
      activePlayer?.pause();
    }
  };

  const handleSeek = (e) => {
    const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * mediaDuration;
    activePlayer.currentTime = seekTime;
  };
  
  const handleCardCheck = (cardId) => {
    setCheckedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCheckAll = () => {
    const allChecked = generatedFlashcards.every(card => checkedCards[card.id]);
    const newCheckedCards = {};
    if (!allChecked) {
      generatedFlashcards.forEach(card => {
          newCheckedCards[card.id] = true;
      });
    }
    setCheckedCards(newCheckedCards);
  };

  // Helper to find folder by ID recursively
  const findFolderById = (foldersObj, folderId) => {
    for (const id in foldersObj) {
      // Check if the current folder's ID matches
      if (foldersObj[id].id === folderId) return foldersObj[id]; 
      // Recursively search in subfolders
      const foundInSub = findFolderById(foldersObj[id].subfolders, folderId);
      if (foundInSub) return foundInSub;
    }
    return null;
  };

  // Helper to update folder by ID recursively
  const updateFolderById = (foldersObj, folderId, updateFn) => {
    const newFolders = { ...foldersObj };
    for (const id in newFolders) {
      if (newFolders[id].id === folderId) { // Ensure checking .id property
        newFolders[id] = updateFn(newFolders[id]);
        return newFolders;
      }
      const updatedSubfolders = updateFolderById(newFolders[id].subfolders, folderId, updateFn);
      if (updatedSubfolders !== newFolders[id].subfolders) {
        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
        return newFolders;
      }
    }
    return foldersObj; // No change if not found
  };

  // Helper to delete folder by ID recursively
  const deleteFolderById = (currentFolders, idToDelete) => {
    const newFolders = { ...currentFolders };
    if (newFolders[idToDelete]) {
      delete newFolders[idToDelete];
      return newFolders;
    }
    for (const id in newFolders) {
      const updatedSubfolders = deleteFolderById(newFolders[id].subfolders, idToDelete);
      if (updatedSubfolders !== newFolders[id].subfolders) {
        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
        return newFolders;
      }
    }
    return currentFolders;
  };

  // Updated handleMoveToFolder for new folder structure (from queue)
  const handleMoveToFolder = () => {
    if (!selectedFolderForMove) {
      setNotification("Please select a folder first.");
      return;
    }
    const cardsToMove = generatedFlashcards.filter(card => checkedCards[card.id]);
    if (cardsToMove.length === 0) {
      setNotification("Please check the cards you want to move.");
      return;
    }

    setFolders(prev => {
      return updateFolderById(prev, selectedFolderForMove, (folder) => ({
        ...folder,
        cards: [...folder.cards, ...cardsToMove]
      }));
    });
    setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
    setCheckedCards({});
    setSelectedFolderForMove('');
    setNotification(`${cardsToMove.length} card(s) moved.`);
  };

  // Updated handleCreateFolder for new folder structure
  const handleCreateFolder = (folderName) => {
    const folderExists = Object.values(folders).some(folder => folder.name === folderName);
    if (folderExists) {
      setNotification("A folder with this name already exists."); // Changed from alert
    } else {
      const newFolderId = generateUUID();
      setFolders(prev => ({
        ...prev,
        [newFolderId]: {
          id: newFolderId,
          name: folderName,
          createdAt: Date.now(),
          lastViewed: Date.now(),
          cards: [],
          subfolders: {}
        }
      }));
    }
    setModalConfig(null); // Close modal
  };

  // Function to add a subfolder
  const handleAddSubfolder = (parentFolderId, subfolderName) => {
    setFolders(prev => updateFolderById(prev, parentFolderId, (parentFolder) => {
      const subfolderExists = Object.values(parentFolder.subfolders).some(sf => sf.name === subfolderName);
      if (subfolderExists) {
        setNotification("A subfolder with this name already exists in this folder."); // Changed from alert
        return parentFolder; // Return original folder if exists
      }
      const newSubfolderId = generateUUID();
      return {
        ...parentFolder,
        subfolders: {
          ...parentFolder.subfolders,
          [newSubfolderId]: {
            id: newSubfolderId,
            name: subfolderName,
            createdAt: Date.now(),
            lastViewed: Date.now(),
            cards: [],
            subfolders: {}
          }
        }
      };
    }));
    setModalConfig(null); // Close modal
  };

  // Function to rename a folder/subfolder
  const handleRenameFolder = (folderId, newName) => {
    setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
      ...folder,
      name: newName
    })));
    setModalConfig(null); // Close modal
  };

  // Function to delete a folder/subfolder
  const handleDeleteFolder = (folderId) => {
    setFolders(prev => {
      // Find the folder to be deleted BEFORE modifying the state
      const deletedFolder = findFolderById(prev, folderId); 
      const updatedFolders = deleteFolderById(prev, folderId);

      // When a folder is deleted, ensure its ID is removed from expandedFolderIds
      setExpandedFolderIds(currentExpandedIds => {
        const newSet = new Set(currentExpandedIds);
        newSet.delete(folderId);
        // Recursively remove subfolder IDs if they were expanded
        const removeSubfolderIds = (currentFolder) => {
          for (const subId in currentFolder.subfolders) {
            newSet.delete(subId);
            removeSubfolderIds(currentFolder.subfolders[subId]);
          }
        };
        if (deletedFolder) { // Only call if the folder was actually found
          removeSubfolderIds(deletedFolder);
        }
        return newSet;
      });
      return updatedFolders;
    });
    setModalConfig(null); // Close modal
  };

  // Updated deleteCardFromFolder for new folder structure
  const deleteCardFromFolder = (folderId, cardId) => {
    setFolders(prevFolders => updateFolderById(prevFolders, folderId, (folder) => ({
      ...folder,
      cards: folder.cards.filter(card => card.id !== cardId)
    })));
  };

  const deleteFromQueue = (cardId) => {
    setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  const startEditing = (card, source, folderId = null) => {
    setEditingCard({ ...card, source, folderId });
    setMovingCard(null);
  };

  // Removed individual card move button, so this function is less critical for UI
  const startMove = (card, folderId) => {
    setMovingCard({ id: card.id, folderId });
    setEditingCard(null);
  };

  // Updated saveEdit for new folder structure
  const saveEdit = () => {
    if (!editingCard) return;
    const { id, question, answer, source, folderId } = editingCard;
    if (source === 'queue') {
      setGeneratedFlashcards(prev => 
        prev.map(card => card.id === id ? { ...card, question, answer } : card)
      );
    } else if (source === 'folder' && folderId) {
      setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
        ...folder,
        cards: folder.cards.map(card => 
          card.id === id ? { ...card, question, answer } : card
        )
      })));
    }
    setEditingCard(null);
  };

  // Updated handleConfirmMove for new folder structure
  const handleConfirmMove = (destinationFolderId) => {
    if (!movingCard || !destinationFolderId || movingCard.folderId === destinationFolderId) {
        setMovingCard(null);
        return;
    };
    const { id, folderId: sourceFolderId } = movingCard;
    setFolders(prevFolders => {
        let cardToMove = null;
        const newFolders = updateFolderById(prevFolders, sourceFolderId, (folder) => {
          cardToMove = folder.cards.find(c => c.id === id);
          return {
            ...folder,
            cards: folder.cards.filter(c => c.id !== id)
          };
        });

        if (!cardToMove) return prevFolders; // Card not found in source

        return updateFolderById(newFolders, destinationFolderId, (folder) => ({
          ...folder,
          cards: [...folder.cards, cardToMove]
        }));
    });
    setMovingCard(null);
  };

  // REBUILT EXPORT FUNCTIONS START HERE
  const exportFolderToPDF = (folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
      setNotification("Folder not found or contains no cards for export."); 
      return;
    }

    // Ensure other modals/viewers are closed before opening this one
    setStudyingFolder(null); 
    setIsFeedbackModalOpen(false);

    // Defer setting promptModalConfig to ensure it renders
    setTimeout(() => {
      setPromptModalConfig({
        title: 'Export to PDF',
        message: 'How many flashcards per page? (6, 8, or 10)',
        defaultValue: '8',
        onConfirm: (value) => {
          const cardsPerPage = parseInt(value, 10);
          if (![6, 8, 10].includes(cardsPerPage)) {
            setNotification("Invalid number. Please choose 6, 8, or 10."); 
            return; // Do not proceed if input is invalid
          }
          
          const doc = new jsPDF();
          const cards = folder.cards; 
          const pageW = doc.internal.pageSize.getWidth();
          const pageH = doc.internal.pageSize.getHeight();
          const layoutConfig = {
            6: { rows: 3, cols: 2, fontSize: 12 },
            8: { rows: 4, cols: 2, fontSize: 10 },
            10: { rows: 5, cols: 2, fontSize: 9 },
          };
          const config = layoutConfig[cardsPerPage];
          const margin = 15;
          const cardW = (pageW - (margin * (config.cols + 1))) / config.cols;
          const cardH = (pageH - 40 - (margin * (config.rows))) / config.rows;

          const drawHeader = () => {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(30);
              doc.setTextColor(139, 92, 246); // RGB for --primary-purple
              doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.setTextColor(31, 41, 55); // RGB for --content-bg (darker text for header)
              doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });
          };

          let currentPageIndex = 0;
          while (currentPageIndex < cards.length) {
            const pageCards = cards.slice(currentPageIndex, currentPageIndex + cardsPerPage);
            
            // Add page for Questions
            if (currentPageIndex > 0) doc.addPage();
            drawHeader();
            pageCards.forEach((card, index) => {
              const row = Math.floor(index / config.cols);
              const col = index % config.cols;
              const cardX = margin + (col * (cardW + margin));
              const cardY = 40 + (row * (cardH + margin));
              doc.setLineWidth(0.5);
              doc.setDrawColor(0);
              doc.setTextColor(0, 0, 0); // Black for card content
              doc.rect(cardX, cardY, cardW, cardH);
              doc.setFontSize(config.fontSize);
              const text = doc.splitTextToSize(`Q: ${card.question}`, cardW - 10);
              const textY = cardY + (cardH / 2) - ((text.length * config.fontSize) / 3.5);
              doc.text(text, cardX + cardW / 2, textY, { align: 'center' });
            });

            // Add page for Answers
            // Only add a new page for answers if there are more cards OR if this is the last page and it's not the very last card
            // This condition ensures we don't add an extra blank page at the very end if the last card's answer fits.
            if (pageCards.length > 0) { // Ensure there are cards on this "answer" page
              doc.addPage();
              drawHeader();
              pageCards.forEach((card, index) => {
                const row = Math.floor(index / config.cols);
                const col = index % config.cols;
                const cardX = margin + (col * (cardW + margin));
                const cardY = 40 + (row * (cardH + margin));
                doc.setLineWidth(0.5);
                doc.setDrawColor(0);
                doc.setTextColor(0, 0, 0); // Black for card content
                doc.rect(cardX, cardY, cardW, cardH);
                doc.setFontSize(config.fontSize);
                const text = doc.splitTextToSize(`A: ${card.answer}`, cardW - 10);
                const textY = cardY + (cardH / 2) - ((text.length * config.fontSize) / 3.5);
                doc.text(text, cardX + cardW / 2, textY, { align: 'center' });
              });
            }

            currentPageIndex += cardsPerPage;
          }
          
          doc.save(`${folder.name}-flashcards.pdf`);
          setPromptModalConfig(null); // Close modal after successful generation
        },
        onClose: () => {
          setPromptModalConfig(null); // Ensure modal closes on cancel
        }
      });
    }, 0); // Use setTimeout to defer state update
  };
  
  const exportFolderToCSV = (folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
      setNotification("Folder not found or contains no cards for export."); 
      return;
    }

    // Ensure other modals/viewers are closed before opening this one
    setStudyingFolder(null); 
    setIsFeedbackModalOpen(false);

    // Defer setting promptModalConfig to ensure it renders
    setTimeout(() => {
      setPromptModalConfig({
        title: 'Export to CSV',
        message: 'How many flashcards do you want to export?',
        defaultValue: folder.cards.length.toString(), // Default value should be a string
        onConfirm: (value) => {
          const numCards = parseInt(value, 10);
          if (isNaN(numCards) || numCards <= 0 || numCards > folder.cards.length) {
              setNotification(`Invalid number. Please enter a number between 1 and ${folder.cards.length}.`); 
              return; // Do not proceed if input is invalid
          }
          const cardsToExport = folder.cards.slice(0, numCards);
          
          let csvContent = "FlashFonic\nListen. Flash it. Learn.\n\n"; // Header for CSV
          csvContent += "Question,Answer\n";
          cardsToExport.forEach(card => {
              // Escape double quotes by doubling them, then wrap the whole field in double quotes
              const escapedQuestion = `"${card.question.replace(/"/g, '""')}"`;
              const escapedAnswer = `"${card.answer.replace(/"/g, '""')}"`;
              csvContent += `${escapedQuestion},${escapedAnswer}\n`;
          });
          
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${folder.name}-flashcards.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href); // Clean up the object URL
          setNotification(`Exported ${numCards} cards to ${folder.name}-flashcards.csv`);
          setPromptModalConfig(null); // Close modal after successful generation
        },
        onClose: () => {
          setPromptModalConfig(null); // Ensure modal closes on cancel
        }
      });
    }, 0); // Use setTimeout to defer state update
  };
  // REBUILT EXPORT FUNCTIONS END HERE

  const renderCardContent = (card, source, folderId = null) => {
    if (editingCard && editingCard.id === card.id) {
      return (
        <div className="edit-mode">
          <textarea className="edit-textarea" value={editingCard.question} onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })} />
          <textarea className="edit-textarea" value={editingCard.answer} onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })} />
          <div className="edit-actions">
            <button onClick={saveEdit} className="edit-save-btn">Save</button>
            <button onClick={() => setEditingCard(null)} className="edit-cancel-btn">Cancel</button>
          </div>
        </div>
      );
    }
    // Removed individual card move button as per request
    if (movingCard && movingCard.id === card.id) {
        // Build a flat list of all folders and subfolders for the dropdown
        const allFolders = [];
        const collectFolders = (currentFolders) => {
          for (const id in currentFolders) {
            allFolders.push(currentFolders[id]);
            collectFolders(currentFolders[id].subfolders);
          }
        };
        collectFolders(folders);
        const otherFolders = allFolders.filter(f => f.id !== folderId);

        return (
            <div className="move-mode">
                <p>Move to:</p>
                {otherFolders.length > 0 ? (
                    <div className="move-controls">
                        <select className="folder-select" defaultValue="" onChange={(e) => handleConfirmMove(e.target.value)}>
                            <option value="" disabled>Select a folder...</option>
                            {otherFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <button onClick={() => setMovingCard(null)} className="move-cancel-btn">Cancel</button>
                    </div>
                ) : ( <p className="subtle-text">No other folders to move to.</p> )}
            </div>
        );
    }
    return (
      <>
        <div className="card-top-actions">
          {/* Removed individual card move button: {source === 'folder' && <button onClick={() => startMove(card, folderId)} className="card-move-btn">⇄ Move</button>} */}
          <button onClick={() => startEditing(card, source, folderId)} className="edit-btn">Edit</button>
        </div>
        <p><strong>Q:</strong> {card.question}</p>
        <p><strong>A:</strong> {card.answer}</p>
      </>
    );
  };

  const formatListeningDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
  };

  const sliderValueToMinutes = (value) => {
    if (value <= 5) return value;
    if (value <= 16) return 5 + (value - 5) * 5;
    return 60 + (value - 16) * 10;
  };

  const minutesToSliderValue = (minutes) => {
    if (minutes <= 5) return minutes;
    if (minutes <= 60) return 5 + (minutes - 5) / 5;
    return 16 + (minutes - 60) / 10;
  };

  const formatAutoFlashInterval = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = seconds / 60;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const sliderToInterval = (value) => {
    if (value <= 4) return 20 + (value * 10);
    return 60 + (value - 4) * 30;
  };

  const intervalToSlider = (seconds) => {
    if (seconds <= 60) return (seconds - 20) / 10;
    return 4 + (seconds - 60) / 30;
  };

  // Helper function to format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to count all cards in a folder and its subfolders
  const countCardsRecursive = (folder) => {
    let count = folder.cards.length;
    for (const subfolderId in folder.subfolders) {
      count += countCardsRecursive(folder.subfolders[subfolderId]);
    }
    return count;
  };

  // Folder sorting logic
  const getSortedFolders = (folderObj) => {
    const folderArray = Object.values(folderObj);
    return folderArray.sort((a, b) => {
      if (folderSortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (folderSortBy === 'dateCreated') {
        return a.createdAt - b.createdAt;
      } else if (folderSortBy === 'lastViewed') {
        return b.lastViewed - a.lastViewed; // Most recent first
      }
      return 0;
    });
  };

  // Drag and drop for folders
  const handleFolderDragStart = (e, folderId) => {
    e.dataTransfer.setData("folderId", folderId);
    setDraggedFolderId(folderId);
  };

  const handleFolderDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleFolderDrop = (e, targetFolderId) => {
    e.preventDefault();
    const sourceFolderId = e.dataTransfer.getData("folderId");

    if (sourceFolderId === targetFolderId) {
      setDraggedFolderId(null);
      return;
    }

    setFolders(prevFolders => {
      // Find the folder and its parent in the nested structure
      let sourceFolder = null;
      let sourceParent = null;
      let targetFolder = null;
      let targetParent = null;

      const findAndExtract = (currentFolders, idToFind) => {
        for (const id in currentFolders) {
          if (currentFolders[id].id === idToFind) {
            const found = currentFolders[id];
            const newCurrentFolders = { ...currentFolders };
            delete newCurrentFolders[id];
            return [found, newCurrentFolders];
          }
          const [foundInSub, updatedSubfolders] = findAndExtract(currentFolders[id].subfolders, idToFind);
          if (foundInSub) {
            currentFolders[id].subfolders = updatedSubfolders;
            return [foundInSub, currentFolders];
          }
        }
        return [null, currentFolders];
      };

      const [draggedItem, updatedSourceParentFolders] = findAndExtract(prevFolders, sourceFolderId);
      if (!draggedItem) return prevFolders; // Should not happen

      // Now insert draggedItem into the target location
      const insertIntoTarget = (currentFolders, targetId, itemToInsert) => {
        const newFolders = { ...currentFolders };
        for (const id in newFolders) {
          if (newFolders[id].id === targetId) {
            // Insert at the same level as targetId
            const orderedKeys = Object.keys(newFolders);
            const targetIndex = orderedKeys.indexOf(targetId);
            orderedKeys.splice(targetIndex + 1, 0, itemToInsert.id); // Insert after target
            const reordered = {};
            orderedKeys.forEach(key => {
              reordered[key] = newFolders[key] || itemToInsert; // Use existing or inserted item
            });
            return reordered;
          }
          const updatedSubfolders = insertIntoTarget(newFolders[id].subfolders, targetId, itemToInsert);
          if (updatedSubfolders !== newFolders[id].subfolders) {
            newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
            return newFolders;
          }
        }
        // If targetId is not found, assume it's a top-level drop
        // This case might need more refinement depending on exact UX
        return { ...currentFolders, [itemToInsert.id]: itemToInsert };
      };

      return insertIntoTarget(updatedSourceParentFolders, targetId, draggedItem);
    });
    setDraggedFolderId(null);
  };

  const handleFolderDragEnd = () => {
    setDraggedFolderId(null);
  };

  // Handle opening/closing folder details and updating lastViewed
  const handleFolderToggle = (folderId, isOpen) => {
    console.log(`Toggling folder: ${folderId}, isOpen: ${isOpen}`); // Diagnostic log
    setExpandedFolderIds(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(folderId);
      } else {
        newSet.delete(folderId);
      }
      return newSet;
    });
    if (isOpen) {
      setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
        ...folder,
        lastViewed: Date.now()
      })));
    }
  };

  // Handle checkbox in expanded folder view
  const handleSelectedCardInExpandedFolder = (cardId) => {
    setSelectedCardsInExpandedFolder(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Move selected cards within an expanded folder to another folder
  const handleMoveSelectedCardsFromExpandedFolder = (sourceFolderId, destinationFolderId) => {
    if (!sourceFolderId || !destinationFolderId) {
      setNotification("Please select a destination folder.");
      return;
    }

    const cardsToMove = folders[sourceFolderId].cards.filter(card => selectedCardsInExpandedFolder[card.id]);
    if (cardsToMove.length === 0) {
      setNotification("Please select cards to move.");
      return;
    }

    setFolders(prev => {
      let newFolders = { ...prev };
      // Remove from source folder
      newFolders = updateFolderById(newFolders, sourceFolderId, (folder) => ({
        ...folder,
        cards: folder.cards.filter(card => !selectedCardsInExpandedFolder[card.id])
      }));
      // Add to destination folder
      newFolders = updateFolderById(newFolders, destinationFolderId, (folder) => ({
        ...folder,
        cards: [...folder.cards, ...cardsToMove]
      }));
      return newFolders;
    });
    setSelectedCardsInExpandedFolder({}); // Clear selection
    setNotification(`${cardsToMove.length} card(s) moved to ${findFolderById(folders, destinationFolderId)?.name}.`);
  };

  // Drag and drop for cards within expanded folder
  const handleCardInFolderDragStart = (e, cardId, folderId) => {
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceFolderId", folderId);
  };

  const handleCardInFolderDrop = (e, targetCardId, targetFolderId) => {
    e.preventDefault();
    const sourceCardId = e.dataTransfer.getData("cardId");
    const sourceFolderId = e.dataTransfer.getData("sourceFolderId");

    if (sourceFolderId !== targetFolderId) {
      // Moving between folders is handled by "Move to Folder" button for now
      return;
    }

    setFolders(prevFolders => updateFolderById(prevFolders, targetFolderId, (folder) => {
      const currentCards = [...folder.cards];
      
      const draggedIndex = currentCards.findIndex(card => card.id === sourceCardId);
      const targetIndex = currentCards.findIndex(card => card.id === targetCardId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return folder;
      }

      const [removed] = currentCards.splice(draggedIndex, 1);
      currentCards.splice(targetIndex, 0, removed);

      return { ...folder, cards: currentCards };
    }));
  };

  // NEW: Handler for when the study session ends to persist card updates
  const handleStudySessionEnd = (updatedDeck) => {
    if (studyingFolder && updatedDeck) {
      setFolders(prev => updateFolderById(prev, studyingFolder.id, (folder) => ({
        ...folder,
        cards: updatedDeck
      })));
    }
    setStudyingFolder(null);
  };

  // Recursive component to render folders and subfolders
  const FolderItem = ({ folder, level = 0, allFoldersForMoveDropdown }) => {
    // Check if this specific folder's ID is in the expandedFolderIds set
    const isExpanded = expandedFolderIds.has(folder.id); 
    const paddingLeft = level * 20; // Indentation for subfolders

    return (
      // Changed from <details> to <div>
      <div 
        key={folder.id} 
        className={`folder ${draggedFolderId === folder.id ? 'dragging' : ''}`}
        draggable
        onDragStart={(e) => handleFolderDragStart(e, folder.id)}
        onDragOver={handleFolderDragOver}
        onDrop={(e) => handleFolderDrop(e, folder.id)}
        onDragEnd={handleFolderDragEnd}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Changed from <summary> to <div> */}
        <div className="folder-summary-custom" onClick={(e) => {
          e.stopPropagation(); // Stop event bubbling
          handleFolderToggle(folder.id, !isExpanded);
        }}> 
          <div className="folder-item-header">
            <span className="folder-name-display">
              <span className={`folder-toggle-arrow ${isExpanded ? 'rotated' : ''}`}>▶</span> {/* Custom arrow */}
              {level > 0 && <span className="folder-icon">📁</span>} {/* Card icon for subfolders */}
              {folder.name}
              <span className="card-count-display"> ({countCardsRecursive(folder)} cards)</span>
            </span>
            <div className="folder-actions-right">
              {/* Small Study button is only visible when folder is NOT expanded */}
              {!isExpanded && (
                <button onClick={(e) => { 
                  e.stopPropagation(); 
                  setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards }); 
                  setModalConfig(null); // Close any other modals
                  setIsFeedbackModalOpen(false); // Close feedback modal
                }} className="study-btn-small">Study</button>
              )}
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="folder-expanded-content">
            <div className="folder-expanded-header">
              <h3 className="folder-expanded-name">{folder.name}</h3>
              <button onClick={() => { 
                if (isListening) stopListening(); 
                setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards }); 
                setModalConfig(null); // Close any other modals
                setIsFeedbackModalOpen(false); // Close feedback modal
              }} className="study-btn-large">Study</button>
              <div className="folder-expanded-actions">
                <ActionsDropdown 
                  folder={folder} // Pass the whole folder object
                  exportPdf={exportFolderToPDF} 
                  exportCsv={exportFolderToCSV} 
                  onAddSubfolder={(id) => {
                    setModalConfig({ type: 'createFolder', title: 'Add Subfolder', onConfirm: (name) => handleAddSubfolder(id, name) });
                    setStudyingFolder(null); // Close study viewer if open
                    setIsFeedbackModalOpen(false); // Close feedback modal
                  }}
                  onRenameFolder={(id, name) => {
                    setModalConfig({ type: 'prompt', title: 'Rename Folder', message: 'Enter new name for folder:', defaultValue: name, onConfirm: (newName) => handleRenameFolder(id, newName) });
                    setStudyingFolder(null); // Close study viewer if open
                    setIsFeedbackModalOpen(false); // Close feedback modal
                  }}
                  onDeleteFolder={(id) => {
                    setModalConfig({ type: 'confirm', message: `Are you sure you want to delete "${findFolderById(folders, id)?.name}"? This will also delete all subfolders and cards within it.`, onConfirm: () => handleDeleteFolder(id) });
                    setStudyingFolder(null); // Close study viewer if open
                    setIsFeedbackModalOpen(false); // Close feedback modal
                  }}
                />
              </div>
            </div>
            {/* Render subfolders */}
            {Object.values(folder.subfolders).length > 0 && (
              <div className="subfolder-list">
                {getSortedFolders(folder.subfolders).map(subfolder => (
                  <FolderItem 
                    key={subfolder.id} 
                    folder={subfolder} 
                    level={level + 1} 
                    allFoldersForMoveDropdown={allFoldersForMoveDropdown} 
                  />
                ))}
              </div>
            )}
            {/* Card list with checkboxes */}
            <div className="folder-card-list">
              {folder.cards.length > 0 ? folder.cards.map((card) => (
                <div 
                  key={card.id} 
                  className="card saved-card-in-folder"
                  draggable
                  onDragStart={(e) => handleCardInFolderDragStart(e, card.id, folder.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleCardInFolderDrop(e, card.id, folder.id)}
                >
                  <div className="card-selection">
                    <input type="checkbox" checked={!!selectedCardsInExpandedFolder[card.id]} onChange={() => handleSelectedCardInExpandedFolder(card.id)} />
                  </div>
                  <div className="card-content">
                    {renderCardContent(card, 'folder', folder.id)}
                    <button onClick={() => deleteCardFromFolder(folder.id, card.id)} className="card-delete-btn">🗑️</button>
                  </div>
                </div>
              )) : <p className="subtle-text">No cards in this folder yet.</p>}
            </div>
            <div className="folder-card-actions">
              <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
                <option value="" disabled>Move selected to...</option>
                {allFoldersForMoveDropdown.filter(f => f.id !== folder.id).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <button 
                onClick={() => handleMoveSelectedCardsFromExpandedFolder(folder.id, selectedFolderForMove)} 
                className="move-to-folder-btn"
                disabled={Object.keys(selectedCardsInExpandedFolder).length === 0 || !selectedFolderForMove}
              >
                Move Selected
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Collect all folders and subfolders for the move dropdown
  const getAllFoldersFlat = (foldersObj) => {
    let flatList = [];
    for (const id in foldersObj) {
      flatList.push(foldersObj[id]);
      flatList = flatList.concat(getAllFoldersFlat(foldersObj[id].subfolders));
    }
    return flatList;
  };
  const allFoldersForMoveDropdown = getAllFoldersFlat(folders);

  return (
    <>
      {studyingFolder && ( <FlashcardViewer key={studyingFolder.id} folderName={studyingFolder.name} cards={studyingFolder.cards} onClose={handleStudySessionEnd} /> )}
      {/* Conditionally render PromptModal based on promptModalConfig state */}
      {promptModalConfig && (
        <PromptModal
          title={promptModalConfig.title}
          message={promptModalConfig.message}
          defaultValue={promptModalConfig.defaultValue}
          onConfirm={promptModalConfig.onConfirm}
          onClose={promptModalConfig.onClose}
        />
      )}
      {modalConfig && modalConfig.type === 'createFolder' && ( <CreateFolderModal onClose={() => setModalConfig(null)} onCreate={modalConfig.onConfirm} title={modalConfig.title} /> )}
      {modalConfig && modalConfig.type === 'confirm' && ( <ConfirmModal onClose={() => setModalConfig(null)} onConfirm={modalConfig.onConfirm} message={modalConfig.message} /> )}
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} formspreeUrl="https://formspree.io/f/mvgqzvvb" />}

      <div className="header">
        <h1>FlashFonic</h1>
        <h2 className="subheading">Listen. Flash it. Learn.</h2>
      </div>
      <div className="mode-selector">
        <button onClick={() => handleModeChange('live')} className={appMode === 'live' ? 'active' : ''}>🔴 Live Capture</button>
        <button onClick={() => handleModeChange('upload')} className={appMode === 'upload' ? 'active' : ''}>⬆️ Upload File</button>
      </div>
      <div className="card main-controls" style={{position: 'relative'}}>
        {!isDevMode && (
          <div className="usage-counter">
            Beta Trial: {usage.limit - usage.count} cards left
          </div>
        )}

        {appMode === 'live' ? (
          <>
            <div className="listening-control">
              <button onClick={isListening ? stopListening : startListening} className={`start-stop-btn ${isListening ? 'active' : ''}`}>{isListening ? '■ Stop Listening' : '● Start Listening'}</button>
            </div>
            <div className="listening-modes">
              <button 
                onClick={() => setVoiceActivated(!voiceActivated)} 
                className={`voice-activate-btn ${voiceActivated ? 'active' : ''}`}
                disabled={isSafari}
                title={isSafari ? "Voice activation is not supported on Safari." : "Activate voice commands"}
              >
                Voice Activate
              </button>
              <button onClick={() => setIsAutoFlashOn(!isAutoFlashOn)} className={`autoflash-btn ${isAutoFlashOn ? 'active' : ''}`}>
                Auto-Flash <span className="beta-tag">Beta</span>
              </button>
            </div>
            
            {(() => {
              if (voiceActivated && isAutoFlashOn) {
                return (
                  <div className="voice-hint">
                    <p>🎤 Say "flash" to create a card.</p>
                    <p>⚡ Automatically creating a card every {formatAutoFlashInterval(autoFlashInterval)}.</p>
                  </div>
                );
              } else if (voiceActivated) {
                return <p className="voice-hint">🎤 Say "flash" to create a card.</p>;
              } else if (isAutoFlashOn) {
                return <p className="voice-hint">⚡ Automatically creating a card every {formatAutoFlashInterval(autoFlashInterval)}.</p>;
              }
              return null;
            })()}

            <div className="slider-container">
              <label htmlFor="timer-slider" className="slider-label">Listening Duration: <span className="slider-value">{formatListeningDuration(listeningDuration)}</span></label>
              <input id="timer-slider" type="range" min="1" max="22" step="1" value={minutesToSliderValue(listeningDuration)} onChange={(e) => setListeningDuration(sliderValueToMinutes(Number(e.target.value)))} disabled={isListening} />
            </div>
            {isAutoFlashOn && (
              <div className="slider-container">
              <label htmlFor="autoflash-slider" className="slider-label">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(autoFlashInterval)}</span></label>
              <input id="autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(autoFlashInterval)} onChange={(e) => setAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isListening} />
              </div>
            )}
            <div className="slider-container">
              <label htmlFor="duration-slider" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds of audio</span></label>
              <input id="duration-slider" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} disabled={isListening} />
            </div>
            <button 
              onClick={handleLiveFlashIt} 
              className={`flash-it-button ${isListening && !isGenerating && !isAutoFlashOn ? 'animated' : ''}`} 
              disabled={!isListening || isGenerating || isAutoFlashOn || (!isDevMode && usage.count >= usage.limit)}>
              {isGenerating ? 'Generating...' : '⚡ Flash It!'}
            </button>
          </>
        ) : (
          <>
            <div className="upload-button-container">
              <button onClick={triggerFileUpload}>{fileName ? 'Change File' : 'Select File'}</button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" style={{ display: 'none' }} />
            {fileName && <p className="file-name-display">Selected: {fileName}</p>}
            
            {mediaSrc && (
              <>
                <div className="player-container">
                  {fileType === 'video' ? (
                                <>
                                  <video 
                                    ref={videoPlayerRef} 
                                    src={mediaSrc} 
                                    playsInline 
                                    className="video-player"
                                    onClick={togglePlayPause}
                                  >
                                  </video>
                                  <div className="audio-player">
                                    <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                                    <div className="progress-bar-container" onClick={handleSeek}>
                                      <div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div>
                                    </div>
                                    <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                                  </div>
                                </>
                              ) : (
                                <div className="audio-player">
                                  <audio ref={audioPlayerRef} src={mediaSrc} />
                                  <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                                  <div className="progress-bar-container" onClick={handleSeek}>
                                    <div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div>
                                  </div>
                                  <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                                </div>
                              )}
                  </div>
                    <div className="listening-modes" style={{marginTop: '1rem'}}>
                          {fileType === 'video' && !audioCacheId && (
                                <button 
                                  onClick={handleProcessAudio} 
                                  className="autoflash-btn"
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? 'Processing...' : '🎧 Process Audio from Video'}
                                </button>
                              )}
                              <button onClick={() => setIsUploadAutoFlashOn(!isUploadAutoFlashOn)} className={`autoflash-btn ${isUploadAutoFlashOn ? 'active' : ''}`} disabled={fileType === 'video' && !audioCacheId}>
                                Auto-Flash <span className="beta-tag">Beta</span>
                              </button>
                          </div>
                          
                          {isUploadAutoFlashOn && (fileType === 'audio' || audioCacheId) && (
                            <>
                              <div className="slider-container">
                                <label htmlFor="upload-autoflash-slider" className="slider-label">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(uploadAutoFlashInterval)}</span></label>
                                <input id="upload-autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(uploadAutoFlashInterval)} onChange={(e) => setUploadAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isPlaying && isUploadAutoFlashOn} />
                              </div>
                              <p className="voice-hint" style={{marginTop: '1rem'}}>⚡ Automatically creating a card every {formatAutoFlashInterval(uploadAutoFlashInterval)}.</p>
                            </>
                          )}
                    </>
                  )}
                  <div className="slider-container" style={{ marginTop: '1rem' }}>
                    <label htmlFor="duration-slider-upload" className="slider-label">Capture Audio From: <span className="slider-value">{duration} seconds before current time</span></label>
                    <input id="duration-slider-upload" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                  </div>
                  <button 
                    onClick={handleUploadFlash} 
                    className={`flash-it-button ${mediaSrc && !isGenerating && !(isUploadAutoFlashOn && isPlaying) ? 'animated' : ''}`} 
                    disabled={!mediaSrc || isGenerating || (fileType === 'video' && !audioCacheId) || (isUploadAutoFlashOn && isPlaying) || (!isDevMode && usage.count >= usage.limit)}
                  >
                    {isGenerating ? 'Generating...' : '⚡ Flash It!'}
                  </button>
                </>
              )}
            </div>
            {notification && <p className="notification">{notification}</p>}
            {generatedFlashcards.length > 0 && (
              <div className="card generated-cards-queue">
                <div className="queue-header">
                  <h3>Review Queue</h3>
                  <button onClick={handleCheckAll} className="check-all-btn">Check All</button>
                </div>
                {generatedFlashcards.map(card => (
                  <div key={card.id} className="card generated-card">
                    <div className="card-selection">
                      <input type="checkbox" checked={!!checkedCards[card.id]} onChange={() => handleCardCheck(card.id)} />
                    </div>
                    <div className="card-content">
                      {renderCardContent(card, 'queue')}
                      <button onClick={() => deleteFromQueue(card.id)} className="card-delete-btn">🗑️</button>
                    </div>
                  </div>
                ))}
                <div className="folder-actions">
                  <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
                    <option value="" disabled>Select a folder...</option>
                    {allFoldersForMoveDropdown.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                  </select>
                  <button onClick={handleMoveToFolder} className="move-to-folder-btn">Move to Folder</button>
                </div>
              </div>
            )}
            <div className="card folders-container">
              <div className="folders-header">
                <h2 className="section-heading-left">Your Folders</h2>
                <button onClick={() => {
                  setModalConfig({ type: 'createFolder', onConfirm: handleCreateFolder });
                  setStudyingFolder(null); // Close study viewer if open
                  setIsFeedbackModalOpen(false); // Close feedback modal
                }} className="create-folder-btn">Create New Folder</button>
              </div>
              <div className="folder-sort-controls">
                <label htmlFor="folder-sort">Sort by:</label>
                <select id="folder-sort" className="folder-select" value={folderSortBy} onChange={(e) => setFolderSortBy(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="dateCreated">Date Created</option>
                  <option value="lastViewed">Last Viewed</option>
                </select>
              </div>
              <div className="folder-list">
                {Object.values(folders).length > 0 ? getSortedFolders(folders).map(folder => (
                  <FolderItem 
                    key={folder.id} 
                    folder={folder} 
                    level={0} 
                    allFoldersForMoveDropdown={allFoldersForMoveDropdown} 
                  />
                )) : <p className="subtle-text">No folders created yet.</p>}
              </div>
            </div>
            <div className="app-footer">
              <button className="feedback-btn" onClick={() => {
                setIsFeedbackModalOpen(true);
                setStudyingFolder(null); // Close study viewer if open
                setModalConfig(null); // Close other modals
              }}>Send Feedback</button>
            </div>
          </>
        );
      };

// --- HELPER COMPONENTS AND FUNCTIONS ---

// Component for the Actions dropdown
const ActionsDropdown = ({ folder, exportPdf, exportCsv, onAddSubfolder, onRenameFolder, onDeleteFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="actions-dropdown-container" ref={menuRef}>
      <button className="actions-tab" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>Actions</button>
      {isOpen && (
        <div className="actions-dropdown-menu">
          <button onClick={(e) => { e.stopPropagation(); onAddSubfolder(folder.id); setIsOpen(false); }}>Add Subfolder</button>
          <button onClick={(e) => { e.stopPropagation(); onRenameFolder(folder.id, folder.name); setIsOpen(false); }}>Rename Folder</button>
          <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); setIsOpen(false); }}>Delete Folder</button>
          <hr style={{borderTop: '1px solid var(--border-color)', margin: '0.5rem 0'}} />
          <button onClick={(e) => { e.stopPropagation(); exportPdf(folder.id); setIsOpen(false); }}>Export PDF</button>
          <button onClick={(e) => { e.stopPropagation(); exportCsv(folder.id); setIsOpen(false); }}>Export CSV</button>
        </div>
      )}
    </div>
  );
};


function encodeWAV(audioBuffer) {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i, sample;
    let offset = 0;
    let pos = 0;

    setUint32(0x46464952);  
    setUint32(length - 8);  
    setUint32(0x45564157);  

    setUint32(0x20746d66);  
    setUint32(16);  
    setUint16(1);  
    setUint16(numOfChan);
    setUint32(audioBuffer.sampleRate);
    setUint32(audioBuffer.sampleRate * 2 * numOfChan);  
    setUint16(numOfChan * 2);  
    setUint16(16);  

    setUint32(0x61746164);  
    setUint32(length - pos - 4);

    for (i = 0; i < audioBuffer.numberOfChannels; i++)
        channels.push(audioBuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([view], { type: 'audio/wav' });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}


const FeedbackModal = ({ onClose, formspreeUrl }) => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('Thanks for your feedback!');
        form.reset();
        setTimeout(onClose, 2000);
      } else {
        setStatus('Oops! There was a problem submitting your form.');
      }
    } catch (error) {
      setStatus('Oops! There was a problem submitting your form.');
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-content" onClick={e => e.stopPropagation()}>
        <h2>Send Beta Feedback</h2>
        <form className="feedback-form" onSubmit={handleSubmit} action={formspreeUrl} method="POST">
          <div className="form-group">
            <label htmlFor="email">Your Email (Optional)</label>
            <input id="email" type="email" name="email" className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="type">Feedback Type</label>
            <select id="type" name="type" className="form-select" defaultValue="General Comment">
              <option>General Comment</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" className="form-textarea" required />
          </div>
          <div className="feedback-modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-create-btn">Submit</button>
          </div>
          {status && <p style={{marginTop: '1rem', textAlign: 'center'}}>{status}</p>}
        </form>
      </div>
    </div>
  );
};

const FlashcardViewer = ({ folderName, cards, onClose }) => {
  const [deck, setDeck] = useState([...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [reviewMode, setReviewMode] = useState('all'); // 'all', 'flagged', 'needsReview'
  const [needsReviewDuration, setNeedsReviewDuration] = useState(24 * 3600 * 1000); // Default: 24 hours in ms
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechDelay, setSpeechDelay] = useState(3);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const speechTimeoutRef = useRef(null);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const voiceDropdownRef = useRef(null);

  const studyDeck = useMemo(() => {
    if (reviewMode === 'flagged') {
      return deck.filter(card => card.isFlagged);
    }
    if (reviewMode === 'needsReview') {
      const now = Date.now();
      return deck.filter(card => !card.lastViewed || (now - card.lastViewed) > needsReviewDuration)
                .sort((a, b) => (a.lastViewed || 0) - (b.lastViewed || 0)); // Show oldest first
    }
    return deck;
  }, [deck, reviewMode, needsReviewDuration]);

  const currentCard = studyDeck[currentIndex];

  // Effect to update the 'lastViewed' timestamp on the card in the main deck state
  useEffect(() => {
    if (isArrangeMode || !currentCard) return;

    const currentCardId = currentCard.id;
    const cardInDeck = deck.find(c => c.id === currentCardId);

    // Only update if it hasn't been viewed recently to avoid rapid updates
    if (cardInDeck && (!cardInDeck.lastViewed || (Date.now() - cardInDeck.lastViewed > 5000))) {
      setDeck(prevDeck => prevDeck.map(card =>
        card.id === currentCardId ? { ...card, lastViewed: Date.now() } : card
      ));
    }
  }, [currentIndex, studyDeck, isArrangeMode]); // Reruns when the card being viewed changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target)) {
        setIsVoiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
      setVoices(englishVoices);
      if (englishVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(englishVoices[0].name);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);
  const speak = (text, onEnd) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = speechRate;
    utterance.onend = onEnd;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  const stopReading = () => {
    setIsReading(false);
    window.speechSynthesis.cancel();
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
  };
  useEffect(() => {
    if (!isReading || !currentCard) return;
    const readCardSequence = () => {
      setIsFlipped(false);
      const questionText = `Question: ${currentCard.question}`;
      speak(questionText, () => {
        speechTimeoutRef.current = setTimeout(() => {
          setIsFlipped(true);
          const answerText = `Answer: ${currentCard.answer}`;
          speak(answerText, () => {
            setCurrentIndex(prev => (prev + 1) % studyDeck.length);
          });
        }, speechDelay * 1000);
      });
    };
    readCardSequence();
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimeoutRef.current);
    };
  }, [isReading, currentIndex, studyDeck, speechDelay, speechRate, selectedVoice, currentCard]);
  const handleCardClick = () => {
    if (studyDeck.length === 0) return;
    stopReading();
    setIsFlipped(prev => !prev);
  };
  const goToNext = () => {
    if (studyDeck.length === 0) return;
    stopReading();
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % studyDeck.length);
  };
  const goToPrev = () => {
    if (studyDeck.length === 0) return;
    stopReading();
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + studyDeck.length) % studyDeck.length);
  };
  const scrambleDeck = () => {
    stopReading();
    const newDeckOrder = [...deck].sort(() => Math.random() - 0.5);
    setDeck(newDeckOrder);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  const toggleFlag = (cardId) => {
    setDeck(prevDeck => prevDeck.map(card =>
      card.id === cardId ? { ...card, isFlagged: !card.isFlagged } : card
    ));
  };
  const handleReviewModeChange = (mode) => {
    stopReading();
    setReviewMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  const handleDragStart = (e, index) => e.dataTransfer.setData("cardIndex", index);
  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("cardIndex");
    const newDeck = [...deck];
    const [draggedItem] = newDeck.splice(dragIndex, 1);
    newDeck.splice(dropIndex, 0, draggedItem);
    setDeck(newDeck);
  };
  useEffect(() => { return () => stopReading(); }, []);

  const flaggedCount = useMemo(() => deck.filter(c => c.isFlagged).length, [deck]);

  return (
    <div className="viewer-overlay">
      <div className="viewer-header">
        <h2>Studying: {folderName}</h2>
        <button onClick={() => onClose(deck)} className="viewer-close-btn">&times;</button>
      </div>
      <div className="viewer-controls">
        <button onClick={scrambleDeck}>Scramble</button>
        <button onClick={() => setIsArrangeMode(!isArrangeMode)}>{isArrangeMode ? 'Study' : 'Arrange'}</button>
        <button onClick={() => handleReviewModeChange('all')} className={reviewMode === 'all' ? 'active' : ''}>Review All</button>
        <button onClick={() => handleReviewModeChange('flagged')} className={reviewMode === 'flagged' ? 'active' : ''}>{`Flagged (${flaggedCount})`}</button>
        <button onClick={() => handleReviewModeChange('needsReview')} className={reviewMode === 'needsReview' ? 'active' : ''}>Needs Review</button>
      </div>
      {reviewMode === 'needsReview' && (
        <div className="needs-review-controls">
          <label htmlFor="needs-review-select">Least viewed in:</label>
          <select
            id="needs-review-select"
            value={needsReviewDuration}
            onChange={(e) => setNeedsReviewDuration(Number(e.target.value))}
          >
            <option value={24 * 3600 * 1000}>Past 24 hours</option>
            <option value={2 * 24 * 3600 * 1000}>Past 48 hours</option>
            <option value={7 * 24 * 3600 * 1000}>Past week</option>
            <option value={30 * 24 * 3600 * 1000}>Past month</option>
          </select>
        </div>
      )}
      {isArrangeMode ? (
        <div className="arrange-container">
          <h3>Drag and drop to reorder</h3>
          {deck.map((card, index) => (
            <div key={card.id} className="arrange-card" draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)}>
              {index + 1}. {card.question}
            </div>
          ))}
        </div>
      ) : (
        <>
          {studyDeck.length > 0 ? (
            <>
              <div className="viewer-main" onClick={handleCardClick}>
                <div className={`viewer-card ${isFlipped ? 'is-flipped' : ''}`}>
                  <div className="card-face card-front">
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                    {reviewMode === 'needsReview' && currentCard.lastViewed && (
                      <div className="last-viewed-banner">
                        Last viewed: {new Date(currentCard.lastViewed).toLocaleDateString()}
                      </div>
                    )}
                    <p>{currentCard?.question}</p>
                  </div>
                  <div className="card-face card-back">
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                    {reviewMode === 'needsReview' && currentCard.lastViewed && (
                      <div className="last-viewed-banner">
                        Last viewed: {new Date(currentCard.lastViewed).toLocaleDateString()}
                      </div>
                    )}
                    <p>{currentCard?.answer}</p>
                  </div>
                </div>
              </div>
              <div className="viewer-nav">
                <button onClick={goToPrev}>&larr; Prev</button>
                <span>{currentIndex + 1} / {studyDeck.length}</span>
                <button onClick={goToNext} >Next &rarr;</button>
              </div>
            </>
          ) : (
            <div className="viewer-empty">
              <p>No cards to display in this mode.</p>
              {reviewMode === 'flagged' && <p>Flag some cards during your "Review All" session to study them here.</p>}
              {reviewMode === 'needsReview' && <p>All cards have been viewed recently. Adjust the duration to see more cards.</p>}
            </div>
          )}
          <div className="tts-controls">
            <button onClick={isReading ? stopReading : () => setIsReading(true)} className="tts-play-btn">{isReading ? '■ Stop Audio' : '▶ Play Audio'}</button>
            <div className="tts-slider-group custom-select-container" ref={voiceDropdownRef}>
              <label>Voice</label>
              <div className="custom-select-trigger" onClick={() => !isReading && setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}>
                {selectedVoice || 'Select a voice...'}
                <span className={`arrow ${isVoiceDropdownOpen ? 'up' : 'down'}`}></span>
              </div>
              {isVoiceDropdownOpen && (
                <div className="custom-select-options">
                  {voices.map(voice => (
                    <div key={voice.name} className="custom-select-option" onClick={() => { setSelectedVoice(voice.name); setIsVoiceDropdownOpen(false); }}>
                      {voice.name} ({voice.lang})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="tts-slider-group">
              <label>Front to back delay: {speechDelay}s</label>
              <input type="range" min="1" max="10" step="1" value={speechDelay} onChange={(e) => setSpeechDelay(Number(e.target.value))} disabled={isReading} />
            </div>
            <div className="tts-slider-group">
              <label>Speed: {speechRate}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(Number(e.target.value))} disabled={isReading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const CreateFolderModal = ({ onClose, onCreate, title = "Create New Folder" }) => {
  const [folderName, setFolderName] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) onCreate(folderName.trim());
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" className="modal-input" placeholder="Enter name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-create-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const PromptModal = ({ title, message, defaultValue, onClose, onConfirm }) => {
  const [value, setValue] = useState(defaultValue || '');
  // Diagnostic useEffect to see when modal renders and its value
  useEffect(() => {
    console.log(`PromptModal rendered: title='${title}', defaultValue='${defaultValue}', currentValue='${value}'`);
  }, [title, defaultValue, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`PromptModal handleSubmit triggered with value: ${value}`); // Diagnostic log
    if (value) onConfirm(value);
    // Call onClose immediately after onConfirm to ensure it closes
    onClose(); 
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p className="modal-message">{message}</p>
        <form onSubmit={handleSubmit}>
          <input type="text" className="modal-input" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-create-btn">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmModal = ({ message, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Action</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-create-btn danger" onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  if (isNaN(time) || time === 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- FINAL APP COMPONENT ---
function App() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return (
      <div className="main-app-container">
        <Analytics />
        <MainApp />
      </div>
    );
  } else {
    return (
      <>
        <Analytics />
        <LandingPage onEnter={() => setShowApp(true)} />
      </>
    );
  }
}

export default App;

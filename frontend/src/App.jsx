import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

// --- UTILITY FUNCTIONS ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- LANDING PAGE COMPONENT (Unchanged) ---
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
  // State variables... many are the same, some are new or modified
  const [appMode, setAppMode] = useState('live');
  const [isListening, setIsListening] = useState(false);
  const [notification, setNotification] = useState('');
  const [duration, setDuration] = useState(15);
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  
  // NEW: Updated folder structure to support nesting
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
  
  // NEW: Modal states for new folder actions
  const [modalState, setModalState] = useState({ type: null, data: null }); // 'createFolder', 'renameFolder', 'deleteFolder', 'prompt', 'feedback'
  
  const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
  const [movingCard, setMovingCard] = useState(null);
  const [listeningDuration, setListeningDuration] = useState(1);
  const [isAutoFlashOn, setIsAutoFlashOn] = useState(false);
  const [autoFlashInterval, setAutoFlashInterval] = useState(20);
  const [isUploadAutoFlashOn, setIsUploadAutoFlashOn] = useState(false);
  const [uploadAutoFlashInterval, setUploadAutoFlashInterval] = useState(20);
  const [usage, setUsage] = useState({ count: 0, limit: 25, date: '' });
  const [isDevMode, setIsDevMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioCacheId, setAudioCacheId] = useState(null);
  const [isSafari, setIsSafari] = useState(false);

  // Refs...
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
  const isAutoFlashOnRef = useRef(isAutoFlashOn);

  // --- Effects for Initialization and Persistence ---
  
  useEffect(() => { isGeneratingRef.current = isGenerating; }, [isGenerating]);
  useEffect(() => { isAutoFlashOnRef.current = isAutoFlashOn; }, [isAutoFlashOn]);

  useEffect(() => {
    const safariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safariCheck);
    if (safariCheck) {
      console.log("Safari browser detected. Voice Activation will be disabled.");
    }
  }, []);

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

  useEffect(() => {
    const storedFolders = localStorage.getItem('flashfonic-folders-nested');
    if (storedFolders) {
        setFolders(JSON.parse(storedFolders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flashfonic-folders-nested', JSON.stringify(folders));
  }, [folders]);

  // --- Recursive Helper Functions for Nested Folders ---

  const findFolder = (folderId, currentFolders = folders) => {
    for (const id in currentFolders) {
        if (id === folderId) return currentFolders[id];
        const found = findFolder(folderId, currentFolders[id].subfolders);
        if (found) return found;
    }
    return null;
  };

  const updateFolderRecursive = (targetId, updateFn, currentFolders) => {
    const newFolders = { ...currentFolders };
    for (const id in newFolders) {
      if (id === targetId) {
        newFolders[id] = updateFn(newFolders[id]);
        return newFolders;
      }
      if (Object.keys(newFolders[id].subfolders).length > 0) {
        const updatedSubfolders = updateFolderRecursive(targetId, updateFn, newFolders[id].subfolders);
        if (updatedSubfolders !== newFolders[id].subfolders) {
            newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
            return newFolders;
        }
      }
    }
    return newFolders;
  };

  const deleteFolderRecursive = (targetId, currentFolders) => {
    const newFolders = { ...currentFolders };
    if (newFolders[targetId]) {
      delete newFolders[targetId];
      return newFolders;
    }
    for (const id in newFolders) {
      const updatedSubfolders = deleteFolderRecursive(targetId, newFolders[id].subfolders);
      if (updatedSubfolders !== newFolders[id].subfolders) {
        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
        return newFolders;
      }
    }
    return newFolders;
  };


  // --- Core API and Business Logic ---

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
        
        // NEW: Add SRS properties to new cards
        const newCard = { ...data, id: generateId(), lastReviewed: null, reviewCount: 0 };
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
        requestBody.audioId = audioCacheId;
    } else {
        if (!uploadedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            requestBody.audio_data = base64Audio;
            generateFlashcardRequest(requestBody);
        };
        return; 
    }
    generateFlashcardRequest(requestBody);
  }, [uploadedFile, audioCacheId, duration, usage, isDevMode, fileType, generateFlashcardRequest]);

  // --- Folder and Card Management ---

  const handleCreateFolder = (folderName, parentId = null) => {
    const newFolder = {
      id: generateId(),
      name: folderName,
      cards: [],
      subfolders: {},
    };

    if (parentId) {
      setFolders(prev => updateFolderRecursive(parentId, (parent) => ({
        ...parent,
        subfolders: { ...parent.subfolders, [newFolder.id]: newFolder }
      }), prev));
    } else {
      setFolders(prev => ({ ...prev, [newFolder.id]: newFolder }));
    }
    setModalState({ type: null, data: null });
  };
  
  const handleRenameFolder = (folderId, newName) => {
    setFolders(prev => updateFolderRecursive(folderId, (folder) => ({
      ...folder,
      name: newName
    }), prev));
    setModalState({ type: null, data: null });
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prev => deleteFolderRecursive(folderId, prev));
    setModalState({ type: null, data: null });
  };
  
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

    const targetFolder = findFolder(selectedFolderForMove);
    if (!targetFolder) {
        setNotification("Error: Target folder not found.");
        return;
    }

    setFolders(prev => updateFolderRecursive(selectedFolderForMove, (folder) => ({
      ...folder,
      cards: [...folder.cards, ...cardsToMove]
    }), prev));
    
    setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
    setCheckedCards({});
    setSelectedFolderForMove('');
    setNotification(`${cardsToMove.length} card(s) moved to ${targetFolder.name}.`);
  };

  const deleteCardFromFolder = (folderId, cardId) => {
    setFolders(prev => updateFolderRecursive(folderId, (folder) => ({
      ...folder,
      cards: folder.cards.filter(card => card.id !== cardId)
    }), prev));
  };
  
  // NEW: Update card properties (for SRS)
  const updateCardInFolder = (folderId, cardId, updateData) => {
      setFolders(prev => updateFolderRecursive(folderId, (folder) => ({
          ...folder,
          cards: folder.cards.map(card => card.id === cardId ? { ...card, ...updateData } : card)
      }), prev));
  };

  const deleteFromQueue = (cardId) => {
    setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  const startEditing = (card, source, folderId = null) => {
    setEditingCard({ ...card, source, folderId });
    setMovingCard(null);
  };

  const saveEdit = () => {
    if (!editingCard) return;
    const { id, question, answer, source, folderId } = editingCard;
    if (source === 'queue') {
      setGeneratedFlashcards(prev => 
        prev.map(card => card.id === id ? { ...card, question, answer } : card)
      );
    } else if (source === 'folder' && folderId) {
      setFolders(prev => updateFolderRecursive(folderId, (folder) => ({
        ...folder,
        cards: folder.cards.map(card => 
          card.id === id ? { ...card, question, answer } : card
        )
      }), prev));
    }
    setEditingCard(null);
  };
  
  // --- AI Notes Generation (Front-end part) ---
  const generateAINotes = async (folderId) => {
      const folder = findFolder(folderId);
      if (!folder || folder.cards.length === 0) {
          setNotification("Folder is empty or not found.");
          return;
      }
      setNotification(`Generating AI notes for "${folder.name}"...`);
      setIsGenerating(true);

      try {
          // This will be connected to the new backend endpoint
          // For now, we'll simulate the response
          // const response = await fetch('YOUR_BACKEND_URL/generate-notes', { ... });
          // const { notes } = await response.json();
          
          // --- MOCK RESPONSE ---
          await new Promise(res => setTimeout(res, 2000)); // Simulate network delay
          const notes = folder.cards.map(c => `- ${c.question}: ${c.answer}`).join('\n');
          // --- END MOCK ---
          
          const doc = new jsPDF();
          const pageW = doc.internal.pageSize.getWidth();
          
          // PDF Header
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(30);
          doc.setTextColor("#8B5CF6");
          doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(16);
          doc.setTextColor("#1F2937");
          doc.text(`AI Notes for: ${folder.name}`, pageW / 2, 30, { align: 'center' });
          
          // PDF Body
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          const splitText = doc.splitTextToSize(notes, pageW - 40);
          doc.text(splitText, 20, 50);

          doc.save(`${folder.name}-ai-notes.pdf`);
          setNotification("AI notes generated and downloaded!");

      } catch (error) {
          console.error("Error generating AI notes:", error);
          setNotification(`Error: ${error.message}`);
      } finally {
          setIsGenerating(false);
      }
  };


  // --- UI and Component Rendering ---

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
    return (
      <>
        <div className="card-top-actions">
          <button onClick={() => startEditing(card, source, folderId)} className="edit-btn">Edit</button>
        </div>
        <p><strong>Q:</strong> {card.question}</p>
        <p><strong>A:</strong> {card.answer}</p>
      </>
    );
  };

  const renderFolderTreeOptions = (folders, level = 0) => {
    let options = [];
    for (const id in folders) {
        const folder = folders[id];
        options.push(<option key={id} value={id}>{'--'.repeat(level)} {folder.name}</option>);
        if (Object.keys(folder.subfolders).length > 0) {
            options = options.concat(renderFolderTreeOptions(folder.subfolders, level + 1));
        }
    }
    return options;
  };

  // ... other functions like startListening, stopListening, handleFileChange, etc. remain largely the same ...
  // For brevity, I'll omit the unchanged functions but they are still part of the component.
  // Assume startListening, stopListening, handleModeChange, handleFileChange, triggerFileUpload,
  // togglePlayPause, handleSeek, and all the formatters and slider calculators are here.
    
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

  const triggerFileUpload = () => { fileInputRef.current.click(); }

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
  
  const handleCardCheck = (cardId) => { setCheckedCards(prev => ({ ...prev, [cardId]: !prev[cardId] })); };

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
  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {studyingFolder && (
          <FlashcardViewer 
              folderId={studyingFolder.id}
              folderName={studyingFolder.name} 
              cards={studyingFolder.cards} 
              onClose={() => setStudyingFolder(null)}
              // NEW: Pass down action handlers
              onDeleteCard={deleteCardFromFolder}
              onUpdateCard={updateCardInFolder}
          />
      )}
      
      {/* NEW: Centralized modal rendering */}
      <ModalManager
        modalState={modalState}
        onClose={() => setModalState({ type: null, data: null })}
        actions={{ handleCreateFolder, handleRenameFolder, handleDeleteFolder }}
        formspreeUrl="https://formspree.io/f/mvgqzvvb"
      />

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
              {renderFolderTreeOptions(folders)}
            </select>
            <button onClick={handleMoveToFolder} className="move-to-folder-btn">Move to Folder</button>
          </div>
        </div>
      )}
      <div className="card folders-container">
        <h2 className="section-heading">Your Folders</h2>
        <button onClick={() => setModalState({ type: 'createFolder', data: { parentId: null } })} className="create-folder-btn">Create New Folder</button>
        <div className="folder-list">
          {Object.keys(folders).length > 0 ? 
            <FolderTree 
              folders={folders} 
              onSetModal={setModalState}
              onSetStudyingFolder={setStudyingFolder}
              onGenerateAINotes={generateAINotes}
              isListening={isListening}
              stopListening={stopListening}
              renderCardContent={renderCardContent}
              deleteCardFromFolder={deleteCardFromFolder}
            />
            : <p className="subtle-text">No folders created yet.</p>}
        </div>
      </div>
      <div className="app-footer">
        <button className="feedback-btn" onClick={() => setModalState({ type: 'feedback' })}>Send Feedback</button>
      </div>
    </>
  );
};

// --- NEW COMPONENT: FolderTree (for recursive rendering) ---
const FolderTree = ({ folders, onSetModal, onSetStudyingFolder, onGenerateAINotes, isListening, stopListening, renderCardContent, deleteCardFromFolder, level = 0 }) => {
    
    // NEW: Spaced Repetition Logic
    const getCardsNeedingReview = (cards) => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return cards.filter(card => !card.lastReviewed || new Date(card.lastReviewed) < oneWeekAgo);
    };

    const startStudySession = (folder, mode = 'normal') => {
        if (isListening) stopListening();
        let cardsToStudy = [...folder.cards];
        if (mode === 'review') {
            cardsToStudy.sort((a, b) => {
                const dateA = a.lastReviewed ? new Date(a.lastReviewed) : 0;
                const dateB = b.lastReviewed ? new Date(b.lastReviewed) : 0;
                return dateA - dateB;
            });
        }
        onSetStudyingFolder({ id: folder.id, name: folder.name, cards: cardsToStudy });
    };

    return (
        <div className="folder-level" style={{ marginLeft: `${level * 20}px` }}>
            {Object.values(folders).map(folder => {
                const cardsNeedingReview = getCardsNeedingReview(folder.cards);
                return (
                    <details key={folder.id} className="folder">
                        <summary onClick={(e) => { if (e.target.closest('button, .folder-actions-menu')) e.preventDefault(); }}>
                            <div className="folder-summary">
                                <span>{folder.name} ({folder.cards.length} {folder.cards.length === 1 ? 'card' : 'cards'})</span>
                                <div className="folder-export-buttons">
                                    <button onClick={() => startStudySession(folder)} className="study-btn">Study</button>
                                    {cardsNeedingReview.length > 0 && (
                                        <button onClick={() => startStudySession(folder, 'review')} className="review-btn">
                                            Needs Review ({cardsNeedingReview.length})
                                        </button>
                                    )}
                                    <button onClick={() => onGenerateAINotes(folder.id)}>AI Notes</button>
                                    <button onClick={() => { /* PDF Export Logic Here */ }}>Export PDF</button>
                                    <button onClick={() => { /* CSV Export Logic Here */ }}>Export CSV</button>
                                </div>
                            </div>
                            <FolderActionsMenu folder={folder} onSetModal={onSetModal} />
                        </summary>
                        {folder.cards.map((card) => (
                            <div key={card.id} className="card saved-card-in-folder">
                                <div className="card-content">
                                    {renderCardContent(card, 'folder', folder.id)}
                                    <button onClick={() => deleteCardFromFolder(folder.id, card.id)} className="card-delete-btn">🗑️</button>
                                </div>
                            </div>
                        ))}
                        {Object.keys(folder.subfolders).length > 0 && (
                            <FolderTree 
                                folders={folder.subfolders} 
                                onSetModal={onSetModal}
                                onSetStudyingFolder={onSetStudyingFolder}
                                onGenerateAINotes={onGenerateAINotes}
                                isListening={isListening}
                                stopListening={stopListening}
                                renderCardContent={renderCardContent}
                                deleteCardFromFolder={deleteCardFromFolder}
                                level={level + 1} 
                            />
                        )}
                    </details>
                );
            })}
        </div>
    );
};

// --- NEW COMPONENT: FolderActionsMenu ---
const FolderActionsMenu = ({ folder, onSetModal }) => {
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

    const handleAction = (type) => {
        onSetModal({ type, data: { folderId: folder.id, currentName: folder.name, parentId: folder.id } });
        setIsOpen(false);
    };

    return (
        <div className="folder-actions-menu" ref={menuRef}>
            <button className="menu-trigger-btn" onClick={() => setIsOpen(!isOpen)}>⋮</button>
            {isOpen && (
                <div className="menu-dropdown">
                    <button onClick={() => handleAction('createFolder')}>Add Subfolder</button>
                    <button onClick={() => handleAction('renameFolder')}>Rename</button>
                    <button onClick={() => handleAction('deleteFolder')}>Delete</button>
                </div>
            )}
        </div>
    );
};

// --- NEW COMPONENT: ModalManager ---
const ModalManager = ({ modalState, onClose, actions, formspreeUrl }) => {
    if (!modalState.type) return null;

    switch (modalState.type) {
        case 'createFolder':
            return <CreateFolderModal onClose={onClose} onCreate={actions.handleCreateFolder} parentId={modalState.data?.parentId} />;
        case 'renameFolder':
            return <RenameFolderModal onClose={onClose} onRename={actions.handleRenameFolder} folderId={modalState.data.folderId} currentName={modalState.data.currentName} />;
        case 'deleteFolder':
            return <DeleteFolderModal onClose={onClose} onDelete={actions.handleDeleteFolder} folderId={modalState.data.folderId} folderName={modalState.data.currentName} />;
        case 'feedback':
            return <FeedbackModal onClose={onClose} formspreeUrl={formspreeUrl} />;
        // case 'prompt': return <PromptModal {...modalState.data} onClose={onClose} />;
        default:
            return null;
    }
};

// --- HELPER COMPONENTS (Modals, Viewer, etc.) ---

const FlashcardViewer = ({ folderId, folderName, cards, onClose, onDeleteCard, onUpdateCard }) => {
  const [deck, setDeck] = useState([...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [flaggedCards, setFlaggedCards] = useState({});
  const [reviewMode, setReviewMode] = useState('all');
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechDelay, setSpeechDelay] = useState(3);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const speechTimeoutRef = useRef(null);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const voiceDropdownRef = useRef(null);
  
  const studyDeck = reviewMode === 'flagged' 
    ? deck.filter(card => flaggedCards[card.id]) 
    : deck;
  const currentCard = studyDeck[currentIndex];

  useEffect(() => {
    // NEW: Update card's lastReviewed timestamp when it's viewed
    if (currentCard) {
        onUpdateCard(folderId, currentCard.id, { lastReviewed: new Date().toISOString() });
    }
  }, [currentIndex, folderId, onUpdateCard, currentCard]);

  const handleDeleteCurrentCard = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete this card?\n\nQ: ${currentCard.question}`)) {
        onDeleteCard(folderId, currentCard.id);
        // Remove from local deck and advance
        const newDeck = deck.filter(c => c.id !== currentCard.id);
        setDeck(newDeck);
        if (currentIndex >= newDeck.length) {
            setCurrentIndex(Math.max(0, newDeck.length - 1));
        }
    }
  };

  // ... rest of the FlashcardViewer component is largely the same ...
  // For brevity, I'll omit the unchanged parts like voice selection, TTS logic, etc.
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
        setFlaggedCards(prev => {
        const newFlags = {...prev};
        if (newFlags[cardId]) delete newFlags[cardId];
        else newFlags[cardId] = true;
        return newFlags;
        });
    };
    const toggleReviewMode = () => {
        stopReading();
        setReviewMode(prev => prev === 'all' ? 'flagged' : 'all');
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

  return (
    <div className="viewer-overlay">
      <div className="viewer-header">
        <h2>Studying: {folderName} {reviewMode === 'flagged' ? `(Flagged)` : ''}</h2>
        <button onClick={onClose} className="viewer-close-btn">&times;</button>
      </div>
      <div className="viewer-controls">
        <button onClick={scrambleDeck}>Scramble</button>
        <button onClick={() => setIsArrangeMode(!isArrangeMode)}>{isArrangeMode ? 'Study' : 'Arrange'}</button>
        <button onClick={toggleReviewMode}>{reviewMode === 'all' ? `Review Flagged (${Object.keys(flaggedCards).length})` : 'Review All'}</button>
      </div>
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
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>&#9873;</button>
                    {/* NEW: Delete button in study mode */}
                    <button onClick={handleDeleteCurrentCard} className="card-delete-btn viewer-delete-btn">🗑️</button>
                    <p>{currentCard?.question}</p>
                  </div>
                  <div className="card-face card-back">
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>&#9873;</button>
                    {/* NEW: Delete button in study mode */}
                    <button onClick={handleDeleteCurrentCard} className="card-delete-btn viewer-delete-btn">🗑️</button>
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
              {deck.length === 0 && <p>This folder is now empty.</p>}
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

const CreateFolderModal = ({ onClose, onCreate, parentId }) => {
  const [folderName, setFolderName] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) onCreate(folderName.trim(), parentId);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{parentId ? 'Create Subfolder' : 'Create New Folder'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" className="modal-input" placeholder="Enter folder name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-create-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RenameFolderModal = ({ onClose, onRename, folderId, currentName }) => {
    const [newName, setNewName] = useState(currentName);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim() && newName.trim() !== currentName) {
            onRename(folderId, newName.trim());
        } else {
            onClose();
        }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Rename Folder</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="modal-input" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Rename</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteFolderModal = ({ onClose, onDelete, folderId, folderName }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Delete Folder</h2>
                <p className="modal-message">Are you sure you want to delete the folder "{folderName}" and all of its contents? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button type="button" className="modal-delete-btn" onClick={() => onDelete(folderId)}>Delete</button>
                </div>
            </div>
        </div>
    );
};

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
                headers: { 'Accept': 'application/json' }
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

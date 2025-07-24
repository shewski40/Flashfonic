import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

// --- UTILITY FUNCTIONS ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const timeSince = (date) => {
    if (!date) return "never";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
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
          <div className="step"><div className="step-number">1</div><h3>CAPTURE</h3><p>Record live audio or upload a file.</p></div>
          <div className="step"><div className="step-number">2</div><h3>AI GENERATE</h3><p>Our AI transcribes and creates a Q&A flashcard.</p></div>
          <div className="step"><div className="step-number">3</div><h3>STUDY</h3><p>Master your material with our advanced study tools.</p></div>
        </div>
      </section>
      <section className="features-section">
        <h2>A Smarter Way to Learn</h2>
        <div className="features-grid">
          <div className="feature-card"><h3>🤖 Revolutionary Audio-to-Card AI</h3><p>Stop typing, start talking. Our cutting-edge AI listens, transcribes, and intelligently crafts flashcards for you. Perfect for lectures, brainstorming, and hands-free learning.</p></div>
          <div className="feature-card"><h3>⚡️ Hands-Free Capture Modes</h3><p>Stay in the zone. Use the "Flash It!" voice command to manually create cards, or enable <strong>Auto-Flash</strong> to automatically generate a new card at set intervals during a lecture. Learning has never been this passive and powerful.</p></div>
          <div className="feature-card"><h3>📚 Advanced Study Suite</h3><p>Study your way. Flip, scramble, and flag cards. Listen to your deck with our Text-to-Speech engine, and even reorder cards with a simple drag-and-drop.</p></div>
          <div className="feature-card"><h3>📂 Organize & Export with Ease</h3><p>Keep your subjects sorted in folders. When you're ready to study offline, export any deck to a professional PDF or a simple CSV file in seconds.</p></div>
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
  const [folders, setFolders] = useState({});
  const [folderOrder, setFolderOrder] = useState([]);
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
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
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
  const isGeneratingRef = useRef(isGenerating);
  const isAutoFlashOnRef = useRef(isAutoFlashOn);

  useEffect(() => { isGeneratingRef.current = isGenerating; }, [isGenerating]);
  useEffect(() => { isAutoFlashOnRef.current = isAutoFlashOn; }, [isAutoFlashOn]);

  useEffect(() => {
    const safariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safariCheck);
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
      currentUsage = storedUsage.date === today ? storedUsage : { ...storedUsage, count: 0, date: today };
    }
    setUsage(currentUsage);
    localStorage.setItem('flashfonic-usage', JSON.stringify(currentUsage));
  }, []);

  useEffect(() => {
    const storedFolders = localStorage.getItem('flashfonic-folders-nested');
    const storedOrder = localStorage.getItem('flashfonic-folder-order');
    if (storedFolders) {
        const parsedFolders = JSON.parse(storedFolders);
        setFolders(parsedFolders);
        const validOrder = JSON.parse(storedOrder || '[]').filter(id => parsedFolders[id]);
        const existingKeys = Object.keys(parsedFolders);
        const newKeys = existingKeys.filter(k => !validOrder.includes(k));
        setFolderOrder([...validOrder, ...newKeys]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flashfonic-folders-nested', JSON.stringify(folders));
    localStorage.setItem('flashfonic-folder-order', JSON.stringify(folderOrder));
  }, [folders, folderOrder]);

  const findFolder = useCallback((folderId, currentFolders = folders) => {
    for (const id in currentFolders) {
        if (id === folderId) return currentFolders[id];
        if (currentFolders[id].subfolders) {
            const found = findFolder(folderId, currentFolders[id].subfolders);
            if (found) return found;
        }
    }
    return null;
  }, [folders]);

  const updateFolderRecursive = (targetId, updateFn, currentFolders) => {
    const newFolders = { ...currentFolders };
    for (const id in newFolders) {
      if (id === targetId) {
        newFolders[id] = updateFn(newFolders[id]);
        return newFolders;
      }
      if (newFolders[id].subfolders && Object.keys(newFolders[id].subfolders).length > 0) {
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
      if (newFolders[id].subfolders) {
          const updatedSubfolders = deleteFolderRecursive(targetId, newFolders[id].subfolders);
          if (updatedSubfolders !== newFolders[id].subfolders) {
            newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
            return newFolders;
          }
      }
    }
    return newFolders;
  };

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
        if (!response.ok) throw new Error(data.error || 'Failed to generate flashcard.');
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
      setNotification(`You have 0 cards left for today.`);
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
  
  const handleUploadFlash = useCallback(async () => {
    if (!isDevMode && usage.count >= usage.limit) {
      setNotification(`You have 0 cards left for today.`);
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
            requestBody.audio_data = reader.result.split(',')[1];
            generateFlashcardRequest(requestBody);
        };
        return; 
    }
    generateFlashcardRequest(requestBody);
  }, [uploadedFile, audioCacheId, duration, usage, isDevMode, fileType, generateFlashcardRequest]);

  useEffect(() => {
    if (isListening && isAutoFlashOn) {
      autoFlashTimerRef.current = setInterval(handleLiveFlashIt, autoFlashInterval * 1000);
    }
    return () => {
      if (autoFlashTimerRef.current) clearInterval(autoFlashTimerRef.current);
    };
  }, [isListening, isAutoFlashOn, autoFlashInterval, handleLiveFlashIt]);
  
  useEffect(() => {
    if (appMode === 'upload' && isUploadAutoFlashOn && isPlaying && (fileType === 'audio' || audioCacheId)) {
        setNotification(`Auto-Flash started. Generating a card every ${formatAutoFlashInterval(uploadAutoFlashInterval)}.`);
        uploadAutoFlashTimerRef.current = setInterval(handleUploadFlash, uploadAutoFlashInterval * 1000);
    }
    return () => {
      if (uploadAutoFlashTimerRef.current) clearInterval(uploadAutoFlashTimerRef.current);
    };
  }, [appMode, isUploadAutoFlashOn, isPlaying, uploadAutoFlashInterval, handleUploadFlash, fileType, audioCacheId]);


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
            if (!response.ok) throw new Error(data.error || 'Failed to process audio.');
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

  const handleCreateFolder = (folderName, parentId = null) => {
    const newFolder = { id: generateId(), name: folderName, cards: [], subfolders: {}, createdAt: new Date().toISOString(), lastViewed: null };
    if (parentId) {
      setFolders(prev => updateFolderRecursive(parentId, p => ({ ...p, subfolders: { ...p.subfolders, [newFolder.id]: newFolder } }), prev));
    } else {
      setFolders(prev => ({ ...prev, [newFolder.id]: newFolder }));
      setFolderOrder(prev => [...prev, newFolder.id]);
    }
    setModalState({ type: null, data: null });
  };
  
  const handleRenameFolder = (folderId, newName) => {
    setFolders(prev => updateFolderRecursive(folderId, f => ({ ...f, name: newName }), prev));
    setModalState({ type: null, data: null });
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prev => deleteFolderRecursive(folderId, prev));
    setFolderOrder(prev => prev.filter(id => id !== folderId));
    setModalState({ type: null, data: null });
  };
  
  const handleMoveToFolder = (cardsToMoveIds, destinationFolderId, sourceFolderId = null) => {
    if (!destinationFolderId) {
        setNotification("Please select a destination folder.");
        return;
    }
    
    let cardsToMove = [];
    if (sourceFolderId) {
        // Moving from within an expanded folder
        const sourceFolder = findFolder(sourceFolderId);
        cardsToMove = sourceFolder.cards.filter(c => cardsToMoveIds[c.id]);
        setFolders(prev => updateFolderRecursive(sourceFolderId, f => ({...f, cards: f.cards.filter(c => !cardsToMoveIds[c.id])}), prev));
    } else {
        // Moving from the review queue
        cardsToMove = generatedFlashcards.filter(c => cardsToMoveIds[c.id]);
        setGeneratedFlashcards(prev => prev.filter(c => !cardsToMoveIds[c.id]));
    }

    if (cardsToMove.length === 0) {
        setNotification("No cards were selected to move.");
        return;
    }

    const targetFolder = findFolder(destinationFolderId);
    setFolders(prev => updateFolderRecursive(destinationFolderId, f => ({ ...f, cards: [...f.cards, ...cardsToMove] }), prev));
    setNotification(`${cardsToMove.length} card(s) moved to ${targetFolder.name}.`);
    setCheckedCards({}); // Clear selection in both cases
  };

  const deleteCardFromFolder = (folderId, cardId) => {
    setFolders(prev => updateFolderRecursive(folderId, f => ({ ...f, cards: f.cards.filter(c => c.id !== cardId) }), prev));
  };
  
  const updateCardInFolder = (folderId, cardId, updateData) => {
      setFolders(prev => updateFolderRecursive(folderId, f => ({ ...f, cards: f.cards.map(c => c.id === cardId ? { ...c, ...updateData } : c) }), prev));
  };

  const deleteFromQueue = (cardId) => {
    setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  const startEditing = (card, source, folderId = null) => {
    setEditingCard({ ...card, source, folderId });
  };

  const saveEdit = () => {
    if (!editingCard) return;
    const { id, question, answer, source, folderId } = editingCard;
    if (source === 'queue') {
      setGeneratedFlashcards(prev => prev.map(c => c.id === id ? { ...c, question, answer } : c));
    } else if (source === 'folder' && folderId) {
      setFolders(prev => updateFolderRecursive(folderId, f => ({ ...f, cards: f.cards.map(c => c.id === id ? { ...c, question, answer } : c) }), prev));
    }
    setEditingCard(null);
  };
  
  const generateAINotes = async (folderId) => {
      const folder = findFolder(folderId);
      if (!folder || folder.cards.length === 0) {
          setNotification("Folder is empty or not found.");
          return;
      }
      setNotification(`Generating FlashNotes for "${folder.name}"...`);
      setIsGenerating(true);
      try {
          const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-notes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cards: folder.cards })
          });
          if (!response.ok) {
              const err = await response.json();
              throw new Error(err.error || "Failed to generate notes.");
          }
          const { notes } = await response.json();
          const doc = new jsPDF();
          const pageW = doc.internal.pageSize.getWidth();
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(30);
          doc.setTextColor("#8B5CF6");
          doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(16);
          doc.setTextColor("#1F2937");
          doc.text(`FlashNotes for: ${folder.name}`, pageW / 2, 30, { align: 'center' });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          const splitText = doc.splitTextToSize(notes, pageW - 40);
          doc.text(splitText, 20, 50);
          doc.save(`${folder.name}-flash-notes.pdf`);
          setNotification("FlashNotes generated and downloaded!");
      } catch (error) {
          console.error("Error generating AI notes:", error);
          setNotification(`Error: ${error.message}`);
      } finally {
          setIsGenerating(false);
      }
  };

  const renderFolderTreeOptions = (folders, level = 0) => {
    let options = [];
    for (const id in folders) {
        const folder = folders[id];
        options.push(<option key={id} value={id}>{'--'.repeat(level)} {folder.name}</option>);
        if (folder.subfolders && Object.keys(folder.subfolders).length > 0) {
            options = options.concat(renderFolderTreeOptions(folder.subfolders, level + 1));
        }
    }
    return options;
  };
    
  const stopListening = () => {
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
    }
    setIsListening(false);
    setNotification('');
  };

  const startListening = async () => {
    if (!isDevMode && usage.count >= usage.limit) {
      setNotification(`You have 0 cards left for today.`);
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
    setMediaSrc(URL.createObjectURL(file));
    setUploadedFile(file);
    setFileName(file.name);
    setCurrentTime(0);
    setMediaDuration(0);
    setAudioCacheId(null);
    setFileType(file.type.startsWith('video/') ? 'video' : 'audio');
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
    if (activePlayer?.paused) activePlayer.play();
    else activePlayer?.pause();
  };

  const handleSeek = (e) => {
    const activePlayer = fileType === 'video' ? videoPlayerRef.current : audioPlayerRef.current;
    activePlayer.currentTime = (e.nativeEvent.offsetX / e.target.clientWidth) * mediaDuration;
  };
  
  const handleCardCheck = (cardId) => { setCheckedCards(prev => ({ ...prev, [cardId]: !prev[cardId] })); };

  const handleCheckAll = () => {
    const allChecked = generatedFlashcards.length > 0 && generatedFlashcards.every(card => checkedCards[card.id]);
    const newCheckedCards = {};
    if (!allChecked) {
      generatedFlashcards.forEach(card => { newCheckedCards[card.id] = true; });
    }
    setCheckedCards(newCheckedCards);
  };
  
  const formatListeningDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${rem > 0 ? ` ${rem} minutes` : ''}`;
  };
  const sliderValueToMinutes = (v) => v <= 5 ? v : (v <= 16 ? 5 + (v - 5) * 5 : 60 + (v - 16) * 10);
  const minutesToSliderValue = (m) => m <= 5 ? m : (m <= 60 ? 5 + (m - 5) / 5 : 16 + (m - 60) / 10);
  const formatAutoFlashInterval = (s) => s < 60 ? `${s} seconds` : `${s/60} minute${s/60 > 1 ? 's' : ''}`;
  const sliderToInterval = (v) => v <= 4 ? 20 + (v * 10) : 60 + (v - 4) * 30;
  const intervalToSlider = (s) => s <= 60 ? (s - 20) / 10 : 4 + (s - 60) / 30;
  const formatTime = (t) => {
    if (isNaN(t) || t === 0) return '00:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startStudy = (folder, updateLastViewed = true) => {
      if (updateLastViewed) {
          setFolders(prev => updateFolderRecursive(folder.id, f => ({...f, lastViewed: new Date().toISOString() }), prev));
      }
      setStudyingFolder({ id: folder.id, name: folder.name, cards: [...folder.cards] });
  };

  return (
    <>
      {studyingFolder && (
          <FlashcardViewer 
              folderId={studyingFolder.id}
              folderName={studyingFolder.name} 
              cards={studyingFolder.cards} 
              onClose={() => setStudyingFolder(null)}
              onDeleteCard={deleteCardFromFolder}
              onUpdateCard={updateCardInFolder}
          />
      )}
      
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
      <div className="card main-controls">
        {!isDevMode && <div className="usage-counter">Beta Trial: {usage.limit - usage.count} cards left</div>}

        {appMode === 'live' ? (
          <>
            <div className="listening-control">
              <button onClick={isListening ? stopListening : startListening} className={`start-stop-btn ${isListening ? 'active' : ''}`}>{isListening ? '■ Stop Listening' : '● Start Listening'}</button>
            </div>
            <div className="listening-modes">
              <button 
                onClick={() => setVoiceActivated(!voiceActivated)} 
                className={`voice-activate-btn small-btn ${voiceActivated ? 'active' : ''}`}
                disabled={isSafari}
                title={isSafari ? "Voice activation is not supported on Safari." : "Activate voice commands"}
              >
                Voice Activate
              </button>
              <button onClick={() => setIsAutoFlashOn(!isAutoFlashOn)} className={`autoflash-btn small-btn ${isAutoFlashOn ? 'active' : ''}`}>
                Auto-Flash <span className="beta-tag">Beta</span>
              </button>
            </div>
            
            {(() => {
              if (voiceActivated && isAutoFlashOn) return <div className="voice-hint"><p>🎤 Say "flash" to create a card.</p><p>⚡ Auto-flashing every {formatAutoFlashInterval(autoFlashInterval)}.</p></div>;
              if (voiceActivated) return <p className="voice-hint">🎤 Say "flash" to create a card.</p>;
              if (isAutoFlashOn) return <p className="voice-hint">⚡ Auto-flashing every {formatAutoFlashInterval(autoFlashInterval)}.</p>;
              return null;
            })()}

            <div className="slider-container">
              <label htmlFor="timer-slider">Listening Duration: <span className="slider-value">{formatListeningDuration(listeningDuration)}</span></label>
              <input id="timer-slider" type="range" min="1" max="22" step="1" value={minutesToSliderValue(listeningDuration)} onChange={(e) => setListeningDuration(sliderValueToMinutes(Number(e.target.value)))} disabled={isListening} />
            </div>
            {isAutoFlashOn && (
              <div className="slider-container">
              <label htmlFor="autoflash-slider">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(autoFlashInterval)}</span></label>
              <input id="autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(autoFlashInterval)} onChange={(e) => setAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isListening} />
              </div>
            )}
            <div className="slider-container">
              <label htmlFor="duration-slider">Capture Last: <span className="slider-value">{duration} seconds of audio</span></label>
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
                        <video ref={videoPlayerRef} src={mediaSrc} playsInline className="video-player" onClick={togglePlayPause} />
                        <div className="audio-player">
                            <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                            <div className="progress-bar-container" onClick={handleSeek}><div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div></div>
                            <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                        </div>
                      </>
                  ) : (
                    <div className="audio-player">
                      <audio ref={audioPlayerRef} src={mediaSrc} />
                      <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                      <div className="progress-bar-container" onClick={handleSeek}><div className="progress-bar" style={{ width: `${(currentTime / mediaDuration) * 100}%` }}></div></div>
                      <span className="time-display">{formatTime(currentTime)} / {formatTime(mediaDuration)}</span>
                    </div>
                  )}
                </div>
                <div className="listening-modes" style={{marginTop: '1rem'}}>
                    {fileType === 'video' && !audioCacheId && <button onClick={handleProcessAudio} className="autoflash-btn" disabled={isProcessing}>{isProcessing ? 'Processing...' : '🎧 Process Audio'}</button>}
                    <button onClick={() => setIsUploadAutoFlashOn(!isUploadAutoFlashOn)} className={`autoflash-btn ${isUploadAutoFlashOn ? 'active' : ''}`} disabled={fileType === 'video' && !audioCacheId}>Auto-Flash <span className="beta-tag">Beta</span></button>
                </div>
                {isUploadAutoFlashOn && (fileType === 'audio' || audioCacheId) && (
                  <>
                    <div className="slider-container">
                      <label htmlFor="upload-autoflash-slider">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(uploadAutoFlashInterval)}</span></label>
                      <input id="upload-autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(uploadAutoFlashInterval)} onChange={(e) => setUploadAutoFlashInterval(sliderToInterval(Number(e.target.value)))} disabled={isPlaying && isUploadAutoFlashOn} />
                    </div>
                    <p className="voice-hint" style={{marginTop: '1rem'}}>⚡ Auto-flashing every {formatAutoFlashInterval(uploadAutoFlashInterval)}.</p>
                  </>
                )}
              </>
            )}
            <div className="slider-container" style={{ marginTop: '1rem' }}>
              <label htmlFor="duration-slider-upload">Capture Audio From: <span className="slider-value">{duration} seconds before current time</span></label>
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
              <div className="card-selection"><input type="checkbox" checked={!!checkedCards[card.id]} onChange={() => handleCardCheck(card.id)} /></div>
              <div className="card-content">
                {/* This should be a component */}
                <p><strong>Q:</strong> {card.question}</p>
                <p><strong>A:</strong> {card.answer}</p>
                <button onClick={() => deleteFromQueue(card.id)} className="card-delete-btn">🗑️</button>
              </div>
            </div>
          ))}
          <div className="folder-actions">
            <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
              <option value="" disabled>Select a folder...</option>
              {renderFolderTreeOptions(folders)}
            </select>
            <button onClick={() => handleMoveToFolder(checkedCards, selectedFolderForMove)} className="move-to-folder-btn">Move to Folder</button>
          </div>
        </div>
      )}
      
      <FoldersSection 
        folders={folders}
        folderOrder={folderOrder}
        setFolderOrder={setFolderOrder}
        onSetModal={setModalState}
        onStartStudy={startStudy}
        onGenerateAINotes={generateAINotes}
        onUpdateFolder={setFolders}
        renderFolderTreeOptions={renderFolderTreeOptions}
        onMoveCards={handleMoveToFolder}
      />

      <div className="app-footer">
        <button className="feedback-btn" onClick={() => setModalState({ type: 'feedback' })}>Send Feedback</button>
      </div>
    </>
  );
};

// --- HELPER COMPONENTS ---

const FoldersSection = ({ folders, folderOrder, setFolderOrder, onSetModal, onStartStudy, onGenerateAINotes, onUpdateFolder, renderFolderTreeOptions, onMoveCards }) => {
    const [sortBy, setSortBy] = useState('name');

    const sortedFolderOrder = useMemo(() => {
        if (sortBy === 'custom') return folderOrder;
        const sorted = [...folderOrder];
        sorted.sort((aId, bId) => {
            const a = folders[aId];
            const b = folders[bId];
            if (!a || !b) return 0;
            switch (sortBy) {
                case 'dateCreated': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'lastViewed': return (new Date(b.lastViewed) || 0) - (new Date(a.lastViewed) || 0);
                case 'name':
                default: return a.name.localeCompare(b.name);
            }
        });
        return sorted;
    }, [folderOrder, folders, sortBy]);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("folderIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = e.dataTransfer.getData("folderIndex");
        const newOrder = [...folderOrder];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);
        setFolderOrder(newOrder);
        setSortBy('custom');
    };

    return (
        <div className="card folders-container">
            <div className="folders-header">
                <h2 className="section-heading">Your Folders</h2>
                <button onClick={() => onSetModal({ type: 'createFolder', data: { parentId: null } })} className="create-folder-btn-header">Create Folder</button>
            </div>
            <div className="sort-by-container">
                <label htmlFor="sort-by">Sort by:</label>
                <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="custom" disabled={sortBy !== 'custom'}>Custom Order</option>
                    <option value="name">Name</option>
                    <option value="dateCreated">Date Created</option>
                    <option value="lastViewed">Last Viewed</option>
                </select>
            </div>
            <div className="folder-list">
                {sortedFolderOrder.map((folderId, index) => {
                    const folder = folders[folderId];
                    if (!folder) return null;
                    return (
                        <FolderItem 
                            key={folderId}
                            folder={folder}
                            index={index}
                            onSetModal={onSetModal}
                            onStartStudy={onStartStudy}
                            onGenerateAINotes={onGenerateAINotes}
                            onUpdateFolder={onUpdateFolder}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                            renderFolderTreeOptions={renderFolderTreeOptions}
                            onMoveCards={onMoveCards}
                        />
                    );
                })}
                {folderOrder.length === 0 && <p className="subtle-text">No folders created yet.</p>}
            </div>
        </div>
    );
};

const FolderItem = ({ folder, index, onSetModal, onStartStudy, onGenerateAINotes, onUpdateFolder, onDragStart, onDrop, renderFolderTreeOptions, onMoveCards }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedCards, setCheckedCards] = useState({});
    const [destinationFolder, setDestinationFolder] = useState('');

    const handleCardCheck = (cardId) => {
        setCheckedCards(prev => ({...prev, [cardId]: !prev[cardId]}));
    };
    
    const handleMoveClick = () => {
        onMoveCards(checkedCards, destinationFolder, folder.id);
        setCheckedCards({});
    };

    return (
        <div 
            className="folder-item"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, index)}
        >
            <div className="folder-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <span>{folder.name}</span>
                <div className="folder-item-header-right">
                    <span className="card-count-badge">🗂️ {folder.cards.length} cards</span>
                    <span className="folder-item-arrow">{isExpanded ? '▾' : '▸'}</span>
                </div>
            </div>
            {isExpanded && (
                <div className="folder-item-content">
                    <div className="expanded-header">
                        <div className="expanded-header-left">
                            <h3>{folder.name}</h3>
                            <div className="expanded-actions">
                                <button onClick={() => onStartStudy(folder)} className="study-btn-expanded">Study</button>
                                <button onClick={() => onGenerateAINotes(folder.id)} className="flashnotes-btn">FlashNotes</button>
                            </div>
                        </div>
                        <div className="expanded-header-right">
                           <SecondaryActionsMenu folder={folder} onGenerateAINotes={onGenerateAINotes} />
                           <FolderActionsMenu folder={folder} onSetModal={onSetModal} />
                        </div>
                    </div>
                    <div className="card-list-container">
                        {folder.cards.map(card => (
                            <div key={card.id} className="card-list-item">
                                <input type="checkbox" checked={!!checkedCards[card.id]} onChange={() => handleCardCheck(card.id)} />
                                <div className="card-list-item-text">
                                    <p><strong>Q:</strong> {card.question}</p>
                                    <p><strong>A:</strong> {card.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {Object.values(checkedCards).some(v => v) && (
                        <div className="move-cards-bar">
                            <select value={destinationFolder} onChange={e => setDestinationFolder(e.target.value)}>
                                <option value="" disabled>Move to...</option>
                                {renderFolderTreeOptions(onUpdateFolder(f => f))}
                            </select>
                            <button onClick={handleMoveClick} disabled={!destinationFolder}>Move Selected</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

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
  const voiceDropdownRef = useRef(null);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  
  const studyDeck = useMemo(() => {
      if (reviewMode === 'flagged') return deck.filter(card => flaggedCards[card.id]);
      if (reviewMode === 'srs') {
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          return [...deck]
              .filter(c => !c.lastReviewed || new Date(c.lastReviewed).getTime() < oneWeekAgo)
              .sort((a, b) => (a.lastReviewed || 0) - (b.lastReviewed || 0));
      }
      return deck;
  }, [reviewMode, deck, flaggedCards]);

  const currentCard = studyDeck[currentIndex];

  useEffect(() => {
    if (currentCard) onUpdateCard(folderId, currentCard.id, { lastReviewed: new Date().toISOString() });
  }, [currentIndex, folderId, onUpdateCard, currentCard]);

  const handleDeleteCurrentCard = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete this card?\n\nQ: ${currentCard.question}`)) {
        onDeleteCard(folderId, currentCard.id);
        const newDeck = deck.filter(c => c.id !== currentCard.id);
        setDeck(newDeck);
        if (currentIndex >= newDeck.length) setCurrentIndex(Math.max(0, newDeck.length - 1));
    }
  };

  const handleSetReviewMode = (mode) => {
      setReviewMode(mode);
      setCurrentIndex(0);
      setIsFlipped(false);
  };
  
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
      setVoices(englishVoices);
      if (englishVoices.length > 0 && !selectedVoice) setSelectedVoice(englishVoices[0].name);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice]);

  const stopReading = useCallback(() => {
    setIsReading(false);
    window.speechSynthesis.cancel();
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!isReading || !currentCard) return;
    const speak = (text, onEnd) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = speechRate;
        utterance.onend = onEnd;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };
    const readCardSequence = () => {
      setIsFlipped(false);
      speak(`Question: ${currentCard.question}`, () => {
        speechTimeoutRef.current = setTimeout(() => {
          setIsFlipped(true);
          speak(`Answer: ${currentCard.answer}`, () => {
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
  }, [isReading, currentIndex, studyDeck, speechDelay, speechRate, selectedVoice, currentCard, voices]);

  const goToNext = () => { stopReading(); setIsFlipped(false); setCurrentIndex(p => (p + 1) % studyDeck.length); };
  const goToPrev = () => { stopReading(); setIsFlipped(false); setCurrentIndex(p => (p - 1 + studyDeck.length) % studyDeck.length); };
  const scrambleDeck = () => { stopReading(); setDeck(d => [...d].sort(() => Math.random() - 0.5)); setCurrentIndex(0); setIsFlipped(false); };
  const toggleFlag = (cardId) => { setFlaggedCards(p => ({...p, [cardId]: !p[cardId]})); };
  const handleDragStart = (e, index) => e.dataTransfer.setData("cardIndex", index);
  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("cardIndex");
    const newDeck = [...deck];
    const [draggedItem] = newDeck.splice(dragIndex, 1);
    newDeck.splice(dropIndex, 0, draggedItem);
    setDeck(newDeck);
  };

  return (
    <div className="viewer-overlay">
      <div className="viewer-header">
        <h2>Studying: {folderName}</h2>
        <button onClick={onClose} className="viewer-close-btn">&times;</button>
      </div>
      <div className="viewer-controls">
        <button onClick={scrambleDeck}>Scramble</button>
        <button onClick={() => setIsArrangeMode(!isArrangeMode)}>{isArrangeMode ? 'Study' : 'Arrange'}</button>
        <button onClick={() => handleSetReviewMode('all')} className={reviewMode === 'all' ? 'active' : ''}>All Cards</button>
        <button onClick={() => handleSetReviewMode('flagged')} className={reviewMode === 'flagged' ? 'active' : ''}>Flagged ({Object.keys(flaggedCards).length})</button>
        <button onClick={() => handleSetReviewMode('srs')} className={reviewMode === 'srs' ? 'active' : ''}>Needs Review</button>
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
              <div className="viewer-main" onClick={() => { stopReading(); setIsFlipped(p => !p); }}>
                <div className={`viewer-card ${isFlipped ? 'is-flipped' : ''}`}>
                  <div className="card-face card-front">
                    {reviewMode === 'srs' && <div className="last-reviewed-tag">Last reviewed: {timeSince(currentCard.lastReviewed)}</div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>&#9873;</button>
                    <button onClick={handleDeleteCurrentCard} className="card-delete-btn viewer-delete-btn">🗑️</button>
                    <p>{currentCard?.question}</p>
                  </div>
                  <div className="card-face card-back">
                    {reviewMode === 'srs' && <div className="last-reviewed-tag">Last reviewed: {timeSince(currentCard.lastReviewed)}</div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>&#9873;</button>
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
  const handleSubmit = (e) => { e.preventDefault(); if (folderName.trim()) onCreate(folderName.trim(), parentId); };
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
    const handleSubmit = (e) => { e.preventDefault(); if (newName.trim() && newName.trim() !== currentName) onRename(folderId, newName.trim()); else onClose(); };
    return (
        <div className="modal-overlay" onClick={onClose}><div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Rename Folder</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" className="modal-input" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                    <button type="submit" className="modal-create-btn">Rename</button>
                </div>
            </form>
        </div></div>
    );
};

const DeleteFolderModal = ({ onClose, onDelete, folderId, folderName }) => (
    <div className="modal-overlay" onClick={onClose}><div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Delete Folder</h2>
        <p className="modal-message">Delete "{folderName}" and all its contents? This cannot be undone.</p>
        <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="modal-delete-btn" onClick={() => onDelete(folderId)}>Delete</button>
        </div>
    </div></div>
);

const FeedbackModal = ({ onClose, formspreeUrl }) => {
    const [status, setStatus] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            const res = await fetch(formspreeUrl, { method: 'POST', body: data, headers: { 'Accept': 'application/json' }});
            if (res.ok) {
                setStatus('Thanks for your feedback!');
                e.target.reset();
                setTimeout(onClose, 2000);
            } else {
                setStatus('Oops! There was a problem.');
            }
        } catch (error) { setStatus('Oops! There was a problem.'); }
    };
    return (
        <div className="feedback-modal-overlay" onClick={onClose}><div className="feedback-modal-content" onClick={e => e.stopPropagation()}>
            <h2>Send Beta Feedback</h2>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="email">Your Email (Optional)</label><input id="email" type="email" name="email" className="form-input" /></div>
                <div className="form-group"><label htmlFor="type">Feedback Type</label><select id="type" name="type" className="form-select" defaultValue="General Comment"><option>General Comment</option><option>Bug Report</option><option>Feature Request</option></select></div>
                <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" className="form-textarea" required /></div>
                <div className="feedback-modal-actions"><button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button><button type="submit" className="modal-create-btn">Submit</button></div>
                {status && <p style={{marginTop: '1rem', textAlign: 'center'}}>{status}</p>}
            </form>
        </div></div>
    );
};

function App() {
  const [showApp, setShowApp] = useState(false);
  return (
    <>
      <Analytics />
      {showApp ? <div className="main-app-container"><MainApp /></div> : <LandingPage onEnter={() => setShowApp(true)} />}
    </>
  );
}

export default App;

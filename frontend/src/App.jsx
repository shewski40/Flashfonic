import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import './App.css';
import { Analytics } from '@vercel/analytics/react';

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
  const [modalConfig, setModalConfig] = useState(null);
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

  useEffect(() => {
    const storedFolders = localStorage.getItem('flashfonic-folders');
    if (storedFolders) {
      let parsedFolders = JSON.parse(storedFolders);
      if (Array.isArray(parsedFolders) || (Object.keys(parsedFolders).length > 0 && !parsedFolders[Object.keys(parsedFolders)[0]].id)) {
        console.log("Old folder structure detected. Migrating...");
        const newFolders = {};
        Object.keys(parsedFolders).forEach(folderName => {
          const newId = crypto.randomUUID();
          newFolders[newId] = {
            id: newId,
            name: folderName,
            cards: parsedFolders[folderName],
            subfolders: {}
          };
        });
        setFolders(newFolders);
      } else {
        setFolders(parsedFolders);
      }
    }
  }, []);

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
        
        const newCard = { ...data, id: Date.now() };
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

    setFolders(prev => ({
        ...prev,
        [selectedFolderForMove]: [...(prev[selectedFolderForMove] || []), ...cardsToMove]
    }));
    setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
    setCheckedCards({});
    setSelectedFolderForMove('');
    setNotification(`${cardsToMove.length} card(s) moved to ${selectedFolderForMove}.`);
  };

  const handleCreateFolder = (folderName) => {
    if (folders[folderName]) {
      alert("A folder with this name already exists.");
    } else {
      setFolders(prev => ({ ...prev, [folderName]: [] }));
    }
    setModalConfig(null);
  };

  const deleteCardFromFolder = (folderName, cardId) => {
    setFolders(prevFolders => ({
        ...prevFolders,
        [folderName]: prevFolders[folderName].filter(card => card.id !== cardId)
    }));
  };

  const deleteFromQueue = (cardId) => {
    setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  const startEditing = (card, source, folderName = null) => {
    setEditingCard({ ...card, source, folderName });
    setMovingCard(null);
  };

  const startMove = (card, folderName) => {
    setMovingCard({ id: card.id, folderName });
    setEditingCard(null);
  };

  const saveEdit = () => {
    if (!editingCard) return;
    const { id, question, answer, source, folderName } = editingCard;
    if (source === 'queue') {
      setGeneratedFlashcards(prev => 
        prev.map(card => card.id === id ? { ...card, question, answer } : card)
      );
    } else if (source === 'folder' && folderName) {
      setFolders(prev => ({
          ...prev,
          [folderName]: prev[folderName].map(card => 
            card.id === id ? { ...card, question, answer } : card
          )
      }));
    }
    setEditingCard(null);
  };

  const handleConfirmMove = (destinationFolder) => {
    if (!movingCard || !destinationFolder || movingCard.folderName === destinationFolder) {
        setMovingCard(null);
        return;
    };
    const { id, folderName: sourceFolder } = movingCard;
    const cardToMove = folders[sourceFolder].find(c => c.id === id);
    if (!cardToMove) return;
    setFolders(prevFolders => {
        const newFolders = { ...prevFolders };
        newFolders[sourceFolder] = newFolders[sourceFolder].filter(c => c.id !== id);
        newFolders[destinationFolder] = [...newFolders[destinationFolder], cardToMove];
        return newFolders;
    });
    setMovingCard(null);
  };

  const exportFolderToPDF = (folderName) => {
    setModalConfig({
      type: 'prompt',
      title: 'Export to PDF',
      message: 'How many flashcards per page? (6, 8, or 10)',
      defaultValue: '8',
      onConfirm: (value) => {
        const cardsPerPage = parseInt(value, 10);
        if (![6, 8, 10].includes(cardsPerPage)) {
          alert("Invalid number. Please choose 6, 8, or 10.");
          return;
        }
        const doc = new jsPDF();
        const cards = folders[folderName];
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
            doc.setTextColor("#8B5CF6");
            doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.setTextColor("#1F2937");
            doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });
        };
        for (let i = 0; i < cards.length; i += cardsPerPage) {
          const pageCards = cards.slice(i, i + cardsPerPage);
          if (i > 0) doc.addPage();
          drawHeader();
          pageCards.forEach((card, index) => {
            const row = Math.floor(index / config.cols);
            const col = index % config.cols;
            const cardX = margin + (col * (cardW + margin));
            const cardY = 40 + (row * (cardH + margin));
            doc.setLineWidth(0.5);
            doc.setDrawColor(0);
            doc.setTextColor("#000000");
            doc.rect(cardX, cardY, cardW, cardH);
            doc.setFontSize(config.fontSize);
            const text = doc.splitTextToSize(`Q: ${card.question}`, cardW - 10);
            const textY = cardY + (cardH / 2) - ((text.length * config.fontSize) / 3.5);
            doc.text(text, cardX + cardW / 2, textY, { align: 'center' });
          });
          doc.addPage();
          drawHeader();
          pageCards.forEach((card, index) => {
            const row = Math.floor(index / config.cols);
            const col = index % config.cols;
            const cardX = margin + (col * (cardW + margin));
            const cardY = 40 + (row * (cardH + margin));
            doc.setLineWidth(0.5);
            doc.setDrawColor(0);
            doc.setTextColor("#000000");
            doc.rect(cardX, cardY, cardW, cardH);
            doc.setFontSize(config.fontSize);
            const text = doc.splitTextToSize(`A: ${card.answer}`, cardW - 10);
            const textY = cardY + (cardH / 2) - ((text.length * config.fontSize) / 3.5);
            doc.text(text, cardX + cardW / 2, textY, { align: 'center' });
          });
        }
        doc.save(`${folderName}-flashcards.pdf`);
        setModalConfig(null);
      },
      onClose: () => setModalConfig(null)
    });
  };
  
  const exportFolderToCSV = (folderName) => {
    setModalConfig({
      type: 'prompt',
      title: 'Export to CSV',
      message: 'How many flashcards do you want to export?',
      defaultValue: folders[folderName].length,
      onConfirm: (value) => {
        const numCards = parseInt(value, 10);
        if (isNaN(numCards) || numCards <= 0) {
            alert("Invalid number.");
            return;
        }
        const cards = folders[folderName].length;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "FlashFonic\nListen. Flash it. Learn.\n\n";
        csvContent += "Question,Answer\n";
        cards.forEach(card => {
            const row = `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`;
            csvContent += row + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${folderName}-flashcards.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setModalConfig(null)
      },
      onClose: () => setModalConfig(null)
    });
  };

  const renderCardContent = (card, source, folderName = null) => {
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
    if (movingCard && movingCard.id === card.id) {
        const otherFolders = Object.keys(folders).filter(f => f !== folderName);
        return (
            <div className="move-mode">
                <p>Move to:</p>
                {otherFolders.length > 0 ? (
                    <div className="move-controls">
                        <select className="folder-select" defaultValue="" onChange={(e) => handleConfirmMove(e.target.value)}>
                            <option value="" disabled>Select a folder...</option>
                            {otherFolders.map(f => <option key={f} value={f}>{f}</option>)}
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
          {source === 'folder' && <button onClick={() => startMove(card, folderName)} className="card-move-btn">⇄ Move</button>}
          <button onClick={() => startEditing(card, source, folderName)} className="edit-btn">Edit</button>
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

  return (
    <>
      {studyingFolder && ( <FlashcardViewer folderName={studyingFolder.name} cards={studyingFolder.cards} onClose={() => setStudyingFolder(null)} /> )}
      {modalConfig && <ActionModal config={modalConfig} onClose={() => setModalConfig(null)} />}
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
              {Object.values(folders).map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
            <button onClick={handleMoveToFolder} className="move-to-folder-btn">Move to Folder</button>
          </div>
        </div>
      )}
      <div className="card folders-container">
        <h2 className="section-heading">Your Folders</h2>
        <button onClick={() => setModalConfig({ type: 'createFolder' })} className="create-folder-btn">Create New Folder</button>
        <div className="folder-list">
          {Object.values(folders).length > 0 ? Object.values(folders).map(folder => (
            <FolderItem 
                      key={folder.id} 
                      folder={folder} 
                      setModalConfig={setModalConfig}
                      setStudyingFolder={setStudyingFolder}
                      isListening={isListening}
                      stopListening={stopListening}
                      exportFolderToPDF={exportFolderToPDF}
                      exportFolderToCSV={exportFolderToCSV}
                      renderCardContent={renderCardContent}
                      deleteCardFromFolder={deleteCardFromFolder}
                  />
          )) : <p className="subtle-text">No folders created yet.</p>}
        </div>
      </div>
      <div className="app-footer">
        <button className="feedback-btn" onClick={() => setIsFeedbackModalOpen(true)}>Send Feedback</button>
      </div>
    </>
  );
};

// --- HELPER COMPONENTS AND FUNCTIONS ---

const FolderItem = ({ folder, ...props }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const cardCount = folder.cards.length + Object.values(folder.subfolders).reduce((acc, sub) => acc + sub.cards.length, 0);

    return (
        <details key={folder.id} className="folder">
            <summary onClick={(e) => { if (e.target.closest('button')) e.preventDefault(); }}>
                <div className="folder-header">
                    <span className="folder-name">{folder.name} ({cardCount} {cardCount === 1 ? 'card' : 'cards'})</span>
                    <div style={{position: 'relative'}} ref={menuRef}>
                        <button className="folder-menu-btn" onClick={() => setIsMenuOpen(prev => !prev)}>⋮</button>
                        {isMenuOpen && (
                            <div className="folder-menu">
                                <button onClick={() => props.setModalConfig({ type: 'createSubfolder', parentId: folder.id })}>Add Subfolder</button>
                                <button onClick={() => props.setModalConfig({ type: 'renameFolder', folderId: folder.id, currentName: folder.name })}>Rename</button>
                                <button onClick={() => props.setModalConfig({ type: 'deleteFolder', folderId: folder.id, folderName: folder.name })}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="folder-export-buttons">
                    <button onClick={() => { if (props.isListening) props.stopListening(); props.setStudyingFolder({ name: folder.name, cards: folder.cards }); }} className="study-btn">Study</button>
                    <button onClick={() => props.exportFolderToPDF(folder.id)}>Export PDF</button>
                    <button onClick={() => props.exportFolderToCSV(folder.id)}>Export CSV</button>
                </div>
            </summary>
            {folder.cards.map((card) => (
                <div key={card.id} className="card saved-card-in-folder">
                    <div className="card-content">
                        {props.renderCardContent(card, 'folder', folder.id)}
                        <button onClick={() => props.deleteCardFromFolder(folder.id, card.id)} className="card-delete-btn">🗑️</button>
                    </div>
                </div>
            ))}
            {Object.values(folder.subfolders).length > 0 && (
                <div className="subfolders-container">
                    {Object.values(folder.subfolders).map(subfolder => (
                        <FolderItem key={subfolder.id} folder={subfolder} {...props} />
                    ))}
                </div>
            )}
        </details>
    );
};

const ActionModal = ({ config, onClose }) => {
    const [inputValue, setInputValue] = useState(config.currentName || '');
    const { type, title, message, onConfirm } = config;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type.includes('delete')) {
            onConfirm();
        } else if (inputValue.trim()) {
            onConfirm(inputValue.trim());
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                {message && <p className="modal-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    {!type.includes('delete') && (
                        <input 
                            type="text" 
                            className="modal-input" 
                            placeholder="Enter name..."
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            autoFocus 
                        />
                    )}
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className={type.includes('delete') ? 'modal-delete-btn' : 'modal-create-btn'}>
                            {type.includes('delete') ? 'Delete' : 'Confirm'}
                        </button>
                    </div>
                </form>
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
                    <p>{currentCard?.question}</p>
                  </div>
                  <div className="card-face card-back">
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>&#9873;</button>
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

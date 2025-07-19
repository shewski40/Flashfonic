import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react';
import jsPDF from 'jspdf';
import './App.css';

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


// --- HELPER FUNCTIONS ---
const formatTime = (time) => {
  if (isNaN(time) || time === 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- REDUCER FOR STATE MANAGEMENT ---
const initialState = {
    appMode: 'live',
    isListening: false,
    notification: '',
    duration: 15,
    generatedFlashcards: [],
    folders: {},
    isGenerating: false,
    uploadedFile: null,
    fileName: '',
    audioSrc: null,
    isPlaying: false,
    currentTime: 0,
    audioDuration: 0,
    voiceActivated: false,
    checkedCards: {},
    editingCard: null,
    studyingFolder: null,
    isCreateFolderModalOpen: false,
    promptModalConfig: null,
    selectedFolderForMove: '',
    movingCard: null,
    listeningDuration: 1,
    isAutoFlashOn: false,
    autoFlashInterval: 20,
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'LOAD_FOLDERS':
            return { ...state, folders: action.payload };
        case 'SET_NOTIFICATION':
            return { ...state, notification: action.payload };
        case 'START_GENERATING':
            return { ...state, isGenerating: true, notification: 'Sending audio to server...' };
        case 'GENERATION_SUCCESS':
            return {
                ...state,
                isGenerating: false,
                generatedFlashcards: [action.payload, ...state.generatedFlashcards],
                notification: state.isListening ? `Card generated! Still listening...` : 'Card generated!',
            };
        case 'GENERATION_FAILURE':
            return { ...state, isGenerating: false, notification: action.payload };
        case 'START_LISTENING_UI':
            return { ...state, isListening: true, notification: action.payload };
        case 'STOP_LISTENING_UI':
            return { ...state, isListening: false, notification: '' };
        case 'SET_UPLOADED_FILE':
            return { ...state, uploadedFile: action.payload.file, fileName: action.payload.name, audioSrc: action.payload.src, notification: '' };
        case 'UPDATE_PLAYER_TIME':
            return { ...state, currentTime: action.payload };
        case 'SET_PLAYER_DURATION':
            return { ...state, audioDuration: action.payload };
        case 'TOGGLE_PLAYING':
            return { ...state, isPlaying: !state.isPlaying };
        case 'CHECK_CARD':
            const newChecked = { ...state.checkedCards };
            if (newChecked[action.payload]) {
                delete newChecked[action.payload];
            } else {
                newChecked[action.payload] = true;
            }
            return { ...state, checkedCards: newChecked };
        case 'CHECK_ALL_CARDS':
            const allChecked = state.generatedFlashcards.length > 0 && state.generatedFlashcards.every(card => state.checkedCards[card.id]);
            const newCheckedCards = {};
            if (!allChecked) {
                state.generatedFlashcards.forEach(card => {
                    newCheckedCards[card.id] = true;
                });
            }
            return { ...state, checkedCards: newCheckedCards };
        case 'MOVE_CARDS_TO_FOLDER':
            const cardsToMove = state.generatedFlashcards.filter(card => state.checkedCards[card.id]);
            return {
                ...state,
                folders: {
                    ...state.folders,
                    [action.payload]: [...(state.folders[action.payload] || []), ...cardsToMove]
                },
                generatedFlashcards: state.generatedFlashcards.filter(card => !state.checkedCards[card.id]),
                checkedCards: {},
                selectedFolderForMove: '',
                notification: `${cardsToMove.length} card(s) moved to ${action.payload}.`
            };
        case 'CREATE_FOLDER':
            if (state.folders[action.payload]) {
                alert("A folder with this name already exists.");
                return state;
            }
            return { ...state, folders: { ...state.folders, [action.payload]: [] }, isCreateFolderModalOpen: false };
        case 'DELETE_CARD_FROM_FOLDER':
            return {
                ...state,
                folders: {
                    ...state.folders,
                    [action.payload.folderName]: state.folders[action.payload.folderName].filter(card => card.id !== action.payload.cardId)
                }
            };
        case 'DELETE_FROM_QUEUE':
            return { ...state, generatedFlashcards: state.generatedFlashcards.filter(card => card.id !== action.payload) };
        case 'SAVE_EDITED_CARD':
            const { id, question, answer, source, folderName } = state.editingCard;
            if (source === 'queue') {
                return {
                    ...state,
                    generatedFlashcards: state.generatedFlashcards.map(card => card.id === id ? { ...card, question, answer } : card),
                    editingCard: null,
                };
            } else if (source === 'folder' && folderName) {
                return {
                    ...state,
                    folders: {
                        ...state.folders,
                        [folderName]: state.folders[folderName].map(card =>
                            card.id === id ? { ...card, question, answer } : card
                        )
                    },
                    editingCard: null,
                };
            }
            return state;
        case 'CONFIRM_MOVE_CARD':
            const { id: cardId, folderName: sourceFolder } = state.movingCard;
            const destinationFolder = action.payload;
            if (!destinationFolder || sourceFolder === destinationFolder) {
                return { ...state, movingCard: null };
            }
            const cardToMove = state.folders[sourceFolder].find(c => c.id === cardId);
            if (!cardToMove) return { ...state, movingCard: null };

            const newFolders = { ...state.folders };
            newFolders[sourceFolder] = newFolders[sourceFolder].filter(c => c.id !== cardId);
            newFolders[destinationFolder] = [...newFolders[destinationFolder], cardToMove];
            return { ...state, folders: newFolders, movingCard: null };
        default:
            return state;
    }
}


// --- MAIN APP COMPONENT ---
const MainApp = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const {
        appMode, isListening, notification, duration, generatedFlashcards, folders,
        isGenerating, uploadedFile, fileName, audioSrc, isPlaying, currentTime,
        audioDuration, voiceActivated, checkedCards, editingCard, studyingFolder,
        isCreateFolderModalOpen, promptModalConfig, selectedFolderForMove, movingCard,
        listeningDuration, isAutoFlashOn, autoFlashInterval
    } = state;

    // Use refs for things that don't need to trigger re-renders
    const audioChunksRef = useRef([]);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioPlayerRef = useRef(null);
    const recognitionRef = useRef(null);
    const listeningTimeoutRef = useRef(null);
    const autoFlashTimerRef = useRef(null);
    const audioContextRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);

    // ✅ REFACTORED: Load folders from localStorage on initial render
    useEffect(() => {
        try {
            const storedFolders = localStorage.getItem('flashfonic-folders');
            if (storedFolders) {
                dispatch({ type: 'LOAD_FOLDERS', payload: JSON.parse(storedFolders) });
            }
        } catch (error) {
            console.error("Failed to load folders from localStorage:", error);
            dispatch({ type: 'SET_NOTIFICATION', payload: "Could not load saved folders." });
        }
    }, []);

    // ✅ REFACTORED: Save folders to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('flashfonic-folders', JSON.stringify(folders));
        } catch (error) {
            console.error("Failed to save folders to localStorage:", error);
            dispatch({ type: 'SET_NOTIFICATION', payload: "Could not save folders." });
        }
    }, [folders]);

    // ✅ REFACTORED & STABILIZED: Flashcard generation logic
    const generateFlashcard = useCallback(async (audioBlob) => {
        dispatch({ type: 'START_GENERATING' });

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1];
            try {
                const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio_data: base64Audio })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to generate flashcard.');

                const newCard = { ...data, id: Date.now() };
                dispatch({ type: 'GENERATION_SUCCESS', payload: newCard });
            } catch (error) {
                console.error("Error:", error);
                dispatch({ type: 'GENERATION_FAILURE', payload: "Failed to process audio. Please try again" });
            }
        };
        reader.onerror = () => {
             dispatch({ type: 'GENERATION_FAILURE', payload: "Failed to read audio file." });
        }
    }, []); // isListening is in state, so it's available in the reducer

    // ✅ REFACTORED & STABILIZED: Flash It logic for live capture
    const handleLiveFlashIt = useCallback(() => {
        if (isGenerating) return;
    
        if (audioChunksRef.current.length < 2) {
            dispatch({ type: 'SET_NOTIFICATION', payload: 'Not enough audio captured yet. Speak for a bit longer.' });
            return;
        }
    
        const availableDuration = audioChunksRef.current.length - 1;
        const chunksToGrab = Math.min(availableDuration, duration);
    
        if (chunksToGrab < 1) {
            dispatch({ type: 'SET_NOTIFICATION', payload: 'Not enough audio captured to process.' });
            return;
        }
    
        const audioSlice = audioChunksRef.current.slice(-(chunksToGrab + 1), -1);
    
        if (audioSlice.length === 0) {
            dispatch({ type: 'SET_NOTIFICATION', payload: 'Could not create an audio slice. Please try again.' });
            return;
        }
    
        const audioBlob = new Blob(audioSlice, { type: 'audio/webm' });
    
        // This logic is now more robust. It stops the recorder, and the onstop handler
        // (defined once in startListening) will handle restarting it if needed.
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    
        generateFlashcard(audioBlob);
    }, [duration, generateFlashcard, isGenerating]);


    // ✅ REFACTORED & STABILIZED: Auto-Flash feature logic
    useEffect(() => {
        if (autoFlashTimerRef.current) clearInterval(autoFlashTimerRef.current);
        autoFlashTimerRef.current = null;
        let firstTimeout;

        if (isListening && isAutoFlashOn) {
            firstTimeout = setTimeout(() => {
                handleLiveFlashIt();
                autoFlashTimerRef.current = setInterval(handleLiveFlashIt, autoFlashInterval * 1000);
            }, 2000); // 2-second initial delay to fill buffer
        }

        return () => {
            if (firstTimeout) clearTimeout(firstTimeout);
            if (autoFlashTimerRef.current) clearInterval(autoFlashTimerRef.current);
        };
    }, [isListening, isAutoFlashOn, autoFlashInterval, handleLiveFlashIt]);


    const stopListening = useCallback(() => {
        if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        if (mediaRecorderRef.current?.state !== 'inactive') {
            // Remove the onstop handler to prevent auto-restarting when manually stopping
            mediaRecorderRef.current.onstop = null;
            mediaRecorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (recognitionRef.current) recognitionRef.current.stop();
        
        // ✅ REFACTORED: Suspend AudioContext instead of closing
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
            audioContextRef.current.suspend();
        }
        
        dispatch({ type: 'STOP_LISTENING_UI' });
    }, []);

    // ✅ REFACTORED & STABILIZED: Main listening function
    const startListening = useCallback(async () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            let initialNotification = 'Listening...';
            if (isAutoFlashOn) initialNotification = `Listening... Auto-Flash enabled for every ${autoFlashInterval}s.`;
            else if (voiceActivated) initialNotification = 'Listening... click "Flash It" or use voice trigger.';
            dispatch({ type: 'START_LISTENING_UI', payload: initialNotification });

            if (listeningDuration > 0) {
                listeningTimeoutRef.current = setTimeout(() => {
                    dispatch({ type: 'SET_NOTIFICATION', payload: `Listening timer finished after ${formatListeningDuration(listeningDuration)}.` });
                    stopListening();
                }, listeningDuration * 60 * 1000);
            }

            const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
            const destination = audioContextRef.current.createMediaStreamDestination();
            source.connect(destination);
            mediaRecorderRef.current = new MediaRecorder(destination.stream);
            
            const analyser = audioContextRef.current.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            audioChunksRef.current = [];
            mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                audioChunksRef.current.push(event.data);
            });

            // ✅ STABILIZED: This onstop logic is now simpler and more robust
            mediaRecorderRef.current.onstop = () => {
                // Only restart if we are still in listening mode (i.e., not a manual stop)
                if (isListening && streamRef.current?.active) {
                    try {
                        audioChunksRef.current = [];
                        mediaRecorderRef.current.start(1000);
                    } catch (err) {
                        console.error("Failed to restart media recorder:", err);
                        dispatch({ type: 'SET_NOTIFICATION', payload: 'Microphone stream lost. Please restart.' });
                        stopListening();
                    }
                }
            };

            mediaRecorderRef.current.start(1000);

            const checkForSilence = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = dataArray.reduce((a, b) => a + b, 0);
                if (sum < 5) {
                    if (!silenceTimeoutRef.current) {
                        silenceTimeoutRef.current = setTimeout(() => {
                            dispatch({ type: 'SET_NOTIFICATION', payload: 'Stopped listening due to silence.' });
                            stopListening();
                        }, 15000);
                    }
                } else {
                    if (silenceTimeoutRef.current) {
                        clearTimeout(silenceTimeoutRef.current);
                        silenceTimeoutRef.current = null;
                    }
                }
                animationFrameRef.current = requestAnimationFrame(checkForSilence);
            };
            checkForSilence();

            if (voiceActivated && 'webkitSpeechRecognition' in window) {
                const recognition = new window.webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                    if (transcript.includes('flash')) handleLiveFlashIt();
                };
                recognition.onerror = (e) => console.error('Voice trigger error:', e);
                recognition.onend = () => { if (voiceActivated && isListening) recognition.start(); };
                recognition.start();
                recognitionRef.current = recognition;
            }
        } catch (err) {
            console.error("Error starting listening:", err);
            dispatch({ type: 'SET_NOTIFICATION', payload: "Microphone access denied or error." });
        }
    }, [isAutoFlashOn, autoFlashInterval, voiceActivated, listeningDuration, stopListening, handleLiveFlashIt, isListening]);
    
    // Cleanup AudioContext on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        }
    }, []);

    const handleModeChange = (mode) => {
        if (isListening) stopListening();
        dispatch({ type: 'SET_STATE', payload: { appMode: mode, notification: '' } });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            dispatch({ type: 'SET_UPLOADED_FILE', payload: { file, name: file.name, src: URL.createObjectURL(file) } });
        }
    };

    const triggerFileUpload = () => fileInputRef.current.click();

    useEffect(() => {
        const audio = audioPlayerRef.current;
        if (!audio) return;
        const timeUpdate = () => dispatch({ type: 'UPDATE_PLAYER_TIME', payload: audio.currentTime });
        const loadedMeta = () => dispatch({ type: 'SET_PLAYER_DURATION', payload: audio.duration });
        audio.addEventListener('timeupdate', timeUpdate);
        audio.addEventListener('loadedmetadata', loadedMeta);
        return () => {
            audio.removeEventListener('timeupdate', timeUpdate);
            audio.removeEventListener('loadedmetadata', loadedMeta);
        };
    }, [audioSrc]);

    const togglePlayPause = () => {
        if (audioPlayerRef.current?.paused) {
            audioPlayerRef.current.play();
        } else {
            audioPlayerRef.current?.pause();
        }
        dispatch({ type: 'TOGGLE_PLAYING' });
    };

    const handleSeek = (e) => {
        const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * audioDuration;
        audioPlayerRef.current.currentTime = seekTime;
    };

    const handleUploadFlashIt = async () => {
        if (!uploadedFile) {
            dispatch({ type: 'SET_NOTIFICATION', payload: 'Please select a file first.' });
            return;
        }
        generateFlashcard(uploadedFile);
    };

    const handleMoveToFolder = () => {
        if (!selectedFolderForMove) {
            dispatch({ type: 'SET_NOTIFICATION', payload: "Please select a folder first." });
            return;
        }
        if (Object.values(checkedCards).every(v => !v)) {
            dispatch({ type: 'SET_NOTIFICATION', payload: "Please check the cards you want to move." });
            return;
        }
        dispatch({ type: 'MOVE_CARDS_TO_FOLDER', payload: selectedFolderForMove });
    };

    const exportFolderToPDF = (folderName) => {
        dispatch({
            type: 'SET_STATE', payload: {
                promptModalConfig: {
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
                        dispatch({ type: 'SET_STATE', payload: { promptModalConfig: null } });
                    },
                    onClose: () => dispatch({ type: 'SET_STATE', payload: { promptModalConfig: null } })
                }
            }
        });
    };

    const exportFolderToCSV = (folderName) => {
        dispatch({
            type: 'SET_STATE', payload: {
                promptModalConfig: {
                    title: 'Export to CSV',
                    message: 'How many flashcards do you want to export?',
                    defaultValue: folders[folderName].length,
                    onConfirm: (value) => {
                        const numCards = parseInt(value, 10);
                        if (isNaN(numCards) || numCards <= 0) {
                            alert("Invalid number.");
                            return;
                        }
                        const cards = folders[folderName].slice(0, numCards);
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
                        dispatch({ type: 'SET_STATE', payload: { promptModalConfig: null } });
                    },
                    onClose: () => dispatch({ type: 'SET_STATE', payload: { promptModalConfig: null } })
                }
            }
        });
    };

    const renderCardContent = (card, source, folderName = null) => {
        if (editingCard && editingCard.id === card.id) {
            return (
                <div className="edit-mode">
                    <textarea className="edit-textarea" value={editingCard.question} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { editingCard: { ...editingCard, question: e.target.value } } })} />
                    <textarea className="edit-textarea" value={editingCard.answer} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { editingCard: { ...editingCard, answer: e.target.value } } })} />
                    <div className="edit-actions">
                        <button onClick={() => dispatch({ type: 'SAVE_EDITED_CARD' })} className="edit-save-btn">Save</button>
                        <button onClick={() => dispatch({ type: 'SET_STATE', payload: { editingCard: null } })} className="edit-cancel-btn">Cancel</button>
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
                            <select className="folder-select" defaultValue="" onChange={(e) => dispatch({ type: 'CONFIRM_MOVE_CARD', payload: e.target.value })}>
                                <option value="" disabled>Select a folder...</option>
                                {otherFolders.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <button onClick={() => dispatch({ type: 'SET_STATE', payload: { movingCard: null } })} className="move-cancel-btn">Cancel</button>
                        </div>
                    ) : (<p className="subtle-text">No other folders to move to.</p>)}
                </div>
            );
        }
        return (
            <>
                <div className="card-top-actions">
                    {source === 'folder' && <button onClick={() => dispatch({ type: 'SET_STATE', payload: { movingCard: { id: card.id, folderName }, editingCard: null } })} className="card-move-btn">⇄ Move</button>}
                    <button onClick={() => dispatch({ type: 'SET_STATE', payload: { editingCard: { ...card, source, folderName }, movingCard: null } })} className="edit-btn">Edit</button>
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
        if (seconds < 60) return `${seconds}s`;
        const minutes = seconds / 60;
        return `${minutes}min`;
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
            {studyingFolder && (<FlashcardViewer folderName={studyingFolder.name} cards={studyingFolder.cards} onClose={() => dispatch({ type: 'SET_STATE', payload: { studyingFolder: null } })} />)}
            {isCreateFolderModalOpen && (<CreateFolderModal onClose={() => dispatch({ type: 'SET_STATE', payload: { isCreateFolderModalOpen: false } })} onCreate={(name) => dispatch({ type: 'CREATE_FOLDER', payload: name })} />)}
            {promptModalConfig && <PromptModal {...promptModalConfig} />}
            <div className="header">
                <h1>FlashFonic</h1>
                <h2 className="subheading">Listen. Flash it. Learn.</h2>
            </div>
            <div className="mode-selector">
                <button onClick={() => handleModeChange('live')} className={appMode === 'live' ? 'active' : ''}>🔴 Live Capture</button>
                <button onClick={() => handleModeChange('upload')} className={appMode === 'upload' ? 'active' : ''}>⬆️ Upload File</button>
            </div>
            <div className="card main-controls">
                {appMode === 'live' ? (
                    <>
                        <div className="listening-control">
                            <button onClick={isListening ? stopListening : startListening} className={`start-stop-btn ${isListening ? 'active' : ''}`}>{isListening ? '■ Stop Listening' : '● Start Listening'}</button>
                        </div>
                        <div className="listening-modes">
                            <button onClick={() => dispatch({ type: 'SET_STATE', payload: { voiceActivated: !voiceActivated } })} className={`voice-activate-btn ${voiceActivated ? 'active' : ''}`} disabled={isAutoFlashOn}>Voice Activate</button>
                            <button onClick={() => dispatch({ type: 'SET_STATE', payload: { isAutoFlashOn: !isAutoFlashOn } })} className={`autoflash-btn ${isAutoFlashOn ? 'active' : ''}`} disabled={voiceActivated}>Auto-Flash <span className="beta-tag">Beta</span></button>
                        </div>
                        {voiceActivated && !isAutoFlashOn && <p className="voice-hint">🎤 Say "flash" to create a card.</p>}
                        {isAutoFlashOn && !voiceActivated && <p className="voice-hint">⚡ Automatically creating a card every {formatAutoFlashInterval(autoFlashInterval)}.</p>}
                        <div className="slider-container">
                            <label htmlFor="timer-slider" className="slider-label">Listening Duration: <span className="slider-value">{formatListeningDuration(listeningDuration)}</span></label>
                            <input id="timer-slider" type="range" min="1" max="22" step="1" value={minutesToSliderValue(listeningDuration)} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { listeningDuration: sliderValueToMinutes(Number(e.target.value)) } })} disabled={isListening} />
                        </div>
                        {isAutoFlashOn && (
                            <div className="slider-container">
                                <label htmlFor="autoflash-slider" className="slider-label">Auto-Flash Interval: <span className="slider-value">{formatAutoFlashInterval(autoFlashInterval)}</span></label>
                                <input id="autoflash-slider" type="range" min="0" max="8" step="1" value={intervalToSlider(autoFlashInterval)} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { autoFlashInterval: sliderToInterval(Number(e.target.value)) } })} disabled={isListening} />
                            </div>
                        )}
                        <div className="slider-container">
                            <label htmlFor="duration-slider" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds</span></label>
                            <input id="duration-slider" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { duration: Number(e.target.value) } })} disabled={isListening} />
                        </div>
                        <button onClick={handleLiveFlashIt} className="flash-it-button" disabled={!isListening || isGenerating || isAutoFlashOn}>{isGenerating ? 'Generating...' : '⚡ Flash It!'}</button>
                    </>
                ) : (
                    <>
                        {isListening && (
                            <div className="stop-listening-bar">
                                <p>🔴 Live Capture is running in the background...</p>
                                <button onClick={stopListening}>■ Stop Listening</button>
                            </div>
                        )}
                        <div className="upload-button-container">
                            <button onClick={triggerFileUpload}>{fileName ? 'Change File' : 'Select File'}</button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" style={{ display: 'none' }} />
                        {fileName && <p className="file-name-display">Selected: {fileName}</p>}
                        {audioSrc && (
                            <div className="audio-player">
                                <audio ref={audioPlayerRef} src={audioSrc} onPlay={() => dispatch({ type: 'SET_STATE', payload: { isPlaying: true } })} onPause={() => dispatch({ type: 'SET_STATE', payload: { isPlaying: false } })} />
                                <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                                <div className="progress-bar-container" onClick={handleSeek}>
                                    <div className="progress-bar" style={{ width: `${(currentTime / audioDuration) * 100}%` }}></div>
                                </div>
                                <span className="time-display">{formatTime(currentTime)} / {formatTime(audioDuration)}</span>
                            </div>
                        )}
                        <div className="slider-container" style={{ marginTop: '1rem' }}>
                            <label htmlFor="duration-slider-upload" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds</span></label>
                            <input id="duration-slider-upload" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { duration: Number(e.target.value) } })} />
                        </div>
                        <button onClick={handleUploadFlashIt} className="flash-it-button" disabled={!uploadedFile || isGenerating}>{isGenerating ? 'Generating...' : '⚡ Flash It!'}</button>
                    </>
                )}
            </div>
            {notification && <p className="notification">{notification}</p>}
            {generatedFlashcards.length > 0 && (
                <div className="card generated-cards-queue">
                    <div className="queue-header">
                        <h3>Review Queue</h3>
                        <button onClick={() => dispatch({ type: 'CHECK_ALL_CARDS' })} className="check-all-btn">Check All</button>
                    </div>
                    {generatedFlashcards.map(card => (
                        <div key={card.id} className="card generated-card">
                            <div className="card-selection">
                                <input type="checkbox" checked={!!checkedCards[card.id]} onChange={() => dispatch({ type: 'CHECK_CARD', payload: card.id })} />
                            </div>
                            <div className="card-content">
                                {renderCardContent(card, 'queue')}
                                <button onClick={() => dispatch({ type: 'DELETE_FROM_QUEUE', payload: card.id })} className="card-delete-btn">🗑️</button>
                            </div>
                        </div>
                    ))}
                    <div className="folder-actions">
                        <select className="folder-select" value={selectedFolderForMove} onChange={(e) => dispatch({ type: 'SET_STATE', payload: { selectedFolderForMove: e.target.value } })}>
                            <option value="" disabled>Select a folder...</option>
                            {Object.keys(folders).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <button onClick={handleMoveToFolder} className="move-to-folder-btn">Move to Folder</button>
                    </div>
                </div>
            )}
            <div className="card folders-container">
                <h2 className="section-heading">Your Folders</h2>
                <button onClick={() => dispatch({ type: 'SET_STATE', payload: { isCreateFolderModalOpen: true } })} className="create-folder-btn">Create New Folder</button>
                <div className="folder-list">
                    {Object.keys(folders).length > 0 ? Object.keys(folders).map(name => (
                        <details key={name} className="folder">
                            <summary onClick={(e) => { if (e.target.closest('button')) e.preventDefault(); }}>
                                <div className="folder-summary">
                                    <span>{name} ({folders[name].length} {folders[name].length === 1 ? 'card' : 'cards'})</span>
                                    <div className="folder-export-buttons">
                                        <button onClick={() => { if (isListening) stopListening(); dispatch({ type: 'SET_STATE', payload: { studyingFolder: { name, cards: folders[name] } } }); }} className="study-btn">Study</button>
                                        <button onClick={() => exportFolderToPDF(name)}>Export PDF</button>
                                        <button onClick={() => exportFolderToCSV(name)}>Export CSV</button>
                                    </div>
                                </div>
                            </summary>
                            {folders[name].map((card) => (
                                <div key={card.id} className="card saved-card-in-folder">
                                    <div className="card-content">
                                        {renderCardContent(card, 'folder', name)}
                                        <button onClick={() => dispatch({ type: 'DELETE_CARD_FROM_FOLDER', payload: { folderName: name, cardId: card.id } })} className="card-delete-btn">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </details>
                    )) : <p className="subtle-text">No folders created yet.</p>}
                </div>
            </div>
        </>
    );
};


// --- HELPER COMPONENTS (Unchanged, but included for completeness) ---
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
              <label>Delay: {speechDelay}s</label>
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
const CreateFolderModal = ({ onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) onCreate(folderName.trim());
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" className="modal-input" placeholder="Enter folder name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
            <button type="submit" className="modal-create-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const PromptModal = ({ title, message, defaultValue, onClose, onConfirm }) => {
  const [value, setValue] = useState(defaultValue || '');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) onConfirm(value);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p className="modal-message">{message}</p>
        <form onSubmit={handleSubmit}>
          <input type="number" className="modal-input" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
            <button type="submit" className="modal-create-btn">Confirm</button>
          </div>
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
        <MainApp />
      </div>
    );
  } else {
    return <LandingPage onEnter={() => setShowApp(true)} />;
  }
}

export default App;

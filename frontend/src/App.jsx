import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import './App.css';

// --- Flashcard Viewer Component ---
const FlashcardViewer = ({ folderName, cards, onClose }) => {
  const [deck, setDeck] = useState([...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [flaggedCards, setFlaggedCards] = useState({});
  const [reviewMode, setReviewMode] = useState('all');

  // --- TTS State ---
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechDelay, setSpeechDelay] = useState(3);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const speechTimeoutRef = useRef(null);


  const studyDeck = reviewMode === 'flagged' 
    ? deck.filter(card => flaggedCards[card.id]) 
    : deck;

  const currentCard = studyDeck[currentIndex];

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
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = speechRate;
    utterance.onend = onEnd;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    setIsReading(false);
    window.speechSynthesis.cancel();
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
  };
  
  // --- MODIFIED: Main useEffect for TTS logic ---
  useEffect(() => {
    if (!isReading || !currentCard) {
      return; // Do nothing if not in reading mode or no card
    }

    // This function defines the sequence for reading a single card
    const readCardSequence = () => {
      setIsFlipped(false);
      const questionText = `Question: ${currentCard.question}`;
      
      speak(questionText, () => {
        // When the question is done, set a timeout for the answer
        speechTimeoutRef.current = setTimeout(() => {
          setIsFlipped(true);
          const answerText = `Answer: ${currentCard.answer}`;
          speak(answerText, () => {
            // When the answer is done, automatically go to the next card
            setCurrentIndex(prev => (prev + 1) % studyDeck.length);
          });
        }, speechDelay * 1000);
      });
    };

    readCardSequence();

    // Cleanup function: This will run when the component unmounts OR when dependencies change
    // (i.e., when user manually navigates, changing currentIndex)
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(speechTimeoutRef.current);
    };
  }, [isReading, currentIndex, studyDeck]); // Re-run the effect if reading mode changes or the card changes


  const handleCardClick = () => {
    if (studyDeck.length === 0) return;
    stopReading(); // Stop audio on manual click
    setIsFlipped(prev => !prev);
  };

  // --- MODIFIED: Simplified navigation functions ---
  const goToNext = () => {
    if (studyDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % studyDeck.length);
  };

  const goToPrev = () => {
    if (studyDeck.length === 0) return;
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
      if (newFlags[cardId]) {
        delete newFlags[cardId];
      } else {
        newFlags[cardId] = true;
      }
      return newFlags;
    });
  };

  const toggleReviewMode = () => {
    stopReading();
    setReviewMode(prev => prev === 'all' ? 'flagged' : 'all');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("cardIndex", index);
  };

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
        <h2>Studying: {folderName} {reviewMode === 'flagged' ? `(Flagged)` : ''}</h2>
        <button onClick={onClose} className="viewer-close-btn">&times;</button>
      </div>

      <div className="viewer-controls">
        <button onClick={scrambleDeck}>Scramble</button>
        <button onClick={() => setIsArrangeMode(!isArrangeMode)}>
          {isArrangeMode ? 'Study' : 'Arrange'}
        </button>
        <button onClick={toggleReviewMode}>
          {reviewMode === 'all' ? `Review Flagged (${Object.keys(flaggedCards).length})` : 'Review All'}
        </button>
      </div>

      {isArrangeMode ? (
        <div className="arrange-container">
          <h3>Drag and drop to reorder</h3>
          {deck.map((card, index) => (
            <div 
              key={card.id} 
              className="arrange-card"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
            >
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
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>
                      &#9873;
                    </button>
                    <p>{currentCard?.question}</p>
                  </div>
                  <div className="card-face card-back">
                    <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${flaggedCards[currentCard.id] ? 'active' : ''}`}>
                      &#9873;
                    </button>
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
            <button onClick={isReading ? stopReading : () => setIsReading(true)} className="tts-play-btn">
              {isReading ? '■ Stop Audio' : '▶ Play Audio'}
            </button>
            <div className="tts-slider-group">
              <label>Voice</label>
              <select 
                className="tts-voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={isReading}
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            <div className="tts-slider-group">
              <label>Delay: {speechDelay}s</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1" 
                value={speechDelay} 
                onChange={(e) => setSpeechDelay(Number(e.target.value))}
                disabled={isReading}
              />
            </div>
            <div className="tts-slider-group">
              <label>Speed: {speechRate}x</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speechRate} 
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                disabled={isReading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Create Folder Modal Component ---
const CreateFolderModal = ({ onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="Enter folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
            <button type="submit" className="modal-create-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};


function App() {
  const [appMode, setAppMode] = useState('live');
  const [isListening, setIsListening] = useState(false);
  const [notification, setNotification] = useState('');
  const [duration, setDuration] = useState(10);
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  const [folders, setFolders] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [voiceActivated, setVoiceActivated] = useState(false);
  const [checkedCards, setCheckedCards] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [studyingFolder, setStudyingFolder] = useState(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);


  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const storedFolders = localStorage.getItem('flashfonic-folders');
    if (storedFolders) setFolders(JSON.parse(storedFolders));
  }, []);

  useEffect(() => {
    localStorage.setItem('flashfonic-folders', JSON.stringify(folders));
  }, [folders]);

  const handleModeChange = (mode) => {
    if (isListening) stopListening();
    setAppMode(mode);
    setNotification('');
    setGeneratedFlashcards([]);
  };

  const startListening = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setNotification('Listening... click "Flash It" or use voice trigger.');

      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      audioChunksRef.current = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      mediaRecorderRef.current.start(1000);

      if (voiceActivated && 'webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          if (transcript.includes('flash it')) {
            handleLiveFlashIt();
          }
        };

        recognition.onerror = (e) => console.error('Voice trigger error:', e);

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      setNotification("Microphone access denied.");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setNotification('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
      setAudioSrc(URL.createObjectURL(file));
      setNotification('');
    }
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;
    const timeUpdate = () => setCurrentTime(audio.currentTime);
    const loadedMeta = () => setAudioDuration(audio.duration);
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
      setIsPlaying(true);
    } else {
      audioPlayerRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * audioDuration;
    audioPlayerRef.current.currentTime = seekTime;
  };

  const generateFlashcard = async (audioBlob) => {
    setIsGenerating(true);
    setNotification('Sending audio to server...');

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];

        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio_data: base64Audio })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate flashcard.');
            
            const newCard = { ...data, id: Date.now() };
            setGeneratedFlashcards(prev => [newCard, ...prev]);
            setNotification('');
        } catch (error) {
            console.error("Error:", error);
            setNotification("Failed to process audio. Please try again");
        } finally {
            setIsGenerating(false);
        }
    };
  };

  const handleLiveFlashIt = () => {
    if (audioChunksRef.current.length === 0) {
      setNotification('Not enough audio captured yet.');
      return;
    }
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    generateFlashcard(audioBlob);
  };

  const handleUploadFlashIt = async () => {
    if (!uploadedFile) {
      setNotification('Please select a file first.');
      return;
    }
    generateFlashcard(uploadedFile);
  };
  
  const handleCardCheck = (cardId) => {
    setCheckedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCheckAll = () => {
    const allChecked = generatedFlashcards.every(card => checkedCards[card.id]);
    const newCheckedCards = {};
    generatedFlashcards.forEach(card => {
        newCheckedCards[card.id] = !allChecked;
    });
    setCheckedCards(newCheckedCards);
  };

  const moveCheckedToFolder = (folderName) => {
    const cardsToMove = generatedFlashcards.filter(card => checkedCards[card.id]);
    if (cardsToMove.length > 0 && folders[folderName]) {
        setFolders(prev => ({
            ...prev,
            [folderName]: [...prev[folderName], ...cardsToMove]
        }));
        setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
        setCheckedCards({});
    }
  };

  const handleCreateFolder = (folderName) => {
    if (folders[folderName]) {
      alert("A folder with this name already exists.");
    } else {
      setFolders(prev => ({ ...prev, [folderName]: [] }));
    }
    setIsCreateFolderModalOpen(false);
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

  const exportFolderToPDF = (folderName) => {
    const cardsPerPageOption = prompt("How many flashcards per page? (6, 8, or 10)", "8");
    const cardsPerPage = parseInt(cardsPerPageOption, 10);
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
  };
  
  const exportFolderToCSV = (folderName) => {
      const numCards = parseInt(prompt("How many flashcards to export?", folders[folderName].length), 10);
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
  };

  const renderCardContent = (card, source, folderName) => {
    if (editingCard && editingCard.id === card.id) {
      return (
        <div className="edit-mode">
          <textarea
            className="edit-textarea"
            value={editingCard.question}
            onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })}
          />
          <textarea
            className="edit-textarea"
            value={editingCard.answer}
            onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })}
          />
          <div className="edit-actions">
            <button onClick={saveEdit} className="edit-save-btn">Save</button>
            <button onClick={() => setEditingCard(null)} className="edit-cancel-btn">Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <>
        <button onClick={() => startEditing(card, source, folderName)} className="edit-btn">Edit</button>
        <p><strong>Q:</strong> {card.question}</p>
        <p><strong>A:</strong> {card.answer}</p>
      </>
    );
  };


  return (
    <>
      {studyingFolder && (
        <FlashcardViewer 
          folderName={studyingFolder.name} 
          cards={studyingFolder.cards} 
          onClose={() => setStudyingFolder(null)} 
        />
      )}

      {isCreateFolderModalOpen && (
        <CreateFolderModal 
          onClose={() => setIsCreateFolderModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      )}

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
              <button onClick={isListening ? stopListening : startListening}>{isListening ? '■ Stop Listening' : '● Start Listening'}</button>
              <div className="voice-toggle-container">
                  <button 
                      onClick={() => setVoiceActivated(!voiceActivated)}
                      className={`voice-activate-btn ${voiceActivated ? 'active' : ''}`}
                  >
                      Voice Activate
                  </button>
              </div>
            </div>
            {voiceActivated && <p className="voice-hint">🎤 Say "Flash IT!" to capture.</p>}
            <div className="slider-container">
              <label htmlFor="duration-slider">Capture Last: {duration}s</label>
              <input id="duration-slider" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} disabled={isListening} />
            </div>
            <button onClick={handleLiveFlashIt} className="flash-it-button" disabled={!isListening || isGenerating}>{isGenerating ? 'Generating...' : '⚡ Flash It!'}</button>
          </>
        ) : (
          <>
            <div className="upload-button-container">
              <button onClick={triggerFileUpload}>{fileName ? 'Change File' : 'Select File'}</button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" style={{ display: 'none' }} />
            {fileName && <p className="file-name-display">Selected: {fileName}</p>}
            {audioSrc && (
              <div className="audio-player">
                <audio ref={audioPlayerRef} src={audioSrc} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                <button onClick={togglePlayPause} className="play-pause-btn">{isPlaying ? '❚❚' : '▶'}</button>
                <div className="progress-bar-container" onClick={handleSeek}>
                  <div className="progress-bar" style={{ width: `${(currentTime / audioDuration) * 100}%` }}></div>
                </div>
                <span className="time-display">{formatTime(currentTime)} / {formatTime(audioDuration)}</span>
              </div>
            )}
            <div className="slider-container" style={{ marginTop: '1rem' }}>
              <label htmlFor="duration-slider-upload">Capture Last: {duration}s</label>
              <input id="duration-slider-upload" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
             <button onClick={handleUploadFlashIt} className="flash-it-button" disabled={!uploadedFile || isGenerating}>{isGenerating ? 'Generating...' : '⚡ Flash It!'}</button>
          </>
        )}
      </div>

      {notification && <p className="notification">{notification}</p>}
      
      {generatedFlashcards.length > 0 && (
          <div className="generated-cards-queue">
              <div className="queue-header">
                <h3>Review Queue</h3>
                <button onClick={handleCheckAll}>Check All</button>
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
                  <select onChange={(e) => moveCheckedToFolder(e.target.value)} defaultValue="">
                      <option value="" disabled>Move checked to folder...</option>
                      {Object.keys(folders).map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
              </div>
          </div>
      )}

      <div className="folders-container">
        <h2 className="section-heading">Your Folders</h2>
        <button onClick={() => setIsCreateFolderModalOpen(true)} className="create-folder-btn">Create New Folder</button>
        <div className="folder-list">
          {Object.keys(folders).length > 0 ? Object.keys(folders).map(name => (
            <details key={name} className="folder">
              <summary>
                <div className="folder-summary">
                    <span>{name} ({folders[name].length} {folders[name].length === 1 ? 'card' : 'cards'})</span>
                    <div className="folder-export-buttons">
                        <button onClick={() => setStudyingFolder({ name, cards: folders[name] })} className="study-btn">Study</button>
                        <button onClick={() => exportFolderToPDF(name)}>Export PDF</button>
                        <button onClick={() => exportFolderToCSV(name)}>Export CSV</button>
                    </div>
                </div>
              </summary>
              {folders[name].map((card) => (
                <div key={card.id} className="card saved-card-in-folder">
                  <div className="card-content">
                    {renderCardContent(card, 'folder', name)}
                    <button onClick={() => deleteCardFromFolder(name, card.id)} className="card-delete-btn">🗑️</button>
                  </div>
                </div>
              ))}
            </details>
          )) : <p className="subtle-text">No folders created yet.</p>}
        </div>
      </div>
    </>
  );
}

const formatTime = (time) => {
  if (isNaN(time) || time === 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default App;

import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('live');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState('');
  const [notification, setNotification] = useState('');
  const [transcript, setTranscript] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [folders, setFolders] = useState({});
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [checkedCards, setCheckedCards] = useState([]);
  const [voiceActivate, setVoiceActivate] = useState(false);
  const [fileName, setFileName] = useState('');

  const silenceTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setNotification('');
    setAudioURL('');
    setTranscript('');
    setFileName('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result.split(',')[1];
      try {
        const res = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio_data: base64Audio })
        });

        const data = await res.json();
        if (res.ok) {
          setFlashcards(prev => [...prev, data]);
          setNotification('Flashcard generated successfully.');
        } else {
          throw new Error(data.error || 'Failed to process audio.');
        }
      } catch (err) {
        console.error(err);
        setNotification('❌ Failed to process audio. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  const startListening = async () => {
    setNotification('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkForSilence = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((a, b) => a + b, 0);

        if (sum < 5) {
          if (!silenceTimeoutRef.current) {
            silenceTimeoutRef.current = setTimeout(() => {
              stopListening();
              setNotification('Stopped listening due to silence.');
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

      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          try {
            const res = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcard', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio_data: base64Audio })
            });

            const data = await res.json();
            if (res.ok) {
              setFlashcards(prev => [...prev, data]);
              setNotification('Flashcard generated.');
            } else {
              throw new Error(data.error || 'Failed to generate flashcard.');
            }
          } catch (err) {
            console.error(err);
            setNotification('❌ Error processing audio.');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      setNotification('🎤 Microphone access denied or unavailable.');
    }
  };

  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setRecording(false);
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const toggleCardCheck = (index) => {
    setCheckedCards(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleMoveToFolder = () => {
    if (!selectedFolder || checkedCards.length === 0) return;
    const updatedFolders = { ...folders };
    if (!updatedFolders[selectedFolder]) {
      updatedFolders[selectedFolder] = [];
    }
    checkedCards.forEach(index => {
      updatedFolders[selectedFolder].push(flashcards[index]);
    });
    setFolders(updatedFolders);
    setFlashcards(prev => prev.filter((_, idx) => !checkedCards.includes(idx)));
    setCheckedCards([]);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    if (!folders[newFolderName]) {
      setFolders(prev => ({ ...prev, [newFolderName]: [] }));
      setNewFolderName('');
    }
  };

  return (
    <div id="root">
      <div className="header">
        <h1>Flashfonic</h1>
      </div>

      <div className="mode-selector">
        <button className={mode === 'live' ? 'active' : ''} onClick={() => handleModeChange('live')}>Live Capture</button>
        <button className={mode === 'upload' ? 'active' : ''} onClick={() => handleModeChange('upload')}>Upload File</button>
      </div>

      <div className="main-controls">
        {mode === 'live' && (
          <div className="listening-control">
            <button onClick={recording ? stopListening : startListening} className="flash-it-button">
              {recording ? 'Stop Listening' : 'Start Listening'}
            </button>

            <label className="voice-toggle">
              <input
                type="checkbox"
                checked={voiceActivate}
                onChange={() => setVoiceActivate(prev => !prev)}
              />
              <span>Voice Activate</span>
            </label>
          </div>
        )}

        {voiceActivate && mode === 'live' && (
          <div className="subtle-text">🎤 When you need a flashcard, just say "Flash IT!"</div>
        )}

        {mode === 'upload' && (
          <div className="upload-view">
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            {fileName && <div className="file-name-display">{fileName}</div>}
          </div>
        )}

        <div className="notification">{notification}</div>
      </div>

      {flashcards.length > 0 && (
        <div className="saved-cards-container">
          <h2>Saved for Review</h2>
          {flashcards.map((card, idx) => (
            <div key={idx} className="card saved-card">
              <input
                type="checkbox"
                checked={checkedCards.includes(idx)}
                onChange={() => toggleCardCheck(idx)}
              />
              <h3>Q: {card.question}</h3>
              <p>A: {card.answer}</p>
            </div>
          ))}
          <div className="folder-actions">
            <button onClick={() => setCheckedCards(flashcards.map((_, i) => i))}>Check All</button>
            <select onChange={(e) => setSelectedFolder(e.target.value)} value={selectedFolder}>
              <option value="">Select Folder</option>
              {Object.keys(folders).map((folder, i) => (
                <option key={i} value={folder}>{folder}</option>
              ))}
            </select>
            <button className="save-button" onClick={handleMoveToFolder}>Move to Folder</button>
          </div>
        </div>
      )}

      <div className="folders-container">
        <h2>Folders</h2>
        {Object.entries(folders).map(([folderName, cards], i) => (
          <details key={i} className="folder-list">
            <summary>{folderName}</summary>
            {cards.map((card, j) => (
              <div key={j} className="card saved-card-in-folder">
                <h3>Q: {card.question}</h3>
                <p>A: {card.answer}</p>
              </div>
            ))}
          </details>
        ))}

        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button className="create-folder-btn" onClick={handleCreateFolder}>Create Folder</button>
      </div>
    </div>
  );
}

export default App;

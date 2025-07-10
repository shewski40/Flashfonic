import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Main App Component
export default function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioSrc]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setFileName(file.name);
      setFlashcards([]);
      setError(null);
    } else {
      setError('Please select a valid audio or video file.');
      setAudioFile(null);
      setAudioSrc(null);
      setFileName('');
    }
  };

  const handleFlashIt = async () => {
    if (!audioFile) {
      setError("Please upload an audio/video file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('timestamp', audioRef.current.currentTime);

      // This uses the Vite proxy to forward the request to your local backend
      const response = await fetch('https://flashfonic-backend.shewski40.replit.dev/api/generate-flashcard', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'The server returned an error.' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const newFlashcard = await response.json();
      setFlashcards(prev => [...prev, newFlashcard].sort((a, b) => a.timestamp - b.timestamp));

    } catch (error) {
      setError("Failed to generate flashcard. " + error.message);
      console.error("Error fetching flashcard:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteFlashcard = (id) => {
      setFlashcards(flashcards.filter(card => card.id !== id));
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Flashfonic
          </h1>
          <p className="text-gray-400 mt-2">Listen, "Flash It", and Learn.</p>
        </header>

        <main className="bg-gray-800 shadow-2xl rounded-2xl p-6">
          <div className="border-b border-gray-700 pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Upload Your Audio/Video</h2>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {fileName ? 'Change File' : 'Select Audio or Video File'}
            </button>
            {fileName && <p className="text-center mt-3 text-gray-300">Loaded: <span className="font-medium text-purple-300">{fileName}</span></p>}
          </div>

          {audioSrc && (
            <div className="border-b border-gray-700 pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">2. Listen and Capture</h2>
              <audio ref={audioRef} src={audioSrc} className="w-full" controls></audio>
              <button
                onClick={handleFlashIt}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-extrabold text-xl py-4 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? 'Generating...' : '⚡ Flash It!'}
              </button>
            </div>
          )}

          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Review Flashcards</h2>
            <div className="space-y-4">
              {flashcards.map(card => (
                <div key={card.id} className="bg-gray-700 p-4 rounded-lg shadow-md group">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-purple-300 font-mono mb-2">Triggered at: {formatTime(card.timestamp)}</div>
                      <p className="font-semibold text-lg">{card.question}</p>
                      <p className="text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{card.answer}</p>
                    </div>
                     <button onClick={() => deleteFlashcard(card.id)} className="text-gray-500 hover:text-red-400 transition-colors opacity-20 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


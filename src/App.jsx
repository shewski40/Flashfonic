import React, { useState, useRef, useEffect } from 'react';

// Helper to format time from seconds to MM:SS
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Main App Component
export default function App() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptionDuration, setTranscriptionDuration] = useState(20); // New state for adjustable duration

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Effect to handle audio playback events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]);

  // Handle file selection from the input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setFileName(file.name);
      setFlashcards([]);
      setError(null);
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
      }
    } else {
      setError('Please select a valid audio or video file.');
      setAudioSrc(null);
      setFileName('');
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Toggle play/pause state of the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Seek functionality for the progress bar
  const handleSeek = (event) => {
    if (audioRef.current) {
        const seekTime = (event.nativeEvent.offsetX / event.target.clientWidth) * duration;
        audioRef.current.currentTime = seekTime;
    }
  };

  // "Flash It" button logic - UPDATED
  const handleFlashIt = async () => {
    if (!audioSrc) {
        setError("Please upload an audio/video file first.");
        return;
    }

    const endTime = audioRef.current.currentTime;
    const startTime = Math.max(0, endTime - transcriptionDuration);

    setIsLoading(true);
    setError(null);

    // --- MOCK API CALLS ---
    // In a real app, you would:
    // 1. Send the audio file and the start/end times to a backend.
    // 2. On the backend, slice the audio file from startTime to endTime.
    // 3. Send the audio segment to Whisper to transcribe the speech.
    // 4. Send the transcription to GPT-4 to generate a Q&A pair.
    // 5. Return the Q&A pair to the frontend.

    // For this MVP, we'll simulate the process with a delay.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newFlashcard = {
      id: Date.now(),
      timestamp: endTime,
      question: `What was the key point between ${formatTime(startTime)} and ${formatTime(endTime)}?`,
      answer: `This is a sample answer for the content in the last ${transcriptionDuration} seconds.`,
    };
    // --- END MOCK ---

    setFlashcards(prev => [...prev, newFlashcard].sort((a,b) => a.timestamp - b.timestamp));
    setIsLoading(false);
  };

  // Delete a flashcard
  const deleteFlashcard = (id) => {
      setFlashcards(flashcards.filter(card => card.id !== id));
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Flashfonic
          </h1>
          <p className="text-gray-400 mt-2">Listen, "Flash It", and Learn.</p>
        </header>

        <main className="bg-gray-800 shadow-2xl rounded-2xl p-6">
          {/* Upload Section */}
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
              onClick={handleUploadClick}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {fileName ? 'Change File' : 'Select Audio or Video File'}
            </button>
            {fileName && <p className="text-center mt-3 text-gray-300">Loaded: <span className="font-medium text-purple-300">{fileName}</span></p>}
          </div>

          {/* Player and Flash It Button */}
          {audioSrc && (
            <div className="border-b border-gray-700 pb-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">2. Listen and Capture</h2>
                <audio ref={audioRef} src={audioSrc} className="hidden"></audio>

                {/* Custom Player UI */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono">{formatTime(currentTime)}</span>
                        <span className="text-sm font-mono">{formatTime(duration)}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2.5 cursor-pointer" onClick={handleSeek}>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                    </div>
                     <div className="flex items-center justify-center mt-4">
                        <button onClick={togglePlayPause} className="bg-gray-800 p-3 rounded-full hover:bg-gray-600 transition-colors focus:outline-none">
                            {isPlaying ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            }
                        </button>
                    </div>
                </div>

                {/* NEW: Duration Slider */}
                <div className="mt-6">
                    <label htmlFor="duration-slider" className="block mb-2 text-sm font-medium text-gray-300">
                        Transcription Duration: <span className="font-bold text-purple-300">{transcriptionDuration} seconds</span>
                    </label>
                    <input
                        id="duration-slider"
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={transcriptionDuration}
                        onChange={(e) => setTranscriptionDuration(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                <button
                    onClick={handleFlashIt}
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-extrabold text-xl py-4 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        '⚡ Flash It!'
                    )}
                </button>
            </div>
          )}

          {/* Error Display */}
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

          {/* Flashcards Review Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Review Flashcards</h2>
            <div className="space-y-4">
              {flashcards.length > 0 ? (
                flashcards.map(card => (
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
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400">Your generated flashcards will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

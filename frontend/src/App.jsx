import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import { marked } from 'marked'; // For converting markdown to HTML
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import * as Tone from 'tone';

// --- Rendering Components ---

// Updated component to handle separate reactant and product SMILES strings
const SmilesRenderer = ({ text }) => {
    // Regex to capture reactant and product from the new format
    const reactionRegex = /SMILES\[(.*?)\]>>SMILES\[(.*?)\]/;
    const reactionMatch = text.match(reactionRegex);

    if (reactionMatch) {
        const reactantSmiles = encodeURIComponent(reactionMatch[1]);
        const productSmiles = encodeURIComponent(reactionMatch[2]);
        
        const reactantImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${reactantSmiles}/image?format=png&width=400&height=400`;
        const productImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${productSmiles}/image?format=png&width=400&height=400`;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <img src={reactantImageUrl} alt="Reactant Structure" style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '45%' }} />
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-soft)' }}>→</span>
                <img src={productImageUrl} alt="Product Structure" style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '45%' }} />
            </div>
        );
    }

    // Fallback for single molecules (or old format)
    const singleMoleculeRegex = /SMILES\[(.*?)\]/;
    const singleMatch = text.match(singleMoleculeRegex);

    if (singleMatch) {
        const smiles = encodeURIComponent(singleMatch[1]);
        const imageUrl = `https://cactus.nci.nih.gov/chemical/structure/${smiles}/image?format=png&width=500&height=500`;
        return <img src={imageUrl} alt="Chemical Structure" style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '100%' }} />;
    }

    // If no SMILES string is found, fall back to the KaTeX renderer
    return <KatexRenderer text={text} />;
};


// This component will find and render LaTeX expressions in a string.
const KatexRenderer = ({ text }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && window.katex) {
            const renderMathInText = (text) => {
                const blockRegex = /\$\$(.*?)\$\$/g;
                const inlineRegex = /\$(.*?)\$/g;

                let html = text.replace(blockRegex, (match, expression) => {
                    try {
                        return window.katex.renderToString(expression, {
                            throwOnError: false,
                            displayMode: true
                        });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match; // Return original string on error
                    }
                });

                html = html.replace(inlineRegex, (match, expression) => {
                    // Avoid rendering block expressions again if they were missed
                    if (match.startsWith('$$')) return match;
                    try {
                        return window.katex.renderToString(expression, {
                            throwOnError: false,
                            displayMode: false
                        });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match; // Return original string on error
                    }
                });
                return html;
            };
            
            containerRef.current.innerHTML = renderMathInText(text);
        }
    }, [text]);

    return <span ref={containerRef} />;
};


// --- HELPER FUNCTIONS ---

// Helper function to generate a simple UUID for browser compatibility
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to format time in seconds to MM:SS format
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const floorSeconds = Math.floor(seconds);
  const min = Math.floor(floorSeconds / 60);
  const sec = floorSeconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

// Helper function to encode audio buffer to WAV format
function encodeWAV(audioBuffer) {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i, sample;
    let offset = 0;
    let pos = 0;

    setUint32(0x46464952);  // "RIFF"
    setUint32(length - 8);  // file length - 8
    setUint32(0x45564157);  // "WAVE"

    setUint32(0x20746d66);  // "fmt " chunk
    setUint32(16);          // length of format data
    setUint16(1);           // type of format (1=PCM)
    setUint16(numOfChan);
    setUint32(audioBuffer.sampleRate);
    setUint32(audioBuffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16);          // bits per sample

    setUint32(0x61746164);  // "data" chunk
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


// --- MODAL AND UI COMPONENTS ---

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

const HowToPlayModal = ({ onClose }) => {
    return (
        <div className="modal-overlay how-to-play-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="how-to-play-title">How to Play: Verbatim Master</h2>
                <div className="how-to-play-content">
                    <p><strong>The Goal:</strong> Prove you're a master of recall! Your mission is to listen to the question and then speak the answer exactly as it appears on the flashcard.</p>
                    
                    <h3>Gameplay</h3>
                    <ol>
                        <li><strong>Listen Carefully:</strong> The AI will read a question from your deck aloud.</li>
                        <li><strong>Speak Clearly:</strong> After the question, the microphone will activate. Speak the answer clearly and precisely. The AI stops listening after a moment of silence.</li>
                        <li><strong>Get Scored:</strong> Our Verbatim Master AI will instantly score your answer based on how close it is to the correct one.</li>
                    </ol>

                    <h3>Scoring & Ranks</h3>
                    <p>Your final score is tallied and you're awarded a rank based on your performance:</p>
                    <ul>
                        <li><strong>Verbatim Master (100%):</strong> 🏆 Flawless recall!</li>
                        <li><strong>Synapse Slayer (90-99%):</strong> 🧠 A truly elite memory.</li>
                        <li><strong>Recall Assassin (80-89%):</strong> 🗡️ Sharp and deadly accurate.</li>
                        <li><strong>Mind Sniper (70-79%):</strong> 🎯 On target, but aim for perfection.</li>
                        <li><strong>Mnemonic Casualty (&lt;70%):</strong> 🩹 A valiant effort. Review and try again!</li>
                    </ul>
                    
                    <h3>The Benefit</h3>
                    <p>This isn't just a game; it's a powerful study tool. Recalling information verbatim strengthens neural pathways, dramatically improving your long-term memory and mastery of the subject.</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-create-btn">Got It!</button>
                </div>
            </div>
        </div>
    );
};

const EnterNameModal = ({ onClose, onConfirm }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
        }
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Your Name</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="modal-input" 
                        placeholder="Player Name..." 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        autoFocus 
                    />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel-btn" onClick={() => onClose()}>Cancel</button>
                        <button type="submit" className="modal-create-btn">Let's Go!</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GamesModal = ({ folder, onClose, onLaunchGame, onLaunchAnamnesisNemesis }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content games-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Games for "{folder.name}"</h2>
                <p className="modal-message">Choose a game mode to test your knowledge!</p>
                <div className="game-selection-grid">
                    <button onClick={() => onLaunchGame(folder)}>Verbatim Master AI</button>
                    <button onClick={() => onLaunchAnamnesisNemesis(folder)}>Anamnesis Nemesis</button>
                    {/* Add more game buttons here */}
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-cancel-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const AnamnesisNemesisLandingPage = ({ onClose, onStartGame }) => {
    return (
        <div className="viewer-overlay anamnesis-landing-page">
            <h1 className="anamnesis-title">ANAMNESIS NEMESIS</h1>
            <p className="anamnesis-tagline">The AI that never forgets, and never forgives.</p>
            <p className="anamnesis-description">
                Go head to head with FlashFonic's dark alter ego. Say your answer out loud. The AI scores your recall - and roasts your soul if you miss.
            </p>

            <div className="anamnesis-features-grid">
                <div className="anamnesis-feature-card">
                    <h3>Verbatim Master Mode (Solo)</h3>
                    <p>Refine your recall with precision. Practice speaking answers exactly as they are on your flashcards, with instant, brutal feedback from the AI.</p>
                </div>
                <div className="anamnesis-feature-card">
                    <h3>Flash Duel (Vs. Friend)</h3>
                    <p>Challenge a friend! Take turns answering questions from your shared deck. The AI judges both of you, leaving no room for debate on who truly knows their stuff.</p>
                </div>
                <div className="anamnesis-feature-card">
                    <h3>Flash Party (Multiplayer)</h3>
                    <p>Host a study session where everyone gets roasted! Players take turns answering different cards from the deck, and the Nemesis AI provides individual feedback.</p>
                </div>
            </div>

            <div className="coming-soon-banner">
                Game Modes Coming Soon!
            </div>
            <button onClick={onClose} className="game-action-btn" style={{marginTop: '1rem'}}>Back to Games</button>
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
    useEffect(() => {
        console.log(`PromptModal rendered: title='${title}', defaultValue='${defaultValue}', currentValue='${value}'`);
    }, [title, defaultValue, value]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`PromptModal handleSubmit triggered with value: ${value}`);
        if (value) onConfirm(value);
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

const FlashNotesActionModal = ({ folder, onClose, onGenerate, isGenerating }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Flash Notes for "{folder.name}"</h2>
                <p className="modal-message">
                    {folder.flashNotes ? 'Your notes are ready. View them or generate a new version.' : 'Generate themed summary notes from your flashcards.'}
                </p>
                <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => onGenerate(folder, 'view')} className="modal-create-btn" disabled={isGenerating}>
                        {isGenerating ? 'Please wait...' : (folder.flashNotes ? 'View Notes' : 'Generate & View')}
                    </button>
                    <button onClick={() => onGenerate(folder, 'export')} className="modal-create-btn" disabled={isGenerating}>
                        {isGenerating ? 'Please wait...' : (folder.flashNotes ? 'Export Notes' : 'Generate & Export')}
                    </button>
                    {folder.flashNotes && (
                         <button onClick={() => onGenerate(folder, 'view', true)} className="modal-create-btn danger" disabled={isGenerating}>
                             {isGenerating ? 'Generating...' : 'Regenerate Notes'}
                         </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FlashNotesViewer = ({ folderName, notes, onClose }) => {
    return (
        <div className="viewer-overlay" onClick={onClose}>
            <div className="flash-notes-container" onClick={e => e.stopPropagation()}>
                <div className="viewer-header">
                    <h2>Flash Notes: {folderName}</h2>
                    <button onClick={onClose} className="viewer-close-btn">&times;</button>
                </div>
                <div className="flash-notes-content" dangerouslySetInnerHTML={{ __html: marked(notes) }} />
            </div>
        </div>
    );
};

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

const FlashcardViewer = ({ folder, onClose, onLaunchGame, onLaunchAnamnesisNemesis }) => {
    const [deck, setDeck] = useState([...folder.cards]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isArrangeMode, setIsArrangeMode] = useState(false);
    const [reviewMode, setReviewMode] = useState('all');
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
        return deck;
    }, [deck, reviewMode]);

    const currentCard = studyDeck[currentIndex];
    const currentCardId = currentCard ? currentCard.id : null;

    useEffect(() => {
        if (isArrangeMode || !currentCardId) return;

        setDeck(prevDeck => {
            const cardInDeck = prevDeck.find(c => c.id === currentCardId);
            if (cardInDeck && (!cardInDeck.lastViewed || (Date.now() - cardInDeck.lastViewed > 5000))) {
                return prevDeck.map(card =>
                    card.id === currentCardId ? { ...card, lastViewed: Date.now() } : card
                );
            }
            return prevDeck;
        });

    }, [currentCardId, isArrangeMode]);

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
                <h2>Studying: {folder.name}</h2>
                <button onClick={() => onClose(deck)} className="viewer-close-btn">&times;</button>
            </div>
            <div className="viewer-controls">
                <button onClick={scrambleDeck}>Scramble</button>
                <button onClick={() => setIsArrangeMode(!isArrangeMode)}>{isArrangeMode ? 'Study' : 'Arrange'}</button>
                <button onClick={() => handleReviewModeChange('all')} className={reviewMode === 'all' ? 'active' : ''}>Review All</button>
                <button onClick={() => handleReviewModeChange('flagged')} className={reviewMode === 'flagged' ? 'active' : ''}>{`Flagged (${flaggedCount})`}</button>
            </div>
            {isArrangeMode ? (
                <div className="arrange-container">
                    <h3>Drag and drop to reorder</h3>
                    {deck.map((card, index) => (
                        <div key={card.id} className="arrange-card" draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)}>
                            {index + 1}. <SmilesRenderer text={card.question} />
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
                                        <p><strong>Q:</strong> <SmilesRenderer text={currentCard?.question} /></p> 
                                    </div>
                                    <div className="card-face card-back">
                                        <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                                        <p><strong>A:</strong> <SmilesRenderer text={currentCard?.answer} /></p> 
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
                    <div className="games-section-container">
                        <h3>Games</h3>
                        <button className="game-launch-btn" onClick={() => onLaunchGame(folder)}>Verbatim Master AI</button>
                        <button className="game-launch-btn" onClick={() => onLaunchAnamnesisNemesis(folder)}>Anamnesis Nemesis</button>
                    </div>
                </>
            )}
        </div>
    );
};

const GameViewer = ({ folder, onClose, onBackToStudy, onExitGame, cameFromStudy, mostRecentScore }) => {
    const [deck, setDeck] = useState([...folder.cards].sort(() => Math.random() - 0.5));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('landing'); // landing, name_entry, ready, starting, asking, listening, scoring, round_result, game_over
    const [userAnswer, setUserAnswer] = useState('');
    const [lastScore, setLastScore] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [playMode, setPlayMode] = useState('continuous'); // 'manual' or 'continuous'
    
    // Voice selection state
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
    const voiceDropdownRef = useRef(null);

    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const speechEndTimerRef = useRef(null);

    const currentCard = deck[currentIndex];

    const sounds = useMemo(() => {
        const createSynth = (oscillatorType) => new Tone.Synth({
            oscillator: { type: oscillatorType },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
        }).toDestination();

        return {
            perfect: () => {
                const synth = createSynth('sine');
                synth.triggerAttackRelease('C5', '8n', Tone.now());
                synth.triggerAttackRelease('G5', '8n', Tone.now() + 0.1);
            },
            good: () => {
                const synth = createSynth('triangle');
                synth.triggerAttackRelease('E5', '8n');
            },
            ok: () => {
                const synth = createSynth('square');
                synth.triggerAttackRelease('C4', '8n');
            },
            wrong: () => {
                const noiseSynth = new Tone.NoiseSynth().toDestination();
                noiseSynth.triggerAttackRelease('4n');
            }
        };
    }, []);

    const getMedal = useCallback(() => {
        const totalPossible = deck.length * 100;
        if (totalPossible === 0) return { name: 'Mnemonic Casualty', animation: 'casualty-animation', icon: '🩹' };
        const percentage = (score / totalPossible) * 100;

        if (percentage === 100) return { name: 'Verbatim Master', animation: 'gold-medal-animation', icon: '🏆' };
        if (percentage >= 90) return { name: 'Synapse Slayer', animation: 'gold-medal-animation', icon: '🧠' };
        if (percentage >= 80) return { name: 'Recall Assassin', animation: 'silver-medal-animation', icon: '🗡️' };
        if (percentage >= 70) return { name: 'Mind Sniper', animation: 'bronze-medal-animation', icon: '🎯' };
        return { name: 'Mnemonic Casualty', animation: 'casualty-animation', icon: '🩹' };
    }, [deck.length, score]);

    const nextRound = useCallback(() => {
        setUserAnswer('');
        setLastScore(null);
        if (currentIndex < deck.length - 1) {
            setCurrentIndex(i => i + 1);
            setGameState('starting');
        } else {
            onClose(folder.id, score, playerName, getMedal().name); 
            setGameState('game_over');
        }
    }, [currentIndex, deck.length, onClose, folder.id, score, playerName, getMedal]);

    const speak = useCallback((text, onEndCallback) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = 1;
        utterance.onend = onEndCallback;
        window.speechSynthesis.speak(utterance);
    }, [voices, selectedVoice]);

    const submitAnswer = useCallback(async () => {
        if (!userAnswer.trim()) {
            setLastScore(0);
            sounds.wrong();
            const feedbackText = "Incorrect, 0 points. The correct answer was: " + currentCard.answer;
            speak(feedbackText, () => {
                if (playMode === 'continuous') {
                    setTimeout(nextRound, 3000);
                }
            });
            setGameState('round_result');
            return;
        }

        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/score-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAnswer, correctAnswer: currentCard.answer })
            });
            if (!response.ok) throw new Error('Scoring failed');
            const data = await response.json();
            
            const receivedScore = data.score;
            setLastScore(receivedScore);

            let feedbackText = '';
            if (receivedScore >= 70) {
                feedbackText = `Correct, for ${receivedScore} points.`;
                if (receivedScore === 100) sounds.perfect();
                else sounds.good();
                setScore(s => s + receivedScore);
            } else if (receivedScore >= 30) {
                feedbackText = `Partially correct, for ${receivedScore} points. The correct answer was: ${currentCard.answer}`;
                sounds.ok();
                setScore(s => s + receivedScore);
            } else {
                feedbackText = `Incorrect. The correct answer was: ${currentCard.answer}`;
                sounds.wrong();
            }

            speak(feedbackText, () => {
                if (playMode === 'continuous') {
                    setTimeout(nextRound, 3000);
                }
            });
            
            setGameState('round_result');

        } catch (error) {
            console.error("Error scoring answer:", error);
            setLastScore(0);
            sounds.wrong();
            const feedbackText = "There was an error scoring. The correct answer was: " + currentCard.answer;
            speak(feedbackText, () => {
                if (playMode === 'continuous') {
                    setTimeout(nextRound, 3000);
                }
            });
            setGameState('round_result');
        }
    }, [userAnswer, currentCard, sounds, playMode, nextRound, speak]);

    const startListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        let finalTranscript = '';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (e) => console.error("Speech recognition error:", e);

        recognitionRef.current.onresult = (event) => {
            clearTimeout(silenceTimerRef.current);
            clearTimeout(speechEndTimerRef.current);
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setUserAnswer(finalTranscript + interimTranscript);

            speechEndTimerRef.current = setTimeout(() => {
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    setGameState('scoring');
                }
            }, 1500);
        };

        recognitionRef.current.start();
        setGameState('listening');

        silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                setGameState('scoring');
            }
        }, 10000);
    }, []);

    const askQuestion = useCallback(() => {
        if (!currentCard) return;
        setGameState('asking');
        speak(`Question: ${currentCard.question}`, () => {
            startListening();
        });
    }, [currentCard, speak, startListening]);

    const stopAllAudio = () => {
        window.speechSynthesis.cancel();
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        clearTimeout(silenceTimerRef.current);
        clearTimeout(speechEndTimerRef.current);
    };

    const handleExit = () => {
        stopAllAudio();
        onExitGame();
    };

    const handleBackButton = () => {
        stopAllAudio();
        if (cameFromStudy) {
            onBackToStudy(folder);
        } else {
            onExitGame();
        }
    };

    const handlePause = () => {
        stopAllAudio();
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
        askQuestion();
    };

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

    useEffect(() => {
        if (gameState === 'starting') {
            setTimeout(() => askQuestion(), 3000); // 3-second countdown
        }
    }, [gameState, askQuestion]);

    useEffect(() => {
        if (gameState === 'scoring') {
            submitAnswer();
        }
    }, [gameState, submitAnswer]);
    
    const playAgain = () => {
        setDeck([...folder.cards].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setScore(0);
        setUserAnswer('');
        setLastScore(null);
        setGameState(playerName ? 'ready' : 'name_entry'); 
    };

    const renderVoiceSelector = () => (
        <div className="tts-slider-group custom-select-container" ref={voiceDropdownRef}>
            <label>Voice</label>
            <div className="custom-select-trigger" onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}>
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
    );

    const renderGameState = () => {
        if (isPaused) {
            return (
                <div className="game-pause-overlay">
                    <h2>Paused</h2>
                    <div className="game-end-actions">
                        <button className="game-action-btn" onClick={handleResume}>Resume</button>
                        <button className="game-action-btn" onClick={handleExit}>Exit Game</button>
                    </div>
                </div>
            )
        }
        switch (gameState) {
            case 'landing':
                return (
                    <div className="game-landing-page">
                        <h1 className="game-landing-title">VERBATIM MASTER AI</h1>
                        <div className="game-landing-actions">
                            <button className="game-action-btn" onClick={() => setGameState('name_entry')}>Start Game</button>
                            <button className="game-action-btn" onClick={() => setShowHowToPlay(true)}>How to Play</button>
                            <button className="game-action-btn" onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
                        </div>
                        <div className="game-play-mode-selector">
                            <button
                                className={`game-mode-btn ${playMode === 'manual' ? 'active' : ''}`}
                                onClick={() => setPlayMode('manual')}
                            >
                                Manual Play
                            </button>
                            <button
                                className={`game-mode-btn ${playMode === 'continuous' ? 'active' : ''}`}
                                onClick={() => setPlayMode('continuous')}
                            >
                                Continuous Play
                            </button>
                        </div>
                        <div className="game-landing-voice-selector">
                            {renderVoiceSelector()}
                        </div>
                        <button className="game-action-btn" onClick={handleBackButton}>Back</button>
                    </div>
                );
            case 'name_entry':
                return <EnterNameModal onClose={() => setGameState('landing')} onConfirm={(name) => { setPlayerName(name); setGameState('ready'); }} />;
            case 'ready':
                return (
                    <div className="game-status-fullscreen">
                        <button className="game-start-button" onClick={() => setGameState('starting')}>START</button>
                    </div>
                );
            case 'starting':
                return <div className="game-status-fullscreen">Get Ready...</div>;
            case 'asking':
                return <div className="game-status-fullscreen">Listen...</div>;
            case 'listening':
                return (
                    <div className="game-listening-container">
                        <div className="mic-animation">
                            <span className="mic-icon">🎤</span>
                            <div className="mic-wave"></div>
                        </div>
                        <p>Listening...</p>
                        <div className="game-user-answer-display">{userAnswer}</div>
                    </div>
                );
            case 'scoring':
                return <div className="game-status-fullscreen">Judging...</div>;
            case 'round_result':
                const isCorrect = lastScore >= 30;
                return (
                    <div className={`game-result-fullscreen ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? (
                                <>
                                    <div className="score-feedback-animation">+{lastScore}</div>
                                    <h2>Nice!</h2>
                                </>
                        ) : (
                            <>
                                <div className="score-feedback-animation incorrect-x">✕</div>
                                <h2>Incorrect</h2>
                                <p className="correct-answer-reveal">Correct Answer: <SmilesRenderer text={currentCard.answer} /></p>
                            </>
                        )}
                        {playMode === 'manual' && (
                           <button className="game-next-btn" onClick={nextRound}>Next</button>
                        )}
                        {playMode === 'continuous' && (
                           <p className="continuous-play-notice">Next card coming up...</p>
                        )}
                    </div>
                );
            case 'game_over':
                const totalPossibleScore = deck.length * 100;
                const finalMedal = getMedal();
                const sortedLeaderboard = [...(folder.leaderboard || [])].sort((a,b) => b.score - a.score);

                return (
                    <div className="game-over-container">
                        <h2 className="game-over-title">{finalMedal.name}</h2>
                        <div className={`medal-container ${finalMedal.animation}`}>
                            <span className="medal-icon">{finalMedal.icon}</span>
                        </div>
                        <p className="final-score-display">
                            Total Score: {score} / {totalPossibleScore}
                        </p>
                        <div className="leaderboard-container">
                            <h3>High Scores</h3>
                            <div className="leaderboard-list">
                                <div>
                                    <span>Rank</span>
                                    <span>Name</span>
                                    <span>Level</span>
                                    <span style={{textAlign: 'right'}}>Score</span>
                                </div>
                                {sortedLeaderboard.length > 0 ? sortedLeaderboard.map((entry, index) => (
                                    <li key={entry.id || index} className={entry.id === mostRecentScore?.id ? 'recent-score' : ''}>
                                        <span>#{index + 1}</span>
                                        <span>{(entry.name || 'ANONYMOUS').toUpperCase()}</span>
                                        <span>{entry.level}</span>
                                        <span>{entry.score}</span>
                                    </li>
                                )) : <li><p>No scores yet. Be the first!</p></li>}
                            </div>
                        </div>
                        <div className="game-end-actions">
                            <button className="game-action-btn" onClick={playAgain}>Play Again</button>
                            <button className="game-action-btn" onClick={() => onBackToStudy(folder)}>Back to Study</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    if (showLeaderboard) {
        const sortedLeaderboard = [...(folder.leaderboard || [])].sort((a,b) => b.score - a.score);
        return (
            <div className="viewer-overlay game-mode">
                <div className="leaderboard-container full-page">
                    <h2>Leaderboard: {folder.name}</h2>
                    <div className="leaderboard-list">
                        <div>
                            <span>Rank</span>
                            <span>Name</span>
                            <span>Level</span>
                            <span style={{textAlign: 'right'}}>Score</span>
                        </div>
                       {sortedLeaderboard.length > 0 ? sortedLeaderboard.map((entry, index) => (
                            <li key={entry.id || index}>
                                <span>#{index + 1}</span>
                                <span>{(entry.name || 'ANONYMOUS').toUpperCase()}</span>
                                <span>{entry.level}</span>
                                <span>{entry.score}</span>
                            </li>
                       )) : <li><p>No scores yet. Be the first!</p></li>}
                    </div>
                    <div className="game-end-actions">
                        <button className="game-action-btn" onClick={() => setShowLeaderboard(false)}>Back to Game</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="viewer-overlay game-mode">
            {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
            
            {gameState !== 'landing' && gameState !== 'game_over' && (
                <>
                    <div className="game-header">
                        <h3>VERBATIM MASTER AI</h3>
                        <div className="game-info">
                            <span>Card: {currentIndex + 1} / {deck.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <button onClick={handleExit} className="viewer-close-btn">&times;</button>
                    </div>
                    {gameState !== 'ready' && (
                        <div className="game-card-area">
                            <div className="game-card">
                                <p className="game-question"><strong>Q:</strong> <SmilesRenderer text={currentCard?.question} /></p> 
                            </div>
                        </div>
                    )}
                    <div className="in-game-voice-selector">
                        {renderVoiceSelector()}
                    </div>
                    {!isPaused && gameState !== 'ready' && (
                        <div className="in-game-controls">
                            <button onClick={handlePause}>Pause</button>
                            <button onClick={handleExit}>Exit</button>
                        </div>
                    )}
                </>
            )}
            
            <div className="game-state-overlay">
                {renderGameState()}
            </div>
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
  const [promptModalConfig, setPromptModalConfig] = useState(null); 
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
  const [folderSortBy, setFolderSortBy] = useState('name');
  const [draggedFolderId, setDraggedFolderId] = useState(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState(new Set());  
  const [selectedCardsInExpandedFolder, setSelectedCardsInExpandedFolder] = useState({});

  const [modalConfig, setModalConfig] = useState(null);   
  
  const [flashNotesActionModal, setFlashNotesActionModal] = useState(null); 
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [flashNotesContent, setFlashNotesContent] = useState(null); 
  const [showFlashNotesViewer, setShowFlashNotesViewer] = useState(false);

  const [gameModeFolder, setGameModeFolder] = useState(null); 
  const [gameLaunchedFromStudy, setGameLaunchedFromStudy] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(null); // Stores folder for which games modal is open
  const [showAnamnesisNemesisLanding, setShowAnamnesisNemesisLanding] = useState(false);
  const [mostRecentScore, setMostRecentScore] = useState(null);


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
    try {
      const storedFolders = localStorage.getItem('flashfonic-folders');
      if (storedFolders) {
        const parsedFolders = JSON.parse(storedFolders);
        const convertFolderStructure = (oldFolders) => {
          const newFolders = {};
          for (const key in oldFolders) {
            const folder = oldFolders[key];
            let newFolder;
            if (Array.isArray(folder)) {
              const folderId = generateUUID();
              newFolder = {
                id: folderId,
                name: key,
                createdAt: Date.now(),
                lastViewed: Date.now(),
                cards: folder,
                subfolders: {}
              };
            } else {
              newFolder = { ...folder };
              if (!newFolder.id) newFolder.id = generateUUID();
              if (!newFolder.createdAt) newFolder.createdAt = Date.now();
              if (!newFolder.lastViewed) newFolder.lastViewed = Date.now();
              if (!newFolder.cards) newFolder.cards = [];
              if (!newFolder.subfolders) newFolder.subfolders = {};
              if (newFolder.flashNotes === undefined) newFolder.flashNotes = null;
              if (newFolder.leaderboard === undefined) newFolder.leaderboard = [];
              newFolder.subfolders = convertFolderStructure(newFolder.subfolders);
            }
            newFolders[newFolder.id] = newFolder;
          }
          return newFolders;
        };
        setFolders(convertFolderStructure(parsedFolders));
      }
    } catch (error) {
      console.error("Error loading folders from local storage:", error);
      // Fallback to empty folders if loading fails
      setFolders({});
      setNotification("Error loading saved data. Starting fresh.");
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
            setNotification("Audio is ready! You can now flash it!");
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

  const findFolderById = (foldersObj, folderId) => {
    for (const id in foldersObj) {
      if (foldersObj[id].id === folderId) return foldersObj[id];  
      const foundInSub = findFolderById(foldersObj[id].subfolders, folderId);
      if (foundInSub) return foundInSub;
    }
    return null;
  };

  const updateFolderById = (foldersObj, folderId, updateFn) => {
    const newFolders = { ...foldersObj };
    for (const id in newFolders) {
      if (newFolders[id].id === folderId) {
        newFolders[id] = updateFn(newFolders[id]);
        return newFolders;
      }
      const updatedSubfolders = updateFolderById(newFolders[id].subfolders, folderId, updateFn);
      if (updatedSubfolders !== newFolders[id].subfolders) {
        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
        return newFolders;
      }
    }
    return foldersObj;
  };

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

  const handleCreateFolder = (folderName) => {
    const folderExists = Object.values(folders).some(folder => folder.name === folderName);
    if (folderExists) {
      setNotification("A folder with this name already exists.");
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
          subfolders: {},
          flashNotes: null,
          leaderboard: []
        }
      }));
    }
    setModalConfig(null);
  };

  const handleAddSubfolder = (parentFolderId, subfolderName) => {
    setFolders(prev => updateFolderById(prev, parentFolderId, (parentFolder) => {
      const subfolderExists = Object.values(parentFolder.subfolders).some(sf => sf.name === subfolderName);
      if (subfolderExists) {
        setNotification("A subfolder with this name already exists in this folder.");
        return parentFolder;
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
            subfolders: {},
            flashNotes: null,
            leaderboard: []
          }
        }
      };
    }));
    setModalConfig(null);
  };

  const handleRenameFolder = (folderId, newName) => {
    setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
      ...folder,
      name: newName
    })));
    setModalConfig(null);
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prev => {
      const deletedFolder = findFolderById(prev, folderId);  
      const updatedFolders = deleteFolderById(prev, folderId);

      setExpandedFolderIds(currentExpandedIds => {
        const newSet = new Set(currentExpandedIds);
        newSet.delete(folderId);
        const removeSubfolderIds = (currentFolder) => {
          for (const subId in currentFolder.subfolders) {
            newSet.delete(subId);
            removeSubfolderIds(currentFolder.subfolders[subId]);
          }
        };
        if (deletedFolder) {
          removeSubfolderIds(deletedFolder);
        }
        return newSet;
      });
      return updatedFolders;
    });
    setModalConfig(null);
  };

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

  const startMove = (card, folderId) => {
    setMovingCard({ id: card.id, folderId });
    setEditingCard(null);
  };

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

        if (!cardToMove) return prevFolders;

        return updateFolderById(newFolders, destinationFolderId, (folder) => ({
          ...folder,
          cards: [...folder.cards, cardToMove]
        }));
    });
    setMovingCard(null);
  };

  const exportFolderToPDF = (folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
      setNotification("Folder not found or contains no cards for export.");  
      return;
    }

    setStudyingFolder(null);  
    setIsFeedbackModalOpen(false);

    setTimeout(() => {
      setPromptModalConfig({
        title: 'Export to PDF',
        message: 'How many flashcards per page? (6, 8, or 10)',
        defaultValue: '8',
        onConfirm: (value) => {
          const cardsPerPage = parseInt(value, 10);
          if (![6, 8, 10].includes(cardsPerPage)) {
            setNotification("Invalid number. Please choose 6, 8, or 10.");  
            return;
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
              doc.setTextColor(139, 92, 246);
              doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.setTextColor(31, 41, 55);
              doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });
          };

          let currentPageIndex = 0;
          while (currentPageIndex < cards.length) {
            const pageCards = cards.slice(currentPageIndex, currentPageIndex + cardsPerPage);
            
            if (currentPageIndex > 0) doc.addPage();
            drawHeader();
            pageCards.forEach((card, index) => {
              const row = Math.floor(index / config.cols);
              const col = index % config.cols;
              const cardX = margin + (col * (cardW + margin));
              const cardY = 40 + (row * (cardH + margin));
              doc.setLineWidth(0.5);
              doc.setDrawColor(0);
              doc.setTextColor(0, 0, 0);
              doc.rect(cardX, cardY, cardW, cardH);
              doc.setFontSize(config.fontSize);
              const text = doc.splitTextToSize(`Q: ${card.question}`, cardW - 10);
              const textY = cardY + (cardH / 2) - ((text.length * config.fontSize) / 3.5);
              doc.text(text, cardX + cardW / 2, textY, { align: 'center' });
            });

            if (pageCards.length > 0) {
              doc.addPage();
              drawHeader();
              pageCards.forEach((card, index) => {
                const row = Math.floor(index / config.cols);
                const col = index % config.cols;
                const cardX = margin + (col * (cardW + margin));
                const cardY = 40 + (row * (cardH + margin));
                doc.setLineWidth(0.5);
                doc.setDrawColor(0);
                doc.setTextColor(0, 0, 0);
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
          setPromptModalConfig(null);
        },
        onClose: () => {
          setPromptModalConfig(null);
        }
      });
    }, 0);
  };
  
  const exportFolderToCSV = (folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
      setNotification("Folder not found or contains no cards for export.");  
      return;
    }

    setStudyingFolder(null);  
    setIsFeedbackModalOpen(false);

    setTimeout(() => {
      setPromptModalConfig({
        title: 'Export to CSV',
        message: 'How many flashcards do you want to export?',
        defaultValue: folder.cards.length.toString(),
        onConfirm: (value) => {
          const numCards = parseInt(value, 10);
          if (isNaN(numCards) || numCards <= 0 || numCards > folder.cards.length) {
              setNotification(`Invalid number. Please enter a number between 1 and ${folder.cards.length}.`);  
              return;
          }
          const cardsToExport = folder.cards.slice(0, numCards);
          
          let csvContent = "FlashFonic\nListen. Flash it. Learn.\n\n";
          csvContent += "Question,Answer\n";
          cardsToExport.forEach(card => {
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
          URL.revokeObjectURL(link.href);
          setNotification(`Exported ${numCards} cards to ${folder.name}-flashcards.csv`);
          setPromptModalConfig(null);
        },
        onClose: () => {
          setPromptModalConfig(null);
        }
      });
    }, 0);
  };

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
    if (movingCard && movingCard.id === card.id) {
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
          <button onClick={() => startEditing(card, source, folderId)} className="edit-btn">Edit</button>
        </div>
        <p><strong>Q:</strong> <SmilesRenderer text={card.question} /></p>
        <p><strong>A:</strong> <SmilesRenderer text={card.answer} /></p>
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const countCardsRecursive = (folder) => {
    let count = folder.cards.length;
    for (const subfolderId in folder.subfolders) {
      count += countCardsRecursive(folder.subfolders[subfolderId]);
    }
    return count;
  };

  const getSortedFolders = (folderObj) => {
    const folderArray = Object.values(folderObj);
    return folderArray.sort((a, b) => {
      if (folderSortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (folderSortBy === 'dateCreated') {
        return a.createdAt - b.createdAt;
      } else if (folderSortBy === 'lastViewed') {
        return b.lastViewed - a.lastViewed;
      }
      return 0;
    });
  };

  const handleFolderDragStart = (e, folderId) => {
    e.dataTransfer.setData("folderId", folderId);
    setDraggedFolderId(folderId);
  };

  const handleFolderDragOver = (e) => {
    e.preventDefault();
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
      if (!draggedItem) return prevFolders;

      const insertIntoTarget = (currentFolders, targetId, itemToInsert) => {
        const newFolders = { ...currentFolders };
        for (const id in newFolders) {
          if (newFolders[id].id === targetId) {
            const orderedKeys = Object.keys(newFolders);
            const targetIndex = orderedKeys.indexOf(targetId);
            orderedKeys.splice(targetIndex + 1, 0, itemToInsert.id);
            const reordered = {};
            orderedKeys.forEach(key => {
              reordered[key] = newFolders[key] || itemToInsert;
            });
            return reordered;
          }
          const updatedSubfolders = insertIntoTarget(newFolders[id].subfolders, targetId, itemToInsert);
          if (updatedSubfolders !== newFolders[id].subfolders) {
            newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
            return newFolders;
          }
        }
        return { ...currentFolders, [itemToInsert.id]: itemToInsert };
      };

      return insertIntoTarget(updatedSourceParentFolders, targetId, draggedItem);
    });
    setDraggedFolderId(null);
  };

  const handleFolderDragEnd = () => {
    setDraggedFolderId(null);
  };

  const handleFolderToggle = (folderId, isOpen) => {
    console.log(`Toggling folder: ${folderId}, isOpen: ${isOpen}`);
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

  const handleSelectedCardInExpandedFolder = (cardId) => {
    setSelectedCardsInExpandedFolder(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleMoveSelectedCardsFromExpandedFolder = (sourceFolderId, destinationFolderId) => {
    if (!sourceFolderId || !destinationFolderId) {
      setNotification("Please select a destination folder.");
      return;
    }

    const cardsToMove = folders[sourceFolderId].cards.filter(card => selectedCardsInExpandedFolder[card.id]);
    if (cardsToMove.length === 0) {
      setNotification("Please check the cards to move.");
      return;
    }

    setFolders(prev => {
      let newFolders = { ...prev };
      newFolders = updateFolderById(newFolders, sourceFolderId, (folder) => ({
        ...folder,
        cards: folder.cards.filter(card => !selectedCardsInExpandedFolder[card.id])
      }));
      newFolders = updateFolderById(newFolders, destinationFolderId, (folder) => ({
        ...folder,
        cards: [...folder.cards, ...cardsToMove]
      }));
      return newFolders;
    });
    setSelectedCardsInExpandedFolder({});
    setNotification(`${cardsToMove.length} card(s) moved to ${findFolderById(folders, destinationFolderId)?.name}.`);
  };

  const handleCardInFolderDragStart = (e, cardId, folderId) => {
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceFolderId", folderId);
  };

  const handleCardInFolderDrop = (e, targetCardId, targetFolderId) => {
    e.preventDefault();
    const sourceCardId = e.dataTransfer.getData("cardId");
    const sourceFolderId = e.dataTransfer.getData("sourceFolderId");

    if (sourceFolderId !== targetFolderId) {
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

  const handleStudySessionEnd = (updatedDeck) => {
    if (studyingFolder && updatedDeck) {
      setFolders(prev => updateFolderById(prev, studyingFolder.id, (folder) => ({
        ...folder,
        cards: updatedDeck
      })));
    }
    setStudyingFolder(null);
  };

  const handleGameEnd = (folderId, finalScore, playerName, levelName) => {
    const newScoreEntry = { 
        id: Date.now(), // Unique ID for highlighting
        name: playerName, 
        score: finalScore, 
        date: Date.now(), 
        level: levelName 
    };

    setFolders(prev => updateFolderById(prev, folderId, folder => {
        const newLeaderboard = [...(folder.leaderboard || []), newScoreEntry];
        newLeaderboard.sort((a, b) => b.score - a.score || b.date - a.date);
        return { ...folder, leaderboard: newLeaderboard.slice(0, 10) };
    }));
    
    setMostRecentScore(newScoreEntry);
  };

  const handlePlayGame = (folder) => {
    setMostRecentScore(null); // Clear previous highlight when starting a new game
    setGameModeFolder({ ...folder }); 
    setGameLaunchedFromStudy(false);
  };

  const handleLaunchAnamnesisNemesis = (folder) => {
    setMostRecentScore(null); // Clear previous highlight
    setShowAnamnesisNemesisLanding(true);
    setShowGamesModal(null);
    setGameModeFolder({ ...folder }); 
  };

  const handleStartAnamnesisNemesisGame = () => {
    setShowAnamnesisNemesisLanding(false);
    setNotification("Anamnesis Nemesis game started! (Placeholder)");
  };

  const FolderItem = ({ folder, level = 0, allFoldersForMoveDropdown, onPlayGame }) => {
    const isExpanded = expandedFolderIds.has(folder.id);  
    const paddingLeft = level * 20;

    return (
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
        <div className="folder-summary-custom" onClick={(e) => {
          e.stopPropagation();
          handleFolderToggle(folder.id, !isExpanded);
        }}>  
          <div className="folder-item-header">
            <span className="folder-name-display">
              <span className={`folder-toggle-arrow ${isExpanded ? 'rotated' : ''}`}>▶</span>
              {level > 0 && <span className="folder-icon">📁</span>}
              {folder.name}
              <span className="card-count-display"> ({countCardsRecursive(folder)} cards)</span>
            </span>
            <div className="folder-actions-right">
              {!isExpanded && (
                <button onClick={(e) => { 
                  e.stopPropagation(); 
                  setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards }); 
                  setModalConfig(null);
                  setIsFeedbackModalOpen(false);
                }} className="study-btn-small">Study</button>
              )}
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="folder-expanded-content">
            <div className="folder-expanded-header">
              <h3 className="folder-expanded-name">{folder.name}</h3>
              <div className="folder-main-actions">
                <button onClick={() => { 
                  if (isListening) stopListening(); 
                  setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards }); 
                  setModalConfig(null);
                  setIsFeedbackModalOpen(false);
                }} className="study-btn-large">Study</button>
                <button onClick={() => setFlashNotesActionModal(folder)} className="flash-notes-btn">Flash Notes</button>
                <button onClick={() => setShowGamesModal(folder)} className="game-button-in-folder">Games</button>
              </div>
              <div className="folder-expanded-actions">
                <ActionsDropdown 
                  folder={folder}
                  exportPdf={exportFolderToPDF} 
                  exportCsv={exportFolderToCSV} 
                  onAddSubfolder={(id) => {
                    setModalConfig({ type: 'createFolder', title: 'Add Subfolder', onConfirm: (name) => handleAddSubfolder(id, name) });
                    setStudyingFolder(null);
                    setIsFeedbackModalOpen(false);
                  }}
                  onRenameFolder={(id, name) => {
                    setModalConfig({ type: 'prompt', title: 'Rename Folder', message: 'Enter new name for folder:', defaultValue: name, onConfirm: (newName) => handleRenameFolder(id, newName) });
                    setStudyingFolder(null);
                    setIsFeedbackModalOpen(false);
                  }}
                  onDeleteFolder={(id) => {
                    setModalConfig({ type: 'confirm', message: `Are you sure you want to delete "${findFolderById(folders, id)?.name}"? This will also delete all subfolders and cards within it.`, onConfirm: () => handleDeleteFolder(id) });
                    setStudyingFolder(null);
                    setIsFeedbackModalOpen(false);
                  }}
                />
              </div>
            </div>
            {Object.values(folder.subfolders).length > 0 && (
              <div className="subfolder-list">
                {getSortedFolders(folder.subfolders).map(subfolder => (
                  <FolderItem 
                    key={subfolder.id} 
                    folder={subfolder} 
                    level={level + 1} 
                    allFoldersForMoveDropdown={allFoldersForMoveDropdown} 
                    onPlayGame={onPlayGame}
                  />
                ))}
              </div>
            )}
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
                {allFoldersForMoveDropdown.filter(f => f.id !== folder.id).map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
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

  const getAllFoldersFlat = (foldersObj) => {
    let flatList = [];
    for (const id in foldersObj) {
      flatList.push(foldersObj[id]);
      flatList = flatList.concat(getAllFoldersFlat(foldersObj[id].subfolders));
    }
    return flatList;
  };
  const allFoldersForMoveDropdown = getAllFoldersFlat(folders);

  const handleGenerateNotes = async (folder, action, forceRegenerate = false) => {
    setFlashNotesActionModal(null);
    
    if (folder.flashNotes && !forceRegenerate) {
      if (action === 'view') {
        setFlashNotesContent({ folderName: folder.name, notes: folder.flashNotes });
        setShowFlashNotesViewer(true);
      } else if (action === 'export') {
        exportNotesToPDF(folder.name, folder.flashNotes);
      }
      return;
    }

    setIsGeneratingNotes(true);
    setNotification('Synthesizing your Flash Notes with AI...');
    try {
      const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: folder.cards }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate notes.');
      }

      setFolders(prev => updateFolderById(prev, folder.id, f => ({ ...f, flashNotes: data.notes })));
      
      if (action === 'view') {
        setFlashNotesContent({ folderName: folder.name, notes: data.notes });
        setShowFlashNotesViewer(true);
      } else if (action === 'export') {
        exportNotesToPDF(folder.name, data.notes);
      }
      setNotification('Flash Notes generated!');
    } catch (error) {
      console.error("Error generating notes:", error);
      setNotification(`Error: ${error.message}`);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const exportNotesToPDF = (folderName, notes) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageW - (margin * 2);
    let currentY = 55;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(139, 92, 246);
    doc.text("FLASHFONIC", pageW / 2, 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text("Listen. Flash it. Learn.", pageW / 2, 30, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text(`Flash Notes: ${folderName}`, pageW / 2, 45, { align: 'center' });

    const checkPageBreak = (heightNeeded) => {
      if (currentY + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        currentY = margin;
      }
    };

    const tokens = marked.lexer(notes);

    tokens.forEach(token => {
      if (token.type === 'heading') {
        checkPageBreak(15);  
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const headingText = doc.splitTextToSize(token.text, maxWidth);
        doc.text(headingText, margin, currentY);
        currentY += (headingText.length * 5) + 4;
      }
      if (token.type === 'list') {
        token.items.forEach(item => {
          checkPageBreak(10);  
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const itemText = doc.splitTextToSize(`• ${item.text}`, maxWidth - 5);
          doc.text(itemText, margin + 5, currentY);
          currentY += (itemText.length * 4) + 2;
        });
      }
       if (token.type === 'paragraph') {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const pText = doc.splitTextToSize(token.text, maxWidth);
        doc.text(pText, margin, currentY);
        currentY += (pText.length * 4) + 2;
      }
      if (token.type === 'space') {
        currentY += 5;
      }
    });

    doc.save(`${folderName}-FlashNotes.pdf`);
  };


  return (
    <>
      {/* Conditional rendering for FlashcardViewer (Study Mode) */}
      {studyingFolder && (
        <FlashcardViewer
          key={studyingFolder.id}
          folder={studyingFolder}
          onClose={handleStudySessionEnd}
          onLaunchGame={(folder) => {
            setStudyingFolder(null);
            handlePlayGame(folder);
          }}
          onLaunchAnamnesisNemesis={(folder) => {
            setStudyingFolder(null);
            handleLaunchAnamnesisNemesis(folder);
          }}
        />
      )}

      {/* Conditional rendering for GameViewer (Verbatim Master AI) */}
      {gameModeFolder && !showAnamnesisNemesisLanding && (
        <GameViewer
          key={gameModeFolder.id}
          folder={gameModeFolder}
          onClose={handleGameEnd}
          onBackToStudy={(folder) => {
            setGameModeFolder(null);
            setStudyingFolder(folder);
          }}
          onExitGame={() => setGameModeFolder(null)}
          cameFromStudy={gameLaunchedFromStudy}
          mostRecentScore={mostRecentScore}
        />
      )}

      {/* Conditional rendering for Anamnesis Nemesis Landing Page */}
      {showAnamnesisNemesisLanding && gameModeFolder && (
        <AnamnesisNemesisLandingPage
          onClose={() => {setShowAnamnesisNemesisLanding(false); setShowGamesModal(gameModeFolder);}} // Back to games modal
          onStartGame={handleStartAnamnesisNemesisGame}
        />
      )}

      {/* Modals */}
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
      
      {/* Flash Notes Modals/Viewers */}
      {flashNotesActionModal && (
        <FlashNotesActionModal
          folder={flashNotesActionModal}
          onClose={() => setFlashNotesActionModal(null)}
          onGenerate={handleGenerateNotes}
          isGenerating={isGeneratingNotes}
        />
      )}
      {showFlashNotesViewer && flashNotesContent && (
        <FlashNotesViewer
          folderName={flashNotesContent.folderName}
          notes={flashNotesContent.notes}
          onClose={() => setShowFlashNotesViewer(false)}
        />
      )}

      {/* Games Modal */}
      {showGamesModal && (
        <GamesModal
          folder={showGamesModal}
          onClose={() => setShowGamesModal(null)}
          onLaunchGame={(folder) => {
            setShowGamesModal(null); // Close games modal
            handlePlayGame(folder); // Use the handler to also clear recent score
          }}
          onLaunchAnamnesisNemesis={handleLaunchAnamnesisNemesis}
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
            setStudyingFolder(null);
            setIsFeedbackModalOpen(false);
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
              onPlayGame={handlePlayGame}
            />
          )) : <p className="subtle-text">No folders created yet.</p>}
        </div>
      </div>
      <div className="app-footer">
        <button className="feedback-btn" onClick={() => {
          setIsFeedbackModalOpen(true);
          setStudyingFolder(null);
          setModalConfig(null);
        }}>Send Feedback</button>
      </div>
    </>
  );
};

// --- Top-Level App Component ---
const App = () => {
    // FIX: Use a state that is not initialized from localStorage to ensure landing page shows on first visit.
    const [showApp, setShowApp] = useState(false);

    // This effect runs once when the component mounts to check if the user has been here before.
    useEffect(() => {
        const hasEntered = localStorage.getItem('flashfonic-entered');
        if (hasEntered) {
            setShowApp(true);
        }
    }, []); // Empty dependency array ensures this runs only once.

    const handleEnter = () => {
        // Once the user enters, save this to local storage and show the app
        localStorage.setItem('flashfonic-entered', 'true');
        setShowApp(true);
    };

    if (!showApp) {
        return <LandingPage onEnter={handleEnter} />;
    }

    return (
        <div className="main-app-container">
            <MainApp />
            <Analytics />
        </div>
    );
};

export default App;

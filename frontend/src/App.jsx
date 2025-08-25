import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// These imports are now handled directly in this file for reliability.
import jsPDF from 'jspdf';
import { marked } from 'marked';
// import { Analytics } from '@vercel/analytics/react';
import * as Tone from 'tone';
import './App.css';



// --- EULA and Privacy Policy Content (Embedded as String Constants) ---
const eulaContent = `
# FlashFonic End-User License Agreement (EULA)

**Last Updated:** August 6, 2025

---

This End-User License Agreement ("Agreement") is a binding legal agreement between you ("User" or "You") and FlashFonic ("Company," "We," "Us," or "Our") governing your use of the FlashFonic application and its associated services (collectively, the "Application").

**BY ACCESSING, DOWNLOADING, INSTALLING, OR USING THE APPLICATION, YOU AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ACCESS, DOWNLOAD, INSTALL, OR USE THE APPLICATION.**

---

### 1. Grant of License

Subject to the terms and conditions of this Agreement, FlashFonic grants You a limited, non-exclusive, non-transferable, revocable license to use the Application for your personal, non-commercial study and learning purposes.

---

### 2. User Data and Privacy (Camera, Microphone, and AI Use)

FlashFonic is designed to enhance your learning experience through the use of your device's microphone and camera, and advanced Artificial Intelligence (AI).

* **Microphone Use (FlashFonic Mode):** When you activate features such as "Start Listening," "Voice Activate," or "Auto-Flash," the Application accesses your device's microphone to capture audio input. This audio is transmitted to our AI backend for real-time transcription and the generation of flashcards and summary notes. **Raw audio recordings are processed transiently and are not stored long-term on our servers.**
* **Camera Use (FlashFoto Mode):** When you utilize the FlashFoto feature, the Application accesses your device's camera to capture images. These images are transmitted to our AI backend for text extraction (Optical Character Recognition) and subsequent flashcard generation. **Raw image data is processed transiently and is not stored long-term on our servers.**
* **Consent:** Your use of the microphone and camera features within the Application constitutes your express consent for FlashFonic to access and process your audio and image data solely for the purposes described herein. You may manage or revoke these permissions at any time through your device's operating system settings.
* **AI Processing:** The AI models utilized by FlashFonic process your input (transcribed audio, extracted text from images) to generate new content (flashcards, notes). While we strive for accuracy, AI-generated content may contain **inaccuracies, errors, or unintended biases**. FlashFonic is a supplementary study tool, and **You are solely responsible for verifying the correctness and completeness of all AI-generated content.**
* **Data Privacy:** We are committed to protecting your privacy. All data collected and processed by FlashFonic, including audio, image, and text inputs, is handled in accordance with our Privacy Policy. Data is used exclusively for the operation and improvement of the Application's core functionalities and is not shared with third parties for marketing or other unrelated purposes.

---

### 3. Restrictions on Use

You agree not to, and will not permit others to:
* Use the Application for any purpose other than personal, non-commercial study and learning.
* Copy, modify, adapt, translate, or otherwise create derivative works of the Application.
* Decompile, reverse engineer, disassemble, or attempt to derive the source code of the Application.
* Distribute, license, lease, sell, resell, transfer, or otherwise commercially exploit the Application.
* Remove, alter, or obscure any copyright, trademark, or other proprietary notices on the Application.
* Use the Application in any manner that could damage, disable, overburden, or impair our servers or networks.
* Use the Application to generate, store, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.

---

### 4. Intellectual Property

* **FlashFonic Ownership:** The Application, including all its content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by FlashFonic, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
* **User Content:** You retain all rights to the original content you input into the Application. However, by submitting content, you grant FlashFonic a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content solely for the purpose of operating and improving the Application and its services.
* **AI Originality:** While AI generates new content, it does so based on patterns learned from vast datasets. It is possible for AI-generated text to inadvertently resemble existing copyrighted material. **You are solely responsible for ensuring that any content you create or disseminate using the Application does not infringe upon third-party copyrights, trademarks, or other intellectual property rights.**

---

### 5. Reporting Unauthorized Use or Plagiarism

FlashFonic is committed to respecting intellectual property rights and promoting academic integrity.

* **Reporting Procedure:** If you believe that content generated by FlashFonic, or content used by another user within the Application, constitutes **unauthorized use of copyrighted material or accidental plagiarism**, please report it immediately.
    * You can use the **"Send Feedback" button** within the Application.
    * Alternatively, you may send an email directly to **feedbackflashfonic@gmail.com**.
* **Required Information:** To facilitate a prompt investigation, please provide as much detail as possible, including:
    * A clear description of the alleged infringement or plagiarism.
    * Identification of the specific content within FlashFonic in question.
    * Identification of the copyrighted work or original source material that you believe has been infringed or plagiarized.
    * Any supporting evidence (e.g., links to original material, screenshots).
    * Your contact information.
* **Our Action:** Upon receiving a valid report, FlashFonic will investigate the claim promptly. Appropriate action may include, but is not limited to, removing the infringing content, issuing warnings, or, in severe or repeated cases, suspending or terminating the account of the offending user.

---

### 6. Disclaimer of Warranties

THE APPLICATION IS PROVIDED TO YOU "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FLASHFONIC, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND THEIR RESPECTIVE LICENSORS AND SERVICE PROVIDERS, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE APPLICATION, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE, OR TRADE PRACTICE. WITHOUT LIMITATION TO THE FOREGOING, FLASHFONIC PROVIDES NO WARRANTY OR UNDERTAKING, AND MAKES NO REPRESENTATION OF ANY KIND THAT THE APPLICATION WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY INTENDED RESULTS, BE COMPATIBLE OR WORK WITH ANY OTHER SOFTWARE, APPLICATIONS, SYSTEMS, OR SERVICES, OPERATE WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS, BE ERROR-FREE, OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE CORRECTED.

---

### 7. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FLASHFONIC OR ITS AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE APPLICATION; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE APPLICATION; (III) ANY CONTENT OBTAINED FROM THE APPLICATION; AND (IV) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.

---

### 8. Indemnification

You agree to indemnify, defend, and hold harmless Trifecta Pro LLC, FlashFonic, its affiliates, licensors, and service providers, Application Programming Interface (API) providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of this Agreement or your use of the Application, including, but not limited to, your User Content, any use of the Application's content, services, and products other than as expressly authorized in this Agreement, or your use of any information obtained from the Application.

---

### 9. Governing Law

This Agreement and your use of the Application shall be governed by and construed in accordance with the laws of the State of Vermont, United States, without regard to its conflict of law principles.

---

### 10. Changes to This Agreement

We reserve the right, at our sole discretion, to modify or replace this Agreement at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Application after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Application.

---

### 11. Contact Information

For any questions regarding this Agreement, or to report any issues as described in Section 5, please contact us at:

**Email:** feedbackflashfonic@gmail.com

---

Thank you for choosing FlashFonic. We hope you find it a valuable tool for your learning journey.
`;

const privacyPolicyContent = `
# FlashFonic Privacy Policy

**Last Updated:** August 6, 2025

---

This Privacy Policy describes how FlashFonic ("Company," "We," "Us," or "Our") collects, uses, and discloses information about you when you access and use the FlashFonic application and its associated services (collectively, the "Application").

**BY USING THE APPLICATION, YOU AGREE TO THE COLLECTION AND USE OF INFORMATION IN ACCORDANCE WITH THIS PRIVACY POLICY.**

---

### 1. Information We Collect

We collect various types of information to provide and improve our Application and services.

* **1.1. Information You Directly Provide:**
    * **Contact Information:** If you choose to provide feedback or contact us directly (e.g., via the "Send Feedback" button or email), you may provide your email address and any information you choose to include in your message.
    * **User-Generated Content (Saved):** Any flashcards, folders, or notes that you explicitly save within the Application are stored locally on your device. This data is not automatically transmitted to our servers unless you explicitly use a feature that requires server-side processing (e.g., AI generation, as detailed below).

* **1.2. Information Automatically Collected During Use:**
    * **Audio Data (FlashFonic Mode):** When you enable microphone features ("Start Listening," "Voice Activate," "Auto-Flash"), audio input from your device's microphone is captured and **transiently transmitted** to our third-party AI service providers (e.g., AssemblyAI) for real-time transcription. **Raw audio recordings are processed solely for transcription and are not stored long-term on our servers or by our primary AI service providers.**
* **Camera Use (FlashFoto Mode):** When you utilize the FlashFoto feature, the Application accesses your device's camera to capture images. These images are transmitted to our AI backend for text extraction (Optical Character Recognition) and subsequent flashcard generation. **Raw image data is processed transiently and is not stored long-term on our servers.**
* **Consent:** Your use of the microphone and camera features within the Application constitutes your express consent for FlashFonic to access and process your audio and image data solely for the purposes described herein. You may manage or revoke these permissions at any time through your device's operating system settings.
* **AI Processing:** The AI models utilized by FlashFonic process your input (transcribed audio, extracted text from images) to generate new content (flashcards, notes). While we strive for accuracy, AI-generated content may contain **inaccuracies, errors, or unintended biases**. FlashFonic is a supplementary study tool, and **You are solely responsible for verifying the correctness and completeness of all AI-generated content.**
* **Data Privacy:** We are committed to protecting your privacy. All data collected and processed by FlashFonic, including audio, image, and text inputs, is handled in accordance with our Privacy Policy. Data is used exclusively for the operation and improvement of the Application's core functionalities and is not shared with third parties for marketing or other unrelated purposes.

---

### 3. Restrictions on Use

You agree not to, and will not permit others to:
* Use the Application for any purpose other than personal, non-commercial study and learning.
* Copy, modify, adapt, translate, or otherwise create derivative works of the Application.
* Decompile, reverse engineer, disassemble, or attempt to derive the source code of the Application.
* Distribute, license, lease, sell, resell, transfer, or otherwise commercially exploit the Application.
* Remove, alter, or obscure any copyright, trademark, or other proprietary notices on the Application.
* Use the Application in any manner that could damage, disable, overburden, or impair our servers or networks.
* Use the Application to generate, store, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.

---

### 4. Intellectual Property

* **FlashFonic Ownership:** The Application, including all its content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by FlashFonic, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
* **User Content:** You retain all rights to the original content you input into the Application. However, by submitting content, you grant FlashFonic a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content solely for the purpose of operating and improving the Application and its services.
* **AI Originality:** While AI generates new content, it does so based on patterns learned from vast datasets. It is possible for AI-generated text to inadvertently resemble existing copyrighted material. **You are solely responsible for ensuring that any content you create or disseminate using the Application does not infringe upon third-party copyrights, trademarks, or other intellectual property rights.**

---

### 5. Reporting Unauthorized Use or Plagiarism

FlashFonic is committed to respecting intellectual property rights and promoting academic integrity.

* **Reporting Procedure:** If you believe that content generated by FlashFonic, or content used by another user within the Application, constitutes **unauthorized use of copyrighted material or accidental plagiarism**, please report it immediately.
    * You can use the **"Send Feedback" button** within the Application.
    * Alternatively, you may send an email directly to **feedbackflashfonic@gmail.com**.
* **Required Information:** To facilitate a prompt investigation, please provide as much detail as possible, including:
    * A clear description of the alleged infringement or plagiarism.
    * Identification of the specific content within FlashFonic in question.
    * Identification of the copyrighted work or original source material that you believe has been infringed or plagiarized.
    * Any supporting evidence (e.g., links to original material, screenshots).
    * Your contact information.
* **Our Action:** Upon receiving a valid report, FlashFonic will investigate the claim promptly. Appropriate action may include, but is not limited to, removing the infringing content, issuing warnings, or, in severe or repeated cases, suspending or terminating the account of the offending user.

---

### 6. Disclaimer of Warranties

THE APPLICATION IS PROVIDED TO YOU "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FLASHFONIC, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND THEIR RESPECTIVE LICENSORS AND SERVICE PROVIDERS, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE APPLICATION, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE, OR TRADE PRACTICE. WITHOUT LIMITATION TO THE FOREGOING, FLASHFONIC PROVIDES NO WARRANTY OR UNDERTAKING, AND MAKES NO REPRESENTATION OF ANY KIND THAT THE APPLICATION WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY INTENDED RESULTS, BE COMPATIBLE OR WORK WITH ANY OTHER SOFTWARE, APPLICATIONS, SYSTEMS, OR SERVICES, OPERATE WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS, BE ERROR-FREE, OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE CORRECTED.

---

### 7. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FLASHFONIC OR ITS AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE APPLICATION; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE APPLICATION; (III) ANY CONTENT OBTAINED FROM THE APPLICATION; AND (IV) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.

---

### 8. Indemnification

You agree to indemnify, defend, and hold harmless Trifecta Pro LLC, FlashFonic, its affiliates, licensors, and service providers, Application Programming Interface (API) providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of this Agreement or your use of the Application, including, but not limited to, your User Content, any use of the Application's content, services, and products other than as expressly authorized in this Agreement, or your use of any information obtained from the Application.

---

### 9. Governing Law

This Agreement and your use of the Application shall be governed by and construed in accordance with the laws of the State of Vermont, United States, without regard to its conflict of law principles.

---

### 10. Changes to This Agreement

We reserve the right, at our sole discretion, to modify or replace this Agreement at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Application after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Application.

---

### 11. Contact Information

For any questions regarding this Agreement, or to report any issues as described in Section 5, please contact us at:

**Email:** feedbackflashfonic@gmail.com

---

Thank you for choosing FlashFonic. We hope you find it a valuable tool for your learning journey.
`;

// --- HELPER FUNCTIONS ---

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

// --- MODAL AND UI COMPONENTS ---

const DocViewer = ({ docType, onClose }) => {
    const content = docType === 'eula' ? eulaContent : privacyPolicyContent;
    const title = docType === 'eula' ? 'End-User License Agreement' : 'Privacy Policy';

    return (
        <div className="viewer-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'left', padding: '2rem', overflowY: 'auto', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                <div className="viewer-header" style={{ marginBottom: '1rem' }}>
                    <h2 className="how-to-play-title" style={{ textAlign: 'center', flexGrow: 1 }}>{title}</h2>
                    <button onClick={onClose} className="viewer-close-btn">&times;</button>
                </div>
                <div className="how-to-play-content" dangerouslySetInnerHTML={{ __html: marked(content) }} />
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onClose} className="modal-create-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const EULAModal = ({ onAccept }) => {
    return (
        <div className="viewer-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'left', padding: '2rem', overflowY: 'auto', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                <h2 className="how-to-play-title" style={{textAlign: 'center'}}>End-User License Agreement</h2>
                <div className="how-to-play-content" dangerouslySetInnerHTML={{ __html: marked(eulaContent) }} />
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onAccept} className="modal-create-btn">I Agree</button>
                </div>
            </div>
        </div>
    );
};

const FlashFonicModeModal = ({ onSelect, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Choose Capture Mode</h2>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => onSelect('live')} className="modal-create-btn">🔴 Live Capture</button>
                <button onClick={() => onSelect('upload')} className="modal-create-btn">⬆️ Audio/Video File Upload</button>
            </div>
        </div>
    </div>
);

const ImageSourceModal = ({ onSelect, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Select Image Source</h2>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => onSelect('camera')} className="modal-create-btn">📷 Snap Photo Using Camera</button>
                <button onClick={() => onSelect('upload')} className="modal-create-btn">🖼️ Upload from Device</button>
            </div>
        </div>
    </div>
);


const LandingPage = ({ onEnter }) => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-logo">FlashFonic</div>
                <button onClick={onEnter} className="nav-cta">Enter Beta</button>
            </nav>

            <header className="landing-hero">
                <h1 className="landing-h1">The Future of Studying is Here.</h1>
                <p className="landing-p">
                    Introducing <span className="brand-bling">FlashFonic</span>, the world's first AI-powered learning companion that transforms your study materials into dynamic flashcards, organized notes, and engaging games.
                </p>
                <button onClick={onEnter} className="landing-cta">Start Flashing!</button>
            </header>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>CAPTURE</h3>
                        <p>Record live audio, upload a file, or snap a photo of your notes.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>AI GENERATE</h3>
                        <p>Our intelligent AI instantly creates Q&A flashcards or comprehensive notes.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>MASTER</h3>
                        <p>Solidify your knowledge with advanced study tools and fun, interactive games.</p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Unleash Your Learning Superpowers.</h2>
                <div className="features-grid">
                    <div className="feature-card" style={{ border: '1px solid #EC4899', boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)' }}>
                        <h3>📸 FlashFoto: Snap & Learn Instantly</h3>
                        <p>Transform your personal notes, diagrams, or whiteboard images\* into interactive flashcards. Just snap a photo, and our AI does the rest, extracting key information to create ready-to-study content.</p>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-dark)' }}>\*with permission</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #8B5CF6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
                        <h3>📝 FlashNotes: Your Personal AI Study Guide</h3>
                        <p>Turn your entire flashcard deck into a coherent, organized study guide with one click. FlashNotes synthesizes your Q&A pairs into comprehensive, markdown-formatted summaries, perfect for review sessions.</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #10B981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
                        <h3>🏆 Verbatim Master: Game Your Way to Recall</h3>
                        <p>Challenge your memory with our interactive recall game. Listen to questions and speak your answers aloud. Our AI scores your precision, helping you achieve true mastery and solidify long-term retention.</p>
                    </div>
                    <div className="feature-card" style={{ border: '1px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)' }}>
                        <h3>✨ Smart Organization & Seamless Export</h3>
                        <p>Effortlessly manage your knowledge with intuitive folders and subfolders. Export your custom flashcards to PDF or CSV, or your FlashNotes to PDF, for offline study and sharing. Your learning, your way.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <h2>Ready to experience the future of studying?</h2>
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
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
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
    const handleSubmit = (e) => {
        e.preventDefault();
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

const FeedbackModal = ({ onClose }) => {
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
                <form className="feedback-form" onSubmit={handleSubmit} action="https://formspree.io/f/mvgqzvvb" method="POST">
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
                    <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
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
                <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button onClick={onClose} className="modal-create-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

const ActionsDropdown = ({ folder, onRenameFolder, onAddSubfolder, onDeleteFolder, exportPdf, exportCsv }) => {
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

    const handleActionClick = (e, actionFn) => {
        e.stopPropagation();
        actionFn();
        setIsOpen(false);
    };

    return (
        <div className="actions-dropdown-container" ref={menuRef}>
            <button className="actions-tab" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>Actions</button>
            {isOpen && (
                <div className="actions-dropdown-menu">
                    <button onClick={(e) => handleActionClick(e, () => onAddSubfolder(folder.id))}>Add Subfolder</button>
                    <button onClick={(e) => handleActionClick(e, () => onRenameFolder(folder.id, folder.name))}>Rename Folder</button>
                    <button onClick={(e) => handleActionClick(e, () => onDeleteFolder(folder.id))}>Delete Folder</button>
                    <hr style={{borderTop: '1px solid var(--border-color)', margin: '0.5rem 0'}} />
                    <button onClick={(e) => handleActionClick(e, () => exportPdf(folder.id))}>Export PDF</button>
                    <button onClick={(e) => handleActionClick(e, () => exportCsv(folder.id))}>Export CSV</button>
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

    const speak = useCallback((text, onEnd) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = speechRate;
        utterance.onend = onEnd;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [voices, selectedVoice, speechRate]);

    const stopReading = useCallback(() => {
        setIsReading(false);
        window.speechSynthesis.cancel();
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    }, []);

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
    }, [isReading, currentIndex, studyDeck, speechDelay, currentCard, speak]);

    const handleCardClick = () => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(prev => !prev);
    };

    const goToNext = useCallback(() => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % studyDeck.length);
    }, [studyDeck.length, stopReading]);

    const goToPrev = useCallback(() => {
        if (studyDeck.length === 0) return;
        stopReading();
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + studyDeck.length) % studyDeck.length);
    }, [studyDeck.length, stopReading]);

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

    useEffect(() => { return () => stopReading(); }, [stopReading]);

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
                            {index + 1}. <ContentRenderer content={card.question} />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="study-area-main">
                        {studyDeck.length > 0 ? (
                            <>
                                <div className="viewer-main" onClick={handleCardClick}>
                                    <div className={`viewer-card ${isFlipped ? 'is-flipped' : ''}`}>
                                        <div className="card-face card-front">
                                            <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                                            <p><strong>Q:</strong> <ContentRenderer content={currentCard?.question} /></p>
                                        </div>
                                        <div className="card-face card-back">
                                            <button onClick={(e) => { e.stopPropagation(); toggleFlag(currentCard.id); }} className={`flag-btn ${currentCard?.isFlagged ? 'active' : ''}`}>&#9873;</button>
                                            <p><strong>A:</strong> <ContentRenderer content={currentCard?.answer} reactionSummary={currentCard?.reactionSummary} /></p>
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
                    </div>
                    <div className="study-area-footer">
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
    const [gameState, setGameState] = useState('landing');
    const [userAnswer, setUserAnswer] = useState('');
    const [lastScore, setLastScore] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [playMode, setPlayMode] = useState('continuous');
    
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
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Scoring failed');
            
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
            const timer = setTimeout(() => askQuestion(), 3000); // 3-second countdown
            return () => clearTimeout(timer);
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
            );
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
                                <p className="correct-answer-reveal">Correct Answer: <ContentRenderer content={currentCard.answer} /></p>
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
        );
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
                                <p className="game-question"><strong>Q:</strong> <ContentRenderer content={currentCard?.question} /></p>
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

const ChemicalImage = ({ src, alt }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && <span style={{ fontSize: '0.8em', color: 'var(--text-dark)' }}>Loading Structure...</span>}
            <img
                src={src}
                alt={alt}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    maxWidth: '38%',
                    minWidth: '90px',
                    display: isLoading ? 'none' : 'block'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </>
    );
};

const KatexRenderer = ({ text }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && window.katex) {
            const renderMathInText = (text) => {
                const blockRegex = /\$\$(.*?)\$\$/g;
                const inlineRegex = /\$(.*?)\$/g;

                let html = text.replace(blockRegex, (match, expression) => {
                    try {
                        return window.katex.renderToString(expression, { throwOnError: false, displayMode: true });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match;
                    }
                });

                html = html.replace(inlineRegex, (match, expression) => {
                    if (match.startsWith('$$')) return match;
                    try {
                        return window.katex.renderToString(expression, { throwOnError: false, displayMode: false });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        return match;
                    }
                });
                return html;
            };
            
            containerRef.current.innerHTML = renderMathInText(text);
        }
    }, [text]);

    return <span ref={containerRef} />;
};

const ContentRenderer = ({ content, reactionSummary }) => {
    // --- NEW: Logic to handle the structured full_reaction format ---
    if (typeof content === 'object' && !Array.isArray(content) && content !== null && content.type === 'full_reaction') {
        return (
            <div className="reaction-container">
                {/* Renders the Reactants on the left side */}
                <div className="reaction-side">
                    {content.reactants.map((reactant, index) => (
                        <React.Fragment key={index}>
                            <ContentRenderer content={[reactant]} />
                            {index < content.reactants.length - 1 && <span className="plus-sign">+</span>}
                        </React.Fragment>
                    ))}
                </div>

                {/* Renders the Arrow and the Reagents above it */}
                <div className="reaction-arrow-group">
                    <span className="reagents">{content.reagents.join(', ')}</span>
                    <span className="arrow">→</span>
                </div>

                {/* Renders the Products on the right side */}
                <div className="reaction-side">
                    {content.products.map((product, index) => (
                        <React.Fragment key={index}>
                            <ContentRenderer content={[product]} />
                            {index < content.products.length - 1 && <span className="plus-sign">+</span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }

    // --- Original logic for simple reactions, molecules, and text ---
    if (Array.isArray(content)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {content.map((item, index) => {
                        const chemRegex = /CHEM\[(.*?)\]/;
                        const match = typeof item === 'string' && item.match(chemRegex);
                        if (match) {
                            const chemicalName = encodeURIComponent(match[1]);
                            const imageUrl = `https://cactus.nci.nih.gov/chemical/structure/${chemicalName}/image?format=png&width=300&height=300`;
                            return (
                                <React.Fragment key={index}>
                                    <ChemicalImage src={imageUrl} alt={`Structure of ${match[1]}`} />
                                    {index < content.length - 1 && <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>→</span>}
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
                </div>
                {reactionSummary && (
                    <p style={{ margin: '0.75rem 0 0 0', fontStyle: 'italic', fontSize: '0.85em', maxWidth: '90%' }}>
                        {reactionSummary}
                    </p>
                )}
            </div>
        );
    }
    
    if (typeof content === 'string') {
        const reactionRegex = /SMILES\[(.*?)\]>>SMILES\[(.*?)\]/;
        const reactionMatch = content.match(reactionRegex);
        if (reactionMatch) {
            const reactantSmiles = encodeURIComponent(reactionMatch[1]);
            const productSmiles = encodeURIComponent(reactionMatch[2]);
            const reactantImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${reactantSmiles}/image?format=png&width=400&height=400`;
            const productImageUrl = `https://cactus.nci.nih.gov/chemical/structure/${productSmiles}/image?format=png&width=400&height=400`;
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <ChemicalImage src={reactantImageUrl} alt="Reactant Structure" />
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>→</span>
                    <ChemicalImage src={productImageUrl} alt="Product Structure" />
                </div>
            );
        }
        
        const singleMoleculeRegex = /SMILES\[(.*?)\]/;
        const singleMatch = content.match(singleMoleculeRegex);
        if (singleMatch) {
            const smiles = encodeURIComponent(singleMatch[1]);
            const imageUrl = `https://cactus.nci.nih.gov/chemical/structure/${smiles}/image?format=png&width=500&height=500`;
            return <ChemicalImage src={imageUrl} alt="Chemical Structure" />;
        }
        
        return <KatexRenderer text={content} />;
    }

    return null;
};

// --- REFACTOR FIX: STABLE & CORRECTED COMPONENTS ---
// These components are now defined outside MainApp to prevent re-renders and fix all bugs.

const EditableCardContent = ({ card, onSave, onCancel }) => {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(
        typeof card.answer === 'string' ? card.answer : JSON.stringify(card.answer, null, 2)
    );

    useEffect(() => {
        setQuestion(card.question);
        setAnswer(typeof card.answer === 'string' ? card.answer : JSON.stringify(card.answer, null, 2));
    }, [card]);

    const handleSave = () => {
        let parsedAnswer = answer;
        try {
            if ((answer.startsWith('[') && answer.endsWith(']')) || (answer.startsWith('{') && answer.endsWith('}'))) {
                parsedAnswer = JSON.parse(answer);
            }
        } catch (e) {
            console.warn("Could not parse edited answer as JSON, saving as string.", e);
        }
        onSave({ ...card, question, answer: parsedAnswer });
    };

    return (
        <div className="edit-mode">
            <textarea className="edit-textarea" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <textarea className="edit-textarea" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className="edit-actions">
                <button onClick={handleSave} className="edit-save-btn">Save</button>
                <button onClick={onCancel} className="edit-cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

const FolderItem = ({
    folder,
    level = 0,
    allFoldersForMoveDropdown,
    onPlayGame,
    expandedFolderIds,
    handleFolderToggle,
    handleFolderDragStart,
    handleFolderDragOver,
    handleFolderDrop,
    handleFolderDragEnd,
    getSortedFolders,
    renderCardContent,
    setStudyingFolder,
    setModalConfig,
    setIsFeedbackModalOpen,
    setFlashNotesActionModal,
    setShowGamesModal,
    selectedCardsInExpandedFolder,
    handleSelectedCardInExpandedFolder,
    handleMoveSelectedCardsFromExpandedFolder,
    handleCardInFolderDragStart,
    handleCardInFolderDrop,
    isListening,
    stopListening,
    exportFolderToPDF,
    exportFolderToCSV,
    handleAddSubfolder,
    handleRenameFolder,
    handleDeleteFolder,
    findFolderById,
    folders,
    draggedFolderId
}) => {
    const [selectedFolderForMove, setSelectedFolderForMove] = useState('');
    const isExpanded = expandedFolderIds.has(folder.id);

    const countCardsRecursive = (currentFolder) => {
        let count = currentFolder.cards.length;
        for (const subfolderId in currentFolder.subfolders) {
            const sub = findFolderById(folders, subfolderId);
            if (sub) {
                count += countCardsRecursive(sub);
            }
        }
        return count;
    };

    return (
        <div
            key={folder.id}
            className={`folder ${draggedFolderId === folder.id ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleFolderDragStart(e, folder.id)}
            onDragOver={handleFolderDragOver}
            onDrop={(e) => handleFolderDrop(e, folder.id)}
            onDragEnd={handleFolderDragEnd}
            style={{ paddingLeft: `${level * 20}px` }}
        >
            <div
                className="folder-summary-custom"
                onClick={(e) => {
                    e.stopPropagation();
                    handleFolderToggle(folder.id, !isExpanded);
                }}
            >
                <div className="folder-item-header">
                    <span className="folder-name-display">
                        <span className={`folder-toggle-arrow ${isExpanded ? 'rotated' : ''}`}>▶</span>
                        {level > 0 && <span className="folder-icon">📁</span>}
                        {folder.name}
                        <span className="card-count-display"> ({countCardsRecursive(folder)} cards)</span>
                    </span>
                    <div className="folder-actions-right">
                        {!isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards });
                                }}
                                className="study-btn-small"
                            >
                                Study
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="folder-expanded-content">
                    <div className="folder-expanded-header">
                        <h3 className="folder-expanded-name">{folder.name}</h3>
                        <div className="folder-main-actions">
                            <button
                                onClick={() => {
                                    if (isListening) stopListening();
                                    setStudyingFolder({ id: folder.id, name: folder.name, cards: folder.cards });
                                    setModalConfig(null);
                                    setIsFeedbackModalOpen(false);
                                }}
                                className="study-btn-large"
                            >
                                Study
                            </button>
                            <button onClick={() => setFlashNotesActionModal(folder)} className="flash-notes-btn">Flash Notes</button>
                            <button onClick={() => setShowGamesModal(folder)} className="game-button-in-folder">Games</button>
                        </div>
                        {/* REFORMATTING ACTIONS BUTTON: */}
                        <div className="folder-expanded-actions">
                            <ActionsDropdown
                                folder={folder}
                                exportPdf={exportFolderToPDF}
                                exportCsv={exportFolderToCSV}
                                onAddSubfolder={(id) => {
                                    setModalConfig({ type: 'createFolder', title: 'Add Subfolder', onConfirm: (name) => handleAddSubfolder(id, name) });
                                }}
                                onRenameFolder={(id, name) => {
                                    setModalConfig({ type: 'prompt', title: 'Rename Folder', message: 'Enter new name for folder:', defaultValue: name, onConfirm: (newName) => handleRenameFolder(id, newName) });
                                }}
                                onDeleteFolder={(id) => {
                                    setModalConfig({ type: 'confirm', message: `Are you sure you want to delete "${findFolderById(folders, id)?.name}"? This will also delete all subfolders and cards within it.`, onConfirm: () => handleDeleteFolder(id) });
                                }}
                            />
                        </div>
                    </div>
                    {/* Subfolders will be rendered recursively from MainApp */}
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
                                    <input 
                                      type="checkbox" 
                                      checked={!!(selectedCardsInExpandedFolder[folder.id] && selectedCardsInExpandedFolder[folder.id][card.id])} 
                                      onChange={() => handleSelectedCardInExpandedFolder(folder.id, card.id)} 
                                    />
                                </div>
                                <div className="card-content">
                                    {renderCardContent(card, 'folder', folder.id)}
                                </div>
                            </div>
                        )) : <p className="subtle-text">No cards in this folder yet.</p>}
                    </div>
                     <div className="folder-card-actions">
                        <select className="folder-select" value={selectedFolderForMove} onChange={(e) => setSelectedFolderForMove(e.target.value)}>
                            <option value="" disabled>Move selected to...</option>
                            {allFoldersForMoveDropdown.map(f => f.id !== folder.id && <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <button
                            onClick={() => handleMoveSelectedCardsFromExpandedFolder(folder.id, selectedFolderForMove)}
                            className="move-to-folder-btn"
                            disabled={!Object.values(selectedCardsInExpandedFolder[folder.id] || {}).some(v => v) || !selectedFolderForMove}
                        >
                            Move Selected
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const MainApp = ({ showDocViewer, setShowDocViewer }) => {
    const [appMode, setAppMode] = useState(null);
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
    const [expandedFolderIds, setExpandedFolderIds] = new useState(new Set());
    const [selectedCardsInExpandedFolder, setSelectedCardsInExpandedFolder] = useState({});
    const [imageSrc, setImageSrc] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [fotoCardCount, setFotoCardCount] = useState(5);
    const [modalConfig, setModalConfig] = useState(null);
    const [flashNotesActionModal, setFlashNotesActionModal] = useState(null);
    const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
    const [flashNotesContent, setFlashNotesContent] = useState(null);
    const [showFlashNotesViewer, setShowFlashNotesViewer] = useState(false);
    const [gameModeFolder, setGameModeFolder] = useState(null);
    const [gameLaunchedFromStudy, setGameLaunchedFromStudy] = useState(false);
    const [showGamesModal, setShowGamesModal] = useState(null);
    const [showAnamnesisNemesisLanding, setShowAnamnesisNemesisLanding] = useState(false);
    const [mostRecentScore, setMostRecentScore] = useState(null);
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
    const silenceTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const fotoFileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    const isGeneratingRef = useRef(isGenerating);
    useEffect(() => { isGeneratingRef.current = isGenerating; }, [isGenerating]);

    const isAutoFlashOnRef = useRef(isAutoFlashOn);
    useEffect(() => { isAutoFlashOnRef.current = isAutoFlashOn; }, [isAutoFlashOn]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userAgent = navigator.userAgent;
        setIsSafari(/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent));
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
                            newFolder = { id: folderId, name: key, createdAt: Date.now(), lastViewed: Date.now(), cards: folder, subfolders: {} };
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
            setFolders({});
            setNotification("Error loading saved data. Starting fresh.");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('flashfonic-folders', JSON.stringify(folders));
    }, [folders]);

    // Replace your existing generateFlashcardRequest function with this one:

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

        // --- THIS IS THE FIX ---
        // We check the AI's response. If it's a structured reaction,
        // we wrap it so the 'answer' field contains the entire reaction object.
        let finalCardData = data;
        if (data.type === 'full_reaction') {
            finalCardData = {
                question: data.question,
                answer: data // The entire structured object is now the answer
            };
        }
        
        const newCard = { ...finalCardData, id: Date.now(), lastViewed: null, isFlagged: false };
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
        setNotification(`Error: ${error.message || 'Failed to connect to the backend server. Please try again later.'}`);
    } finally {
        setIsGenerating(false);
    }
}, [isDevMode]); // Keep dependencies as they are in your file

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
                setNotification(`Error: ${error.message || 'Failed to connect to the backend server. Please try again later.'}`);
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


    const stopListening = useCallback(() => {
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
    }, []);

    const startListening = useCallback(async () => {
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
            setNotification("Microphone access denied or error. Please check permissions and try again.");
            setIsListening(false);
        }
    }, [isDevMode, usage.count, usage.limit, isSafari, listeningDuration, voiceActivated, handleLiveFlashIt, stopListening]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false);
    }, []);

    const handleModeChange = useCallback((mode) => {
        if (isListening) stopListening();
        if (isCameraOn) stopCamera();
        setAppMode(mode);
        setNotification('');
        setImageSrc(null);
        setAiAnalysis(null);
    }, [isListening, isCameraOn, stopListening, stopCamera]);

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

    const findFolderById = useCallback((foldersObj, folderId) => {
        for (const id in foldersObj) {
            if (foldersObj[id].id === folderId) return foldersObj[id];
            const foundInSub = findFolderById(foldersObj[id].subfolders, folderId);
            if (foundInSub) return foundInSub;
        }
        return null;
    }, []);

    const updateFolderById = useCallback((foldersObj, folderId, updateFn) => {
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
    }, []);

    const deleteFolderById = useCallback((currentFolders, idToDelete) => {
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
    }, []);

    const deleteCardFromFolder = useCallback((folderId, cardId) => {
        setFolders(prevFolders => updateFolderById(prevFolders, folderId, (folder) => ({
            ...folder,
            cards: folder.cards.filter(card => card.id !== cardId)
        })));
    }, [updateFolderById]);

    const deleteFromQueue = (cardId) => {
        setGeneratedFlashcards(prev => prev.filter(card => card.id !== cardId));
    };
    
    const handleMoveToFolder = useCallback(() => {
        const checkedCardIds = Object.keys(checkedCards).filter(id => checkedCards[id]);
        if (checkedCardIds.length === 0 || !selectedFolderForMove) {
            setNotification("Please select at least one card and a destination folder.");
            return;
        }

        const cardsToMove = generatedFlashcards.filter(card => checkedCards[card.id]);
        
        setFolders(prevFolders => updateFolderById(prevFolders, selectedFolderForMove, (folder) => ({
            ...folder,
            cards: [...folder.cards, ...cardsToMove]
        })));

        setGeneratedFlashcards(prev => prev.filter(card => !checkedCards[card.id]));
        setCheckedCards({});
        setNotification(`${cardsToMove.length} card(s) moved successfully.`);
    }, [checkedCards, generatedFlashcards, selectedFolderForMove, updateFolderById]);

    const handleCreateFolder = useCallback((folderName) => {
        const newFolderId = generateUUID();
        setFolders(prev => ({
            ...prev,
            [newFolderId]: {
                id: newFolderId,
                name: folderName,
                cards: [],
                subfolders: {},
                createdAt: Date.now(),
                lastViewed: Date.now(),
                flashNotes: null,
                leaderboard: []
            }
        }));
        setModalConfig(null);
    }, []);

    const handleAddSubfolder = useCallback((parentFolderId, subfolderName) => {
        const newSubfolderId = generateUUID();
        setFolders(prev => updateFolderById(prev, parentFolderId, (folder) => ({
            ...folder,
            subfolders: {
                ...folder.subfolders,
                [newSubfolderId]: {
                    id: newSubfolderId,
                    name: subfolderName,
                    cards: [],
                    subfolders: {},
                    createdAt: Date.now(),
                    lastViewed: Date.now(),
                    flashNotes: null,
                    leaderboard: []
                }
            }
        })));
        setModalConfig(null);
    }, [updateFolderById]);

    const handleRenameFolder = useCallback((folderId, newName) => {
        setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
            ...folder,
            name: newName
        })));
        setModalConfig(null);
    }, [updateFolderById]);

    const handleDeleteFolder = useCallback((folderId) => {
        setFolders(prev => deleteFolderById(prev, folderId));
        setModalConfig(null);
    }, [deleteFolderById]);
    
    const startEditing = useCallback((card, source, folderId = null) => {
        setEditingCard({ ...card, source, folderId });
    }, []);

    const saveEdit = useCallback((updatedCard) => {
        if (!editingCard) return;
        const { source, folderId } = editingCard;
        const { id } = updatedCard;

        if (source === 'queue') {
            setGeneratedFlashcards(prev =>
                prev.map(card => card.id === id ? updatedCard : card)
            );
        } else if (source === 'folder' && folderId) {
            setFolders(prev => updateFolderById(prev, folderId, (folder) => ({
                ...folder,
                cards: folder.cards.map(card =>
                    card.id === id ? updatedCard : card
                )
            })));
        }
        setEditingCard(null);
    }, [editingCard, updateFolderById]);

    const renderCardContent = useCallback((card, source, folderId = null) => {
        if (editingCard && editingCard.id === card.id) {
            return (
                <EditableCardContent
                    card={editingCard}
                    onSave={saveEdit}
                    onCancel={() => setEditingCard(null)}
                />
            );
        }
        return (
            <>
                <div className="card-top-actions">
                    <button onClick={() => startEditing(card, source, folderId)} className="edit-btn">Edit</button>
                </div>
                <p><strong>Q:</strong> <ContentRenderer content={card.question} /></p>
                <p><strong>A:</strong> <ContentRenderer content={card.answer} reactionSummary={card.reactionSummary} /></p>
                <button onClick={() => {
                    if (source === 'queue') {
                        deleteFromQueue(card.id);
                    } else if (source === 'folder') {
                        deleteCardFromFolder(folderId, card.id);
                    }
                }} className="card-delete-btn">🗑️</button>
            </>
        );
    }, [editingCard, startEditing, saveEdit, deleteFromQueue, deleteCardFromFolder]);

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

    const getSortedFolders = useCallback((folderObj) => {
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
    }, [folderSortBy]);

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
            let draggedItem = null;
            
            const findAndRemove = (currentFolders, idToRemove) => {
                const newFolders = { ...currentFolders };
                if (newFolders[idToRemove]) {
                    draggedItem = newFolders[idToRemove];
                    delete newFolders[idToRemove];
                    return newFolders;
                }
                for (const id in newFolders) {
                    const updatedSubfolders = findAndRemove(newFolders[id].subfolders, idToRemove);
                    if (draggedItem) {
                        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                        return newFolders;
                    }
                }
                return currentFolders;
            };
            
            let foldersWithoutSource = findAndRemove(prevFolders, sourceFolderId);
            
            if (!draggedItem) return prevFolders;
            
            const addToTarget = (currentFolders, idToFind, itemToAdd) => {
                const newFolders = { ...currentFolders };
                if (newFolders[idToFind]) {
                    newFolders[idToFind].subfolders = {
                        ...newFolders[idToFind].subfolders,
                        [itemToAdd.id]: itemToAdd
                    };
                    return newFolders;
                }
                for (const id in newFolders) {
                    const updatedSubfolders = addToTarget(newFolders[id].subfolders, idToFind, itemToAdd);
                    if (JSON.stringify(updatedSubfolders) !== JSON.stringify(newFolders[id].subfolders)) {
                        newFolders[id] = { ...newFolders[id], subfolders: updatedSubfolders };
                        return newFolders;
                    }
                }
                return currentFolders;
            };
            
            return addToTarget(foldersWithoutSource, targetFolderId, draggedItem);
        });
        
        setDraggedFolderId(null);
    };

    const handleFolderDragEnd = () => {
        setDraggedFolderId(null);
    };

    const handleFolderToggle = useCallback((folderId, isOpen) => {
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
    }, [updateFolderById]);

        // --- REFACTOR FIX: NEW STATE HANDLERS FOR MainApp ---

    const handleSelectedCardInExpandedFolder = (folderId, cardId) => {
        setSelectedCardsInExpandedFolder(prev => {
            const newFoldersSelection = JSON.parse(JSON.stringify(prev));
            if (!newFoldersSelection[folderId]) {
                newFoldersSelection[folderId] = {};
            }
            newFoldersSelection[folderId][cardId] = !newFoldersSelection[folderId][cardId];
            return newFoldersSelection;
        });
    };

    const handleMoveSelectedCardsFromExpandedFolder = (sourceFolderId, destFolderId) => {
        if (!sourceFolderId || !destFolderId) return;

        let cardsToMove = [];
        const sourceFolder = findFolderById(folders, sourceFolderId);
        
        if (!sourceFolder || !selectedCardsInExpandedFolder[sourceFolderId]) return;

        const selectedCardIds = Object.keys(selectedCardsInExpandedFolder[sourceFolderId]).filter(
            cardId => selectedCardsInExpandedFolder[sourceFolderId][cardId]
        );

        if (selectedCardIds.length === 0) return;

        cardsToMove = sourceFolder.cards.filter(card => selectedCardIds.includes(card.id.toString()));

        setFolders(prev => {
            let newFolders = { ...prev };
            // Add cards to destination
            newFolders = updateFolderById(newFolders, destFolderId, (folder) => ({
                ...folder,
                cards: [...folder.cards, ...cardsToMove]
            }));
            // Remove cards from source
            newFolders = updateFolderById(newFolders, sourceFolderId, (folder) => ({
                ...folder,
                cards: folder.cards.filter(card => !selectedCardIds.includes(card.id.toString()))
            }));
            return newFolders;
        });

        // Clear the selection state for the source folder
        setSelectedCardsInExpandedFolder(prev => {
            const newSelection = { ...prev };
            delete newSelection[sourceFolderId];
            return newSelection;
        });

        setNotification(`${cardsToMove.length} card(s) moved.`);
    };

    const handleCardInFolderDragStart = (e, cardId, folderId) => {
        e.dataTransfer.setData("cardId", cardId);
        e.dataTransfer.setData("sourceFolderId", folderId);
    };

    const handleCardInFolderDrop = useCallback((e, targetCardId, targetFolderId) => {
        e.preventDefault();
        const sourceCardId = e.dataTransfer.getData("cardId");
        const sourceFolderId = e.dataTransfer.getData("sourceFolderId");

        if (sourceFolderId !== targetFolderId) {
            return;
        }

        setFolders(prevFolders => updateFolderById(prevFolders, targetFolderId, (folder) => {
            const currentCards = [...folder.cards];
            
            const draggedIndex = currentCards.findIndex(card => card.id.toString() === sourceCardId.toString());
            const targetIndex = currentCards.findIndex(card => card.id.toString() === targetCardId.toString());

            if (draggedIndex === -1 || targetIndex === -1) {
                return folder;
            }

            const [removed] = currentCards.splice(draggedIndex, 1);
            currentCards.splice(targetIndex, 0, removed);

            return { ...folder, cards: currentCards };
        }));
    }, [updateFolderById]);

    const handleStudySessionEnd = useCallback((updatedDeck) => {
        if (studyingFolder && updatedDeck) {
            setFolders(prev => updateFolderById(prev, studyingFolder.id, (folder) => ({
                ...folder,
                cards: updatedDeck
            })));
        }
        setStudyingFolder(null);
    }, [studyingFolder, updateFolderById]);

    const handleGameEnd = useCallback((folderId, finalScore, playerName, levelName) => {
        const newScoreEntry = {
            id: Date.now(),
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
    }, [updateFolderById]);

    const handlePlayGame = useCallback((folder) => {
        setMostRecentScore(null);
        setGameModeFolder({ ...folder });
        setGameLaunchedFromStudy(false);
    }, []);

    const handleLaunchAnamnesisNemesis = useCallback((folder) => {
        setMostRecentScore(null);
        setShowAnamnesisNemesisLanding(true);
        setShowGamesModal(null);
        setGameModeFolder({ ...folder });
    }, []);

    const handleStartAnamnesisNemesisGame = () => {
        setShowAnamnesisNemesisLanding(false);
        setNotification("Anamnesis Nemesis game started! (Placeholder)");
    };

    const getAllFoldersFlat = useCallback((foldersObj) => {
        let flatList = [];
        for (const id in foldersObj) {
            flatList.push(foldersObj[id]);
            flatList = flatList.concat(getAllFoldersFlat(foldersObj[id].subfolders));
        }
        return flatList;
    }, []);
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

// --- START REFACTORED PDF EXPORT FUNCTION ---
// This helper function sanitizes the content of a card so it can be correctly printed to a PDF.

// Replace your function with this final, robust version:

const renderContentForPdf = (content) => {
    // --- NEW: Logic to handle structured reactions for the PDF ---
    if (typeof content === 'object' && !Array.isArray(content) && content !== null && content.type === 'full_reaction') {
        // Helper to safely extract chemical names
        const extractName = (chemString) => {
            if (typeof chemString !== 'string') return '[Invalid Chemical]';
            const match = chemString.match(/CHEM\[(.*?)\]/);
            return match && match[1] ? match[1] : '[Unnamed Chemical]';
        };
        
        const reactants = Array.isArray(content.reactants) ? content.reactants.map(extractName).join(' + ') : '';
        const products = Array.isArray(content.products) ? content.products.map(extractName).join(' + ') : '';
        const reagents = Array.isArray(content.reagents) ? content.reagents.join(', ') : '';
        
        if (reagents) {
            return `${reactants} --[${reagents}]--> ${products}`;
        }
        return `${reactants} --> ${products}`;
    }

    // --- YOUR EXISTING CODE, NOW MADE SAFER ---

    // Handles simple molecule/reaction arrays
    if (Array.isArray(content)) {
        const textArray = content.map(item => {
            if (typeof item !== 'string') return '[Invalid Data]'; // Safety check
            const chemRegex = /CHEM\[(.*?)\]/;
            const match = item.match(chemRegex);
            // Safety check for the match result
            return match && typeof match[1] !== 'undefined' ? `[Structure of ${match[1] || 'Unnamed'}]` : item;
        });
        return textArray.join(' → ');
    }
    
    // Handles SMILES, LaTeX, and plain text strings
    if (typeof content === 'string') {
        let text = content;
        const smilesRegex = /SMILES\[(.*?)\]/g;
        const smilesReactionRegex = /SMILES\[(.*?)\]>>SMILES\[(.*?)\]/g;
        const latexRegex = /\$\$(.*?)\$\$/g;
        const inlineLatexRegex = /\$(.*?)\$/g;

        text = text.replace(smilesReactionRegex, '[Chemical Reaction]');
        text = text.replace(smilesRegex, '[Chemical Structure]');
        text = text.replace(latexRegex, '[Formula]');
        text = text.replace(inlineLatexRegex, '[Formula]');
        return text;
    }
    
    // Fallback for any other unknown data type
    if (!content) return ''; // Safety check for null or undefined
    return String(content);
};

// --- START REFACTORED PDF EXPORT FUNCTION ---

const exportFolderToPDF = useCallback((folderId) => {
    const folder = findFolderById(folders, folderId);
    if (!folder || folder.cards.length === 0) {
        setNotification("Folder not found or contains no cards for export.");
        return;
    }

    // This part remains the same: it asks the user for the layout.
    setModalConfig({
        type: 'prompt',
        title: 'Export to PDF',
        message: 'How many flashcards per page? (6, 8, or 10)',
        defaultValue: '8',
        onConfirm: async (value) => { // <-- IMPORTANT: We make this an async function
            setModalConfig(null);
            setNotification("Generating PDF... this may take a moment as images are fetched.");

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
                6: { rows: 3, cols: 2, fontSize: 10, imgSize: 25 },
                8: { rows: 4, cols: 2, fontSize: 9, imgSize: 20 },
                10: { rows: 5, cols: 2, fontSize: 8, imgSize: 15 },
            };
            const config = layoutConfig[cardsPerPage];
            const margin = 15;
            const cardW = (pageW - (margin * (config.cols + 1))) / config.cols;
            const cardH = (pageH - 40 - (config.rows * margin)) / config.rows;

            const drawHeader = () => { /* ... Your existing drawHeader function is perfect, no changes needed ... */ };

            // --- NEW HELPER FUNCTION TO FETCH IMAGES ---
            const getImageAsBase64 = async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) return null;
                    const blob = await response.blob();
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.error("Failed to fetch image for PDF:", error);
                    return null;
                }
            };
            
            // --- UPGRADED FUNCTION TO DRAW CARD CONTENT (QUESTION OR ANSWER) ---
            const drawCardContent = async (content, x, y, w, h) => {
                // Check if content is a string (and not a chemical string)
                if (typeof content === 'string' && !content.includes('CHEM[') && !content.includes('SMILES[')) {
                    const text = doc.splitTextToSize(content, w - 10);
                    doc.text(text, x + w / 2, y + h / 2, { align: 'center', baseline: 'middle' });
                    return;
                }
                
                // --- Logic to handle all chemical types ---
                let structure = { reactants: [], products: [], reagents: [] };
                let isReaction = false;

                if (typeof content === 'object' && content !== null && content.type === 'full_reaction') {
                    isReaction = true;
                    structure = content;
                } else if (Array.isArray(content)) {
                    isReaction = false; // It's just a list of products/molecules
                    structure.products = content;
                }
                
                // Now, draw the images
                const drawSide = async (chemArray, startX, sideWidth) => {
                    if (!Array.isArray(chemArray) || chemArray.length === 0) return;
                    
                    const imgSize = config.imgSize;
                    const totalImageWidth = chemArray.length * imgSize;
                    const totalSpacing = (chemArray.length - 1) * 5;
                    let currentX = startX + (sideWidth - (totalImageWidth + totalSpacing)) / 2;

                    for (let i = 0; i < chemArray.length; i++) {
                        const match = typeof chemArray[i] === 'string' && chemArray[i].match(/CHEM\[(.*?)\]/);
                        if (match && match[1]) {
                            const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(match[1])}/image?format=png`;
                            const imgData = await getImageAsBase64(url);
                            if (imgData) {
                                doc.addImage(imgData, 'PNG', currentX, y + (h - imgSize) / 2, imgSize, imgSize);
                            }
                        }
                        currentX += imgSize;
                        if (i < chemArray.length - 1) {
                            doc.text('+', currentX + 2.5, y + h / 2, { baseline: 'middle' });
                            currentX += 5;
                        }
                    }
                };

                const totalWidth = w - 10;
                const arrowZone = isReaction ? 20 : 0;
                const sideWidth = (totalWidth - arrowZone) / (structure.reactants.length > 0 ? 2 : 1);
                
                await drawSide(structure.reactants, x + 5, sideWidth);

                if (isReaction) {
                    const arrowX = x + 5 + sideWidth + (arrowZone / 2);
                    doc.setFontSize(config.fontSize * 0.8);
                    doc.text(structure.reagents.join(', '), arrowX, y + (h/2) - 5, { align: 'center' });
                    doc.setFontSize(config.fontSize * 1.5);
                    doc.text('→', arrowX, y + h/2 + 2, { align: 'center', baseline: 'middle' });
                }
                
                await drawSide(structure.products, x + 5 + sideWidth + arrowZone, sideWidth);
            };

            // --- MODIFIED MAIN LOOP TO HANDLE ASYNC DRAWING ---
            doc.addPage(); // Start on a fresh page
            doc.deletePage(1);
            
            // Loop through pages
            for (let pageNum = 0; pageNum < Math.ceil(cards.length / cardsPerPage); pageNum++) {
                if (pageNum > 0) doc.addPage();
                drawHeader();
                
                const pageCards = cards.slice(pageNum * cardsPerPage, (pageNum + 1) * cardsPerPage);

                // Loop through cards on the current page
                for (let i = 0; i < pageCards.length; i++) {
                    const card = pageCards[i];
                    const row = Math.floor(i / config.cols);
                    const col = i % config.cols;
                    const cardX = margin + (col * (cardW + margin));
                    const cardY = 40 + (row * (cardH + margin));

                    // Draw Front/Question
                    doc.setDrawColor(0);
                    doc.rect(cardX, cardY, cardW, cardH);
                    doc.setFontSize(config.fontSize);
                    const qText = doc.splitTextToSize(`Q: ${renderContentForPdf(card.question)}`, cardW - 10);
                    doc.text(qText, cardX + 5, cardY + 7);
                }
            }
            
            // Loop through pages again for the answers
            for (let pageNum = 0; pageNum < Math.ceil(cards.length / cardsPerPage); pageNum++) {
                 doc.addPage();
                 drawHeader();

                 const pageCards = cards.slice(pageNum * cardsPerPage, (pageNum + 1) * cardsPerPage);

                 for (let i = 0; i < pageCards.length; i++) {
                    const card = pageCards[i];
                    const row = Math.floor(i / config.cols);
                    const col = i % config.cols;
                    const cardX = margin + (col * (cardW + margin));
                    const cardY = 40 + (row * (cardH + margin));
                    
                    doc.setDrawColor(0);
                    doc.rect(cardX, cardY, cardW, cardH);
                    doc.setFontSize(config.fontSize);
                    doc.text("A:", cardX + 5, cardY + 7);
                    
                    // Call the new drawing function for the answer content
                    await drawCardContent(card.answer, cardX, cardY, cardW, cardH);
                 }
            }

            doc.save(`${folder.name}-flashcards.pdf`);
            setNotification("PDF generated successfully!");
        },
        onClose: () => setModalConfig(null)
    });
}, [folders, findFolderById]);
// --- END REFACTORED PDF EXPORT FUNCTION ---
    
    const exportFolderToCSV = useCallback((folderId) => {
        const folder = findFolderById(folders, folderId);
        if (!folder || folder.cards.length === 0) {
            setNotification("Folder not found or contains no cards for export.");
            return;
        }

        setStudyingFolder(null);
        setIsFeedbackModalOpen(false);

        setTimeout(() => {
            setModalConfig({
                type: 'prompt',
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
                        const escapedAnswer = `"${JSON.stringify(card.answer).replace(/"/g, '""')}"`;
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
                    setModalConfig(null);
                },
                onClose: () => {
                    setModalConfig(null);
                }
            });
        }, 0);
    }, [folders, findFolderById]);

    const handleFotoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                setImageSrc(reader.result);
                analyzeImage(base64data);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const startCamera = async () => {
        if (!videoRef.current) {
            console.error("Video element ref is not available yet.");
            setNotification("Camera could not be initialized. Please try again.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
            setNotification('Camera is on. Snap a picture of your notes!');
        } catch (err) {
            console.warn("Environment camera not found or failed, trying default camera.", err);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
                setNotification('Camera is on. Snap a picture of your notes!');
            } catch (finalErr) {
                console.error("Error accessing any camera:", finalErr);
                setNotification("Camera access denied or error. Please check permissions and ensure no other app is using it.");
            }
        }
    };
    
    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        stopCamera();
        setImageSrc(imageDataUrl);
        const base64Image = imageDataUrl.split(',')[1];
        analyzeImage(base64Image);
    };
    
    const analyzeImage = async (base64Image) => {
        setIsGenerating(true);
        setNotification('Analyzing image with AI...');
        setAiAnalysis(null);
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_data: base64Image }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to analyze image.');
            
            setAiAnalysis({
                recommendation: data.recommendation,
                extractedText: data.extractedText
            });
            setNotification(`AI recommends generating ${data.recommendation} cards. Confirm or adjust the number.`);
        } catch (error) {
            console.error("Error analyzing image:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateFotoCards = async (count) => {
        if (!isDevMode && usage.count >= usage.limit) {
            setNotification(`You have 0 cards left for today. Your limit will reset tomorrow.`);
            return;
        }

        setIsGenerating(true);
        setNotification('Generating flashcards from notes...');
        const textToProcess = aiAnalysis.extractedText;
        setAiAnalysis(null);
        setImageSrc(null);
        try {
            const response = await fetch('https://flashfonic-backend-shewski.replit.app/generate-flashcards-from-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToProcess, cardCount: count }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate flashcards.');
            
            const newCards = data.cards.map(card => ({ ...card, id: Date.now() + Math.random(), lastViewed: null, isFlagged: false }));
            setGeneratedFlashcards(prev => [...newCards, ...prev]);

            if (!isDevMode) {
                setUsage(prevUsage => {
                    const newUsage = { ...prevUsage, count: prevUsage.count + newCards.length };
                    localStorage.setItem('flashfonic-usage', JSON.stringify(newUsage));
                    return newUsage;
                });
            }
            
            setNotification(`${newCards.length} flashcards generated!`);
        } catch (error) {
            console.error("Error generating flashcards from image:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCancelUpload = () => {
        setMediaSrc(null);
        setUploadedFile(null);
        setFileName('');
        setCurrentTime(0);
        setMediaDuration(0);
        setAudioCacheId(null);
        setFileType(null);
        setIsUploadAutoFlashOn(false);
        setNotification('');
    };

    return (
        <>
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

            {showAnamnesisNemesisLanding && gameModeFolder && (
                <AnamnesisNemesisLandingPage
                    onClose={() => {setShowAnamnesisNemesisLanding(false); setShowGamesModal(gameModeFolder);}}
                    onStartGame={handleStartAnamnesisNemesisGame}
                />
            )}

            {modalConfig && modalConfig.type === 'prompt' && (
                <PromptModal
                    title={modalConfig.title}
                    message={modalConfig.message}
                    defaultValue={modalConfig.defaultValue}
                    onConfirm={modalConfig.onConfirm}
                    onClose={() => setModalConfig(null)}
                />
            )}
            {modalConfig && modalConfig.type === 'createFolder' && ( <CreateFolderModal onClose={() => setModalConfig(null)} onCreate={modalConfig.onConfirm} title={modalConfig.title} /> )}
            {modalConfig && modalConfig.type === 'confirm' && ( <ConfirmModal onClose={() => setModalConfig(null)} onConfirm={modalConfig.onConfirm} message={modalConfig.message} /> )}
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
            {modalConfig && modalConfig.type === 'flashFonicMode' && (
                <FlashFonicModeModal
                    onClose={() => setModalConfig(null)}
                    onSelect={(mode) => {
                        handleModeChange(mode);
                        setModalConfig(null);
                    }}
                />
            )}
            {modalConfig && modalConfig.type === 'imageSource' && (
                <ImageSourceModal
                    onClose={() => setModalConfig(null)}
                    onSelect={(source) => {
                        if (source === 'camera') {
                            startCamera();
                        } else {
                            fotoFileInputRef.current.click();
                        }
                        setModalConfig(null);
                    }}
                />
            )}

            
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

            {showGamesModal && (
                <GamesModal
                    folder={showGamesModal}
                    onClose={() => setShowGamesModal(null)}
                    onLaunchGame={(folder) => {
                        setShowGamesModal(null);
                        handlePlayGame(folder);
                    }}
                    onLaunchAnamnesisNemesis={handleLaunchAnamnesisNemesis}
                />
            )}

            {appMode === 'foto' ? (
                <div className="flashfoto-header">
                    <h1>FlashFoto</h1>
                    <div className="sub-brand">by FlashFonic<span style={{fontSize: '0.6em', verticalAlign: 'super'}}>™</span></div>
                    <h2 className="subheading">Snap it. Flash it. Learn.</h2>
                </div>
            ) : (
                <div className="header">
                    <h1>FlashFonic<span style={{fontSize: '0.6em', verticalAlign: 'super'}}>™</span></h1>
                    <h2 className="subheading">Listen. Flash it. Learn.</h2>
                </div>
            )}
            <div className="flashcount-container">
                <div className="usage-counter-new">
                    <span className="counter-label">Flashcount: </span>
                    {isDevMode ? (
                        <span className="counter-value">unlimited</span>
                    ) : (
                        <span className="counter-value">{usage.limit - usage.count} cards <span className="counter-suffix">(Free Trial)</span></span>
                    )}
                </div>
            </div>
            <div className="main-mode-selector">
                <button 
                    onClick={() => setModalConfig({ type: 'flashFonicMode' })} 
                    className={`create-folder-btn ${(appMode === 'live' || appMode === 'upload') ? 'active' : ''}`}
                >
                    FlashFonic
                </button>
                <button 
                    onClick={() => handleModeChange('foto')} 
                    className={`create-folder-btn ${appMode === 'foto' ? 'active' : ''}`}
                >
                    FlashFoto
                </button>
            </div>
            
            {appMode && (
                <div className="card main-controls" style={{position: 'relative'}}>
                    <div className="controls-header">
                    </div>
                    {appMode === 'live' ? (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Choose a listening duration using the slider below.</li>
                                    <li>Click "Start Listening" to begin capturing audio.</li>
                                    <li>Hit "Flash It!" to create a card, or use the voice/auto features.</li>
                                </ol>
                            </div>
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
                    ) : appMode === 'upload' ? (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Click "Select File" to upload an audio or video.</li>
                                    <li>Play the media, then hit "Flash It!" to create a card.</li>
                                </ol>
                            </div>
                            <div className="upload-button-container">
                                <button onClick={triggerFileUpload}>{fileName ? 'Change File' : 'Select File'}</button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" style={{ display: 'none' }} />
                            {fileName && <p className="file-name-display">Selected: {fileName}</p>}
                            
                            {mediaSrc && (
                                <>
                                    <div className="upload-cancel-container">
                                        <button onClick={handleCancelUpload} className="cancel-upload-btn">Cancel Upload</button>
                                    </div>
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
                                <label htmlFor="duration-slider-upload" className="slider-label">Capture Last: <span className="slider-value">{duration} seconds of audio</span></label>
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
                    ) : (
                        <>
                            <div className="voice-hint" style={{marginBottom: '1.5rem'}}>
                                <ol>
                                    <li>Choose your default number of flashcards via the slider below.</li>
                                    <li>Snap a photo or upload an image of your notes.</li>
                                </ol>
                            </div>
                            <div className="image-preview-container">
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: isCameraOn ? 'block' : 'none' }} />
                                {imageSrc && !isCameraOn && <img src={imageSrc} alt="Preview" />}
                                {!imageSrc && !isCameraOn && !isGenerating && (
                                    <div className="image-preview-placeholder"><p>Upload or capture an image of your notes</p></div>
                                )}
                                {isGenerating && (
                                    <div className="image-preview-placeholder"><p>AI is working...</p></div>
                                )}
                            </div>
                            <div className="flashfoto-controls">
                                {!isCameraOn && !imageSrc ? (
                                    <button onClick={() => setModalConfig({ type: 'imageSource' })} className="start-stop-btn">Snap or Upload Photo</button>
                                ) : isCameraOn ? (
                                    <>
                                        <button onClick={takePicture} className="start-stop-btn active">📸 Snap It!</button>
                                        <button onClick={stopCamera} className="start-stop-btn cancel-action">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => {
                                        setImageSrc(null);
                                        setAiAnalysis(null);
                                        setNotification('');
                                    }} className="start-stop-btn cancel-action">Clear Image</button>
                                )}
                                <input type="file" ref={fotoFileInputRef} onChange={handleFotoFileChange} accept="image/*" style={{ display: 'none' }} />
                            </div>
                            {aiAnalysis && (
                                <div className="ai-recommendation">
                                    <p>FlashFonic recommends <strong>{aiAnalysis.recommendation}</strong> flashcards. Do you agree?</p>
                                    <div className="ai-recommendation-actions">
                                        <button onClick={() => handleGenerateFotoCards(aiAnalysis.recommendation)} disabled={isGenerating}>Capture as Recommended</button>
                                        <button onClick={() => handleGenerateFotoCards(fotoCardCount)} disabled={isGenerating}>Capture {fotoCardCount} Flashcards</button>
                                        <button onClick={() => setAiAnalysis(null)} className="modal-create-btn danger">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="slider-container">
                                <label htmlFor="foto-card-slider" className="slider-label">Number of Flashcards: <span className="slider-value">{fotoCardCount}</span></label>
                                <input id="foto-card-slider" type="range" min="2" max="10" step="1" value={fotoCardCount} onChange={(e) => setFotoCardCount(Number(e.target.value))} disabled={isGenerating || isProcessing} />
                            </div>
                            {isGenerating && !aiAnalysis && !notification.includes('Analyzing') && <p className="notification">Generating flashcards...</p>}
                        </>
                    )}
                </div>
            )}
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
                            expandedFolderIds={expandedFolderIds}
                            handleFolderToggle={handleFolderToggle}
                            handleFolderDragStart={handleFolderDragStart}
                            handleFolderDragOver={handleFolderDragOver}
                            handleFolderDrop={handleFolderDrop}
                            handleFolderDragEnd={handleFolderDragEnd}
                            getSortedFolders={getSortedFolders}
                            renderCardContent={renderCardContent}
                            setStudyingFolder={setStudyingFolder}
                            setModalConfig={setModalConfig}
                            setIsFeedbackModalOpen={setIsFeedbackModalOpen}
                            setFlashNotesActionModal={setFlashNotesActionModal}
                            setShowGamesModal={setShowGamesModal}
                            selectedCardsInExpandedFolder={selectedCardsInExpandedFolder}
                            handleSelectedCardInExpandedFolder={handleSelectedCardInExpandedFolder}
                            handleMoveSelectedCardsFromExpandedFolder={handleMoveSelectedCardsFromExpandedFolder}
                            handleCardInFolderDragStart={handleCardInFolderDragStart}
                            handleCardInFolderDrop={handleCardInFolderDrop}
                            isListening={isListening}
                            stopListening={stopListening}
                            exportFolderToPDF={exportFolderToPDF}
                            exportFolderToCSV={exportFolderToCSV}
                            handleAddSubfolder={handleAddSubfolder}
                            handleRenameFolder={handleRenameFolder}
                            handleDeleteFolder={handleDeleteFolder}
                            findFolderById={findFolderById}
                            folders={folders}
                            draggedFolderId={draggedFolderId}
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
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="game-action-btn" onClick={() => setShowDocViewer('eula')}>User Agreement</button>
                    <button className="game-action-btn" onClick={() => setShowDocViewer('privacy')}>Privacy Policy</button>
                </div>
                <p className="footer-credit" style={{ marginTop: '1rem', color: 'var(--primary-purple)' }}>© FlashFonic, Trifecta Pro LLC</p>
            </div>
            {showDocViewer && (
                <DocViewer
                    docType={showDocViewer}
                    onClose={() => setShowDocViewer(null)}
                />
            )}
        </>
    );
};

// --- Top-Level App Component ---
const App = () => {
    const [showLanding, setShowLanding] = useState(true);
    const [showEulaModal, setShowEulaModal] = useState(false);
    const [showDocViewer, setShowDocViewer] = useState(null);
    const [appReady, setAppReady] = useState(false);
    const audioInitialized = useRef(false);

    const handleStartLandingFlow = async () => {
        const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
        const hasAcceptedEULA = localStorage.getItem('flashfonic-eula-accepted') === 'true';

        if (isDevMode) {
            setShowLanding(false);
            setShowEulaModal(true);
        } else if (hasAcceptedEULA) {
            if (!audioInitialized.current) {
                await Tone.start();
                console.log("AudioContext started for returning user.");
                audioInitialized.current = true;
            }
            setShowLanding(false);
            setAppReady(true);
        } else {
            setShowLanding(false);
            setShowEulaModal(true);
        }
    };

    const handleEULAAccept = async () => {
        const isDevMode = new URLSearchParams(window.location.search).get('dev') === 'true';
        
        if (!isDevMode) {
            localStorage.setItem('flashfonic-eula-accepted', 'true');
        }
        setShowEulaModal(false);
        
        if (!audioInitialized.current) {
            await Tone.start();
            console.log("AudioContext started after EULA acceptance.");
            audioInitialized.current = true;
        }
        setAppReady(true);
    };
    
    if (showLanding) {
        return <LandingPage onEnter={handleStartLandingFlow} />;
    }
    
    if (showEulaModal) {
        return <EULAModal onAccept={handleEULAAccept} />;
    }
    
    if (appReady) {
        return (
            <div className="main-app-container">
                <MainApp showDocViewer={showDocViewer} setShowDocViewer={setShowDocViewer} />
                {/* <Analytics /> */}
            </div>
        );
    }

    return null;
};

export default App;

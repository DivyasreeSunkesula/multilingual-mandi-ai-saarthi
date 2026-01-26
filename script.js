// AI Saarthi - Multilingual Mandi JavaScript
class AISaarthi {
    constructor() {
        this.isListening = false;
        this.currentLanguage = 'hi';
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.negotiationActive = false;
        this.priceData = this.initializePriceData();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.updateConnectionStatus();
        this.startPriceUpdates();
    }

    initializePriceData() {
        return {
            'टमाटर': { min: 15, max: 20, trust: 3, trend: 'stable' },
            'प्याज': { min: 25, max: 30, trust: 4, trend: 'rising' },
            'केला': { min: 35, max: 45, trust: 2, trend: 'falling' }
        };
    }

    setupEventListeners() {
        const micButton = document.getElementById('micButton');
        const languageSelect = document.getElementById('languageSelect');
        const acceptBtn = document.getElementById('acceptBtn');
        const waitBtn = document.getElementById('waitBtn');
        const counterBtn = document.getElementById('counterBtn');

        micButton.addEventListener('click', () => this.toggleListening());
        languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        
        if (acceptBtn) acceptBtn.addEventListener('click', () => this.handleNegotiationAction('accept'));
        if (waitBtn) waitBtn.addEventListener('click', () => this.handleNegotiationAction('wait'));
        if (counterBtn) counterBtn.addEventListener('click', () => this.handleNegotiationAction('counter'));
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateMicButton();
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateMicButton();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateMicButton();
            };
        }
    }

    toggleListening() {
        if (!this.recognition) {
            this.showMessage('Speech recognition not supported in this browser', 'error');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);
            this.recognition.start();
        }
    }

    updateMicButton() {
        const micButton = document.getElementById('micButton');
        const micIcon = micButton.querySelector('.mic-icon');
        
        if (this.isListening) {
            micButton.classList.add('listening');
            micIcon.textContent = '🔴';
        } else {
            micButton.classList.remove('listening');
            micIcon.textContent = '🎤';
        }
    }

    processVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Simulate AI processing
        this.showMessage(`आपने कहा: "${transcript}"`, 'user');
        
        // Check if it's a price inquiry
        if (this.isPriceInquiry(transcript)) {
            this.handlePriceInquiry(transcript);
        } else if (this.isNegotiationStart(transcript)) {
            this.startNegotiation(transcript);
        } else {
            // General AI response
            setTimeout(() => {
                this.generateAIResponse(transcript);
            }, 1000);
        }
    }

    isPriceInquiry(text) {
        const priceKeywords = ['भाव', 'दाम', 'कीमत', 'price', 'rate', 'cost'];
        const produceKeywords = ['टमाटर', 'प्याज', 'केला', 'tomato', 'onion', 'banana'];
        
        return priceKeywords.some(keyword => text.toLowerCase().includes(keyword)) &&
               produceKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    isNegotiationStart(text) {
        const negotiationKeywords = ['बातचीत', 'negotiate', 'deal', 'offer', 'buy', 'sell'];
        return negotiationKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    handlePriceInquiry(transcript) {
        // Extract produce name and provide price info
        let produce = 'टमाटर'; // Default
        if (transcript.includes('प्याज') || transcript.includes('onion')) produce = 'प्याज';
        if (transcript.includes('केला') || transcript.includes('banana')) produce = 'केला';
        
        const priceInfo = this.priceData[produce];
        const response = `${produce} का आज का भाव ₹${priceInfo.min} से ₹${priceInfo.max} प्रति किलो है। यह विश्वसनीय स्रोतों से मिली जानकारी है।`;
        
        this.showMessage(response, 'ai');
        this.speak(response);
    }

    startNegotiation(transcript) {
        this.negotiationActive = true;
        document.getElementById('negotiationSection').style.display = 'block';
        
        const response = 'मैं आपकी बातचीत में मदद करूंगा। न्याय संकेतक देखते रहें।';
        this.showMessage(response, 'ai');
        this.speak(response);
        
        // Simulate negotiation scenario
        setTimeout(() => {
            this.simulateNegotiationScenario();
        }, 2000);
    }

    simulateNegotiationScenario() {
        const scenarios = [
            {
                offer: 'खरीदार: टमाटर ₹12 किलो दे दो',
                fairness: 'red',
                advice: 'यह बहुत कम दाम है। बाजार भाव ₹15-20 है।'
            },
            {
                offer: 'खरीदार: ₹18 किलो कैसा रहेगा?',
                fairness: 'green',
                advice: 'यह उचित दाम है। स्वीकार कर सकते हैं।'
            },
            {
                offer: 'खरीदार: ₹14 किलो, अंतिम दाम',
                fairness: 'yellow',
                advice: 'थोड़ा कम है लेकिन विचार कर सकते हैं।'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        this.showMessage(scenario.offer, 'negotiation');
        this.updateFairnessIndicator(scenario.fairness);
        
        setTimeout(() => {
            this.showMessage(`AI सलाह: ${scenario.advice}`, 'ai');
            this.speak(scenario.advice);
        }, 1500);
    }

    updateFairnessIndicator(level) {
        // Reset all lights
        document.querySelectorAll('.light').forEach(light => light.classList.remove('active'));
        
        // Activate appropriate light
        const lightId = level + 'Light';
        document.getElementById(lightId).classList.add('active');
    }

    handleNegotiationAction(action) {
        const responses = {
            accept: 'अच्छा निर्णय! सौदा पक्का करें।',
            wait: 'धैर्य रखें। बेहतर ऑफर का इंतजार करें।',
            counter: 'काउंटर ऑफर दें। अपना दाम बताएं।'
        };
        
        this.showMessage(responses[action], 'ai');
        this.speak(responses[action]);
    }

    generateAIResponse(input) {
        const responses = [
            'मैं आपकी मदद करने के लिए यहाँ हूँ।',
            'कृपया अपना सवाल दोहराएं।',
            'मैं समझ गया। आगे बताएं।',
            'आपको और क्या जानकारी चाहिए?'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.showMessage(response, 'ai');
        this.speak(response);
    }

    showMessage(text, type) {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${text}</span>
                <span class="message-time">${new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
        
        messageContainer.appendChild(messageDiv);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getLanguageCode(this.currentLanguage);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.synthesis.speak(utterance);
        }
    }

    changeLanguage(langCode) {
        this.currentLanguage = langCode;
        if (this.recognition) {
            this.recognition.lang = this.getLanguageCode(langCode);
        }
        
        // Update UI language
        this.updateUILanguage(langCode);
    }

    getLanguageCode(lang) {
        const langCodes = {
            'hi': 'hi-IN',
            'te': 'te-IN',
            'ta': 'ta-IN',
            'pa': 'pa-IN',
            'en': 'en-IN'
        };
        return langCodes[lang] || 'hi-IN';
    }

    updateUILanguage(lang) {
        // This would update UI text based on selected language
        // For now, keeping it simple
        console.log(`Language changed to: ${lang}`);
    }

    updateConnectionStatus() {
        const statusElement = document.querySelector('.status');
        const isOnline = navigator.onLine;
        
        if (statusElement) {
            statusElement.textContent = isOnline ? 'ऑनलाइन' : 'ऑफलाइन';
            statusElement.className = `status ${isOnline ? 'online' : 'offline'}`;
        }
        
        // Check again in 30 seconds
        setTimeout(() => this.updateConnectionStatus(), 30000);
    }

    startPriceUpdates() {
        // Simulate real-time price updates
        setInterval(() => {
            this.updatePrices();
        }, 60000); // Update every minute
    }

    updatePrices() {
        // Simulate small price fluctuations
        Object.keys(this.priceData).forEach(produce => {
            const data = this.priceData[produce];
            const fluctuation = Math.random() * 2 - 1; // -1 to +1
            
            data.min = Math.max(1, Math.round(data.min + fluctuation));
            data.max = Math.max(data.min + 2, Math.round(data.max + fluctuation));
        });
        
        // Update UI (would need to implement price card updates)
        console.log('Prices updated:', this.priceData);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiSaarthi = new AISaarthi();
});

// Handle online/offline events
window.addEventListener('online', () => {
    document.querySelector('.status').textContent = 'ऑनलाइन';
    document.querySelector('.status').className = 'status online';
});

window.addEventListener('offline', () => {
    document.querySelector('.status').textContent = 'ऑफलाइन';
    document.querySelector('.status').className = 'status offline';
});
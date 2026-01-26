// Demo Enhancement for AI Saarthi
class DemoEnhancement {
    constructor() {
        this.demoMode = true;
        this.demoScenarios = this.initializeDemoScenarios();
        this.currentScenario = 0;
        
        this.init();
    }

    init() {
        this.addDemoControls();
        this.setupDemoEventListeners();
    }

    initializeDemoScenarios() {
        return [
            {
                title: "Price Discovery Demo",
                description: "Farmer asks about tomato prices",
                userInput: "टमाटर का भाव क्या है?",
                aiResponse: "आज टमाटर का भाव ₹15 से ₹20 प्रति किलो है। यह पास के 5 व्यापारियों के आधार पर है।",
                language: "hi"
            },
            {
                title: "Negotiation Assistant Demo",
                description: "Buyer offers low price, AI provides guidance",
                userInput: "खरीदार ₹12 किलो दे रहा है",
                aiResponse: "यह बाजार भाव से कम है। ₹17-18 के लिए बातचीत करें।",
                language: "hi",
                fairness: "red"
            },
            {
                title: "Multilingual Support Demo",
                description: "Telugu farmer asking about onion prices",
                userInput: "ఉల్లిపాయల ధర ఎంత?",
                aiResponse: "ఈరోజు ఉల్లిపాయల ధర కిలోకు ₹25 నుండి ₹30 వరకు ఉంది।",
                language: "te"
            },
            {
                title: "Fair Deal Confirmation",
                description: "Good price offer validation",
                userInput: "₹18 किलो मिल रहा है",
                aiResponse: "बहुत अच्छा! यह उचित दाम है। सौदा कर सकते हैं।",
                language: "hi",
                fairness: "green"
            }
        ];
    }

    addDemoControls() {
        const demoPanel = document.createElement('div');
        demoPanel.className = 'demo-panel';
        demoPanel.innerHTML = `
            <div class="demo-header">
                <h3>🎬 Demo Mode</h3>
                <button class="demo-toggle" id="demoToggle">Enable Auto Demo</button>
            </div>
            <div class="demo-controls">
                <button class="demo-btn" id="prevDemo">← Previous</button>
                <span class="demo-counter" id="demoCounter">1 / ${this.demoScenarios.length}</span>
                <button class="demo-btn" id="nextDemo">Next →</button>
            </div>
            <div class="demo-scenario" id="demoScenario">
                <h4 id="scenarioTitle">${this.demoScenarios[0].title}</h4>
                <p id="scenarioDesc">${this.demoScenarios[0].description}</p>
                <button class="demo-play" id="playScenario">▶ Play Scenario</button>
            </div>
        `;

        // Add demo panel to the page
        document.body.appendChild(demoPanel);
        
        // Add demo styles
        this.addDemoStyles();
    }

    addDemoStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .demo-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 1rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 280px;
                backdrop-filter: blur(10px);
            }

            .demo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #ecf0f1;
            }

            .demo-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 1rem;
            }

            .demo-toggle {
                background: #3498db;
                color: white;
                border: none;
                padding: 0.25rem 0.5rem;
                border-radius: 5px;
                font-size: 0.8rem;
                cursor: pointer;
            }

            .demo-toggle.active {
                background: #e74c3c;
            }

            .demo-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .demo-btn {
                background: #95a5a6;
                color: white;
                border: none;
                padding: 0.5rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            .demo-btn:hover {
                background: #7f8c8d;
            }

            .demo-counter {
                font-size: 0.9rem;
                color: #7f8c8d;
            }

            .demo-scenario h4 {
                margin: 0 0 0.5rem 0;
                color: #2c3e50;
                font-size: 0.9rem;
            }

            .demo-scenario p {
                margin: 0 0 1rem 0;
                color: #7f8c8d;
                font-size: 0.8rem;
            }

            .demo-play {
                background: #27ae60;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                width: 100%;
                font-size: 0.9rem;
            }

            .demo-play:hover {
                background: #229954;
            }

            @media (max-width: 768px) {
                .demo-panel {
                    position: relative;
                    top: 0;
                    right: 0;
                    margin: 1rem;
                    width: calc(100% - 2rem);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupDemoEventListeners() {
        document.getElementById('prevDemo').addEventListener('click', () => this.previousScenario());
        document.getElementById('nextDemo').addEventListener('click', () => this.nextScenario());
        document.getElementById('playScenario').addEventListener('click', () => this.playCurrentScenario());
        document.getElementById('demoToggle').addEventListener('click', () => this.toggleAutoDemo());
    }

    previousScenario() {
        this.currentScenario = (this.currentScenario - 1 + this.demoScenarios.length) % this.demoScenarios.length;
        this.updateScenarioDisplay();
    }

    nextScenario() {
        this.currentScenario = (this.currentScenario + 1) % this.demoScenarios.length;
        this.updateScenarioDisplay();
    }

    updateScenarioDisplay() {
        const scenario = this.demoScenarios[this.currentScenario];
        document.getElementById('scenarioTitle').textContent = scenario.title;
        document.getElementById('scenarioDesc').textContent = scenario.description;
        document.getElementById('demoCounter').textContent = `${this.currentScenario + 1} / ${this.demoScenarios.length}`;
    }

    playCurrentScenario() {
        const scenario = this.demoScenarios[this.currentScenario];
        
        // Change language if needed
        if (scenario.language && window.aiSaarthi) {
            window.aiSaarthi.currentLanguage = scenario.language;
            document.getElementById('languageSelect').value = scenario.language;
        }

        // Show user input
        if (window.aiSaarthi) {
            window.aiSaarthi.showMessage(scenario.userInput, 'user');
            
            // Show AI response after delay
            setTimeout(() => {
                window.aiSaarthi.showMessage(scenario.aiResponse, 'ai');
                window.aiSaarthi.speak(scenario.aiResponse);
                
                // Update fairness indicator if specified
                if (scenario.fairness) {
                    window.aiSaarthi.updateFairnessIndicator(scenario.fairness);
                }
                
                // Show negotiation section if it's a negotiation scenario
                if (scenario.title.includes('Negotiation') || scenario.fairness) {
                    document.getElementById('negotiationSection').style.display = 'block';
                }
            }, 1500);
        }
    }

    toggleAutoDemo() {
        const toggle = document.getElementById('demoToggle');
        
        if (toggle.textContent === 'Enable Auto Demo') {
            toggle.textContent = 'Stop Auto Demo';
            toggle.classList.add('active');
            this.startAutoDemo();
        } else {
            toggle.textContent = 'Enable Auto Demo';
            toggle.classList.remove('active');
            this.stopAutoDemo();
        }
    }

    startAutoDemo() {
        this.autoDemo = setInterval(() => {
            this.playCurrentScenario();
            
            setTimeout(() => {
                this.nextScenario();
            }, 5000);
        }, 8000);
    }

    stopAutoDemo() {
        if (this.autoDemo) {
            clearInterval(this.autoDemo);
            this.autoDemo = null;
        }
    }
}

// Initialize demo enhancement when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main app to initialize
    setTimeout(() => {
        window.demoEnhancement = new DemoEnhancement();
    }, 1000);
});
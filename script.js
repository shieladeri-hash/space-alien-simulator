// ===== Game State =====
let selections = {
    temperature: null,
    atmosphere: null,
    radiation: null,
    cellType: null,
    energy: null,
    structure: null,
    trait: null
};

// Prevent rapid clicks
let isProcessing = false;

// Cache DOM elements
let cachedElements = {};

// ===== Display Names =====
const displayNames = {
    temperature: {
        cold: "❄️ Cold",
        moderate: "🌤️ Moderate",
        extreme: "🔥 Extreme Heat"
    },
    atmosphere: {
        oxygen: "🫁 Oxygen",
        "no-oxygen": "🌑 No Oxygen",
        toxic: "☠️ Toxic Gas"
    },
    radiation: {
        low: "🟢 Low",
        medium: "🟡 Medium",
        high: "🔴 High"
    },
    cellType: {
        simple: "🟢 Simple Cell",
        complex: "🔵 Complex Cell",
        unknown: "🟣 Unknown Cell"
    },
    energy: {
        light: "☀️ Light (Photosynthesis)",
        chemicals: "🧪 Chemicals (Chemosynthesis)",
        heat: "🔥 Heat (Thermal)"
    },
    structure: {
        soft: "🫧 Soft Body",
        hard: "🪨 Hard Shell",
        membrane: "🧬 Thick Membrane"
    },
    trait: {
        radiation: "☢️ Radiation Resistance",
        growth: "📈 Fast Growth",
        "thick-membrane": "🛡️ Extra Thick Membrane",
        heat: "🔥 Heat Resistance"
    }
};

// ===== Alien Emojis =====
const alienEmojis = ['👽', '👾', '🤖', '👻', '💀', '🎃'];

// ===== Cache DOM Elements on Load =====
function cacheElements() {
    cachedElements = {
        screens: document.querySelectorAll('.screen'),
        survivalStatus: document.getElementById('survival-status'),
        scoreNumber: document.getElementById('score-number'),
        scoreExplanation: document.getElementById('score-explanation'),
        scoreMeterFill: document.getElementById('score-meter-fill'),
        explanationText: document.getElementById('explanation-text'),
        tipsList: document.getElementById('tips-list'),
        alienSummary: document.getElementById('alien-summary'),
        alienPreview: document.querySelector('.alien-preview'),
        optionButtons: document.querySelectorAll('.option-btn')
    };
}

// ===== Navigation =====
function goToScreen(screenId) {
    if (isProcessing) return;
    
    // Hide all screens
    if (cachedElements.screens) {
        cachedElements.screens.forEach(screen => {
            screen.classList.remove('active');
        });
    }

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Update alien preview on builder screen
    if (screenId === 'builder-screen' && cachedElements.alienPreview) {
        updateAlienPreview();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Selection Handling =====
function selectOption(group, value) {
    if (isProcessing) return;
    
    selections[group] = value;

    // Update button styles
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
        btn.classList.remove('selected');
    });

    const selectedBtn = document.querySelector(`[data-group="${group}"][data-value="${value}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }

    // Update alien preview if on builder screen
    if (group !== 'temperature' && group !== 'atmosphere' && group !== 'radiation') {
        updateAlienPreview();
    }
}

// ===== Alien Preview Update - Stable Version =====
function updateAlienPreview() {
    if (!cachedElements.alienPreview) return;

    // Pick alien emoji based on selections
    let alienIndex = 0;
    if (selections.cellType === 'complex') alienIndex = 1;
    if (selections.structure === 'hard') alienIndex = 2;
    if (selections.trait === 'radiation') alienIndex = 4;

    const alienEmoji = alienEmojis[alienIndex % alienEmojis.length];

    // Use textContent for better performance
    const morphDiv = cachedElements.alienPreview.querySelector('.alien-morph');
    if (morphDiv) {
        morphDiv.textContent = alienEmoji;
    } else {
        cachedElements.alienPreview.innerHTML = `
            <div class="alien-morph">${alienEmoji}</div>
            <p style="color: #aaf; margin-top: 10px;">Your evolving alien...</p>
        `;
    }
}

// ===== Simulation Logic =====
function runSimulation() {
    if (isProcessing) return;
    
    // Check if all selections are made
    const allSelected = Object.values(selections).every(val => val !== null);

    if (!allSelected) {
        alert("🚨 Please select options in all categories before simulating!");
        return;
    }

    isProcessing = true;

    try {
        // Calculate survival
        const result = calculateSurvival();

        // Display results
        displayResults(result);

        // Go to results screen
        goToScreen('results-screen');

        // Animate score meter after a short delay
        setTimeout(() => {
            animateScoreMeter(result.score);
            isProcessing = false;
        }, 300);
    } catch (error) {
        console.error('Simulation error:', error);
        alert("⚠️ An error occurred during simulation. Please try again.");
        isProcessing = false;
    }
}

function calculateSurvival() {
    let score = 5;
    let explanations = [];
    let tips = [];

    const { temperature, atmosphere, radiation, cellType, energy, structure, trait } = selections;

    // Temperature Analysis
    if (temperature === 'cold') {
        if (trait === 'heat') {
            score += 1;
            explanations.push("Heat resistance helps in cold environments.");
        }
        if (cellType === 'complex') {
            score += 1;
            explanations.push("Complex cells handle cold better.");
        }
    } else if (temperature === 'extreme') {
        if (trait === 'heat') {
            score += 2;
            explanations.push("Heat resistance is crucial in extreme heat!");
        } else {
            score -= 2;
            tips.push("🔥 Add Heat Resistance trait for extreme heat environments.");
        }
        if (energy === 'heat') {
            score += 1;
            explanations.push("Using heat as energy source is smart in hot environments.");
        }
    } else {
        explanations.push("Moderate temperature is ideal for most life forms.");
    }

    // Atmosphere Analysis
    if (atmosphere === 'oxygen') {
        if (cellType === 'complex') {
            score += 1;
            explanations.push("Complex cells efficiently use oxygen.");
        }
    } else if (atmosphere === 'no-oxygen') {
        if (energy === 'chemicals') {
            score += 2;
            explanations.push("Chemosynthesis works perfectly without oxygen!");
        } else if (energy === 'light') {
            score -= 1;
            tips.push("🧪 Chemical energy works better than light in no-oxygen environments.");
        }
        if (cellType === 'simple') {
            score += 1;
            explanations.push("Simple cells can survive without oxygen.");
        }
    } else if (atmosphere === 'toxic') {
        if (structure === 'membrane' || trait === 'thick-membrane') {
            score += 2;
            explanations.push("Thick membrane protects against toxic gases!");
        } else {
            score -= 2;
            tips.push("🛡️ Choose Thick Membrane for toxic atmospheres.");
        }
        if (cellType === 'unknown') {
            score += 1;
            explanations.push("Unknown cell type may have natural toxin resistance.");
        }
    }

    // Radiation Analysis
    if (radiation === 'high') {
        if (trait === 'radiation') {
            score += 2;
            explanations.push("Radiation resistance is essential in high radiation!");
        } else {
            score -= 2;
            tips.push("☢️ Radiation Resistance trait is critical for high radiation.");
        }
        if (structure === 'hard') {
            score += 1;
            explanations.push("Hard shell provides some radiation protection.");
        }
    } else if (radiation === 'medium') {
        if (trait === 'radiation' || structure === 'hard') {
            score += 1;
            explanations.push("Some radiation protection helps in medium radiation.");
        } else {
            score -= 1;
            tips.push("Consider radiation protection for medium radiation levels.");
        }
    } else {
        explanations.push("Low radiation is safe for most organisms.");
    }

    // Energy Source Analysis
    if (energy === 'light') {
        if (temperature === 'moderate') {
            score += 1;
            explanations.push("Photosynthesis works well in moderate temperatures.");
        }
    } else if (energy === 'chemicals') {
        score += 1;
        explanations.push("Chemosynthesis is versatile and works in many environments.");
    } else if (energy === 'heat') {
        if (temperature === 'extreme') {
            score += 1;
            explanations.push("Thermal energy is perfect for hot environments.");
        } else if (temperature === 'cold') {
            score -= 1;
            tips.push("🔥 Heat energy needs warm environments to work well.");
        }
    }

    // Cell Type Analysis
    if (cellType === 'complex') {
        score += 1;
        explanations.push("Complex cells are more adaptable overall.");
    } else if (cellType === 'simple') {
        explanations.push("Simple cells are basic but can survive in harsh conditions.");
    } else if (cellType === 'unknown') {
        if (Math.random() > 0.5) {
            score += 1;
            explanations.push("Unknown cells have surprising adaptations!");
        } else {
            score -= 1;
            explanations.push("Unknown cells have unpredictable biology.");
        }
    }

    // Structure Analysis
    if (structure === 'hard') {
        score += 1;
        explanations.push("Hard shell provides good physical protection.");
    } else if (structure === 'membrane') {
        score += 1;
        explanations.push("Thick membrane helps with chemical protection.");
    } else {
        explanations.push("Soft body is vulnerable but allows flexibility.");
    }

    // Special Trait Analysis
    if (trait === 'growth') {
        score += 1;
        explanations.push("Fast growth helps population recovery.");
        tips.push("📈 Fast growth is good, but consider survival traits first.");
    } else if (trait === 'thick-membrane') {
        if (atmosphere === 'toxic') {
            score += 1;
        }
        explanations.push("Extra thick membrane provides additional protection.");
    }

    // Final Score Adjustment
    score = Math.max(1, Math.min(10, score));

    // Determine survival status
    let status;
    if (score >= 7) {
        status = 'survives';
    } else if (score >= 4) {
        status = 'struggles';
    } else {
        status = 'dies';
    }

    // Add general tips
    if (tips.length === 0) {
        if (status === 'survives') {
            tips.push("🌟 Excellent adaptation! Your alien is well-suited.");
        } else if (status === 'struggles') {
            tips.push("🔬 Try different trait combinations to improve.");
        } else {
            tips.push("💀 This environment is challenging. Try different traits!");
        }
    }

    tips.push("🧠 In nature, organisms evolve over millions of years!");

    const scoreExplanation = generateScoreExplanation(score, status);

    return { score, status, explanations, tips, scoreExplanation };
}

function generateScoreExplanation(score, status) {
    if (score <= 3) {
        const msgs = [
            "Critical failure. Multiple adaptations missing.",
            "Poor survival chance. Major trait mismatches.",
            "Life support failing. Cannot sustain basic functions."
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    } else if (score <= 6) {
        const msgs = [
            "Partial survival. Needs better adaptation.",
            "Marginal survival. Some traits work, improvements needed.",
            "Uncertain outcome. May survive with modifications."
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    } else {
        const msgs = [
            "Strong survival chance. Excellent trait-environment match!",
            "Highly adapted. Organism should thrive.",
            "Optimal configuration. Built to survive!"
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    }
}

function displayResults(result) {
    try {
        // Survival status
        if (cachedElements.survivalStatus) {
            const el = cachedElements.survivalStatus;
            el.className = 'survival-status ' + result.status;
            el.textContent = result.status === 'survives' ? '✅ SURVIVES' : 
                             result.status === 'struggles' ? '⚠️ STRUGGLES' : '❌ DIES';
        }

        // Score number
        if (cachedElements.scoreNumber) {
            const scoreClass = getScoreClass(result.score);
            cachedElements.scoreNumber.className = 'score-number ' + scoreClass;
            cachedElements.scoreNumber.textContent = result.score + ' / 10';
        }

        // Score explanation
        if (cachedElements.scoreExplanation) {
            const scoreClass = getScoreClass(result.score);
            cachedElements.scoreExplanation.className = 'score-explanation ' + scoreClass;
            cachedElements.scoreExplanation.textContent = 'Score ' + result.score + '/10 → ' + result.scoreExplanation;
        }

        // Explanation text
        if (cachedElements.explanationText) {
            cachedElements.explanationText.textContent = result.explanations.join('  ');
        }

        // Tips list
        if (cachedElements.tipsList) {
            cachedElements.tipsList.innerHTML = result.tips.map(tip => '<li>' + tip + '</li>').join('');
        }

        // Alien summary
        if (cachedElements.alienSummary) {
            cachedElements.alienSummary.innerHTML = 
                '<div class="alien-trait"><span>Environment:</span> ' + displayNames.temperature[selections.temperature] + '</div>' +
                '<div class="alien-trait"><span>Atmosphere:</span> ' + displayNames.atmosphere[selections.atmosphere] + '</div>' +
                '<div class="alien-trait"><span>Radiation:</span> ' + displayNames.radiation[selections.radiation] + '</div>' +
                '<div class="alien-trait"><span>Cell Type:</span> ' + displayNames.cellType[selections.cellType] + '</div>' +
                '<div class="alien-trait"><span>Energy:</span> ' + displayNames.energy[selections.energy] + '</div>' +
                '<div class="alien-trait"><span>Structure:</span> ' + displayNames.structure[selections.structure] + '</div>' +
                '<div class="alien-trait"><span>Trait:</span> ' + displayNames.trait[selections.trait] + '</div>';
        }
    } catch (error) {
        console.error('Display results error:', error);
    }
}

function getScoreClass(score) {
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
}

function animateScoreMeter(score) {
    if (!cachedElements.scoreMeterFill) return;

    const percentage = (score / 10) * 100;
    const meterFill = cachedElements.scoreMeterFill;

    meterFill.style.width = '0%';
    meterFill.className = 'score-meter-fill';

    setTimeout(() => {
        meterFill.style.width = percentage + '%';
        meterFill.classList.add(getScoreClass(score));
    }, 50);
}

function resetGame() {
    if (isProcessing) return;
    
    // Reset selections
    selections = {
        temperature: null,
        atmosphere: null,
        radiation: null,
        cellType: null,
        energy: null,
        structure: null,
        trait: null
    };

    // Clear button selections
    if (cachedElements.optionButtons) {
        cachedElements.optionButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    // Reset score meter
    if (cachedElements.scoreMeterFill) {
        cachedElements.scoreMeterFill.style.width = '0%';
        cachedElements.scoreMeterFill.className = 'score-meter-fill';
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🪐 Alien Simulator loaded!');
    cacheElements();
});

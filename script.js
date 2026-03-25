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

// ===== Alien Emojis based on traits =====
const alienEmojis = ['👽', '👾', '🤖', '👻', '💀', '🎃'];

// ===== Navigation =====
function goToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Update alien preview on builder screen
    if (screenId === 'builder-screen') {
        updateAlienPreview();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Selection Handling =====
function selectOption(group, value) {
    selections[group] = value;
    
    // Update button styles
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelector(`[data-group="${group}"][data-value="${value}"]`)
        .classList.add('selected');
    
    // Update alien preview if on builder screen
    if (group !== 'temperature' && group !== 'atmosphere' && group !== 'radiation') {
        updateAlienPreview();
    }
}

// ===== Alien Preview Update =====
function updateAlienPreview() {
    const previewContainer = document.querySelector('.alien-preview');
    if (!previewContainer) return;
    
    // Pick alien emoji based on selections
    let alienIndex = 0;
    if (selections.cellType === 'complex') alienIndex = 1;
    if (selections.structure === 'hard') alienIndex = 2;
    if (selections.trait === 'radiation') alienIndex = 4;
    
    const alienEmoji = alienEmojis[alienIndex % alienEmojis.length];
    
    previewContainer.innerHTML = `
        <div class="alien-morph">${alienEmoji}</div>
        <p style="color: #aaf; margin-top: 10px;">Your evolving alien...</p>
    `;
}

// ===== Simulation Logic =====
function runSimulation() {
    // Check if all selections are made
    const allSelected = Object.values(selections).every(val => val !== null);
    
    if (!allSelected) {
        alert("🚨 Please select options in all categories before simulating!");
        return;
    }
    
    // Calculate survival
    const result = calculateSurvival();
    
    // Display results
    displayResults(result);
    
    // Go to results screen
    goToScreen('results-screen');
    
    // Animate score meter after a short delay
    setTimeout(() => {
        animateScoreMeter(result.score);
    }, 300);
}

function calculateSurvival() {
    let score = 5; // Start with base score
    let explanations = [];
    let tips = [];
    
    const { temperature, atmosphere, radiation, cellType, energy, structure, trait } = selections;
    
    // ===== Temperature Analysis =====
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
        // Moderate temperature - neutral
        score += 0;
        explanations.push("Moderate temperature is ideal for most life forms.");
    }
    
    // ===== Atmosphere Analysis =====
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
            tips.push("🛡️ Choose Thick Membrane or Extra Thick Membrane for toxic atmospheres.");
        }
        
        if (cellType === 'unknown') {
            score += 1;
            explanations.push("Unknown cell type may have natural toxin resistance.");
        }
    }
    
    // ===== Radiation Analysis =====
    if (radiation === 'high') {
        if (trait === 'radiation') {
            score += 2;
            explanations.push("Radiation resistance is essential in high radiation!");
        } else {
            score -= 2;
            tips.push("☢️ Radiation Resistance trait is critical for high radiation environments.");
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
        // Low radiation - generally safe
        explanations.push("Low radiation is safe for most organisms.");
    }
    
    // ===== Energy Source Analysis =====
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
    
    // ===== Cell Type Analysis =====
    if (cellType === 'complex') {
        score += 1;
        explanations.push("Complex cells are more adaptable overall.");
    } else if (cellType === 'simple') {
        score += 0;
        explanations.push("Simple cells are basic but can survive in harsh conditions.");
    } else if (cellType === 'unknown') {
        // Random bonus or penalty
        if (Math.random() > 0.5) {
            score += 1;
            explanations.push("Unknown cells have surprising adaptations!");
        } else {
            score -= 1;
            explanations.push("Unknown cells have unpredictable biology.");
        }
    }
    
    // ===== Structure Analysis =====
    if (structure === 'hard') {
        score += 1;
        explanations.push("Hard shell provides good physical protection.");
    } else if (structure === 'membrane') {
        score += 1;
        explanations.push("Thick membrane helps with chemical protection.");
    } else {
        explanations.push("Soft body is vulnerable but allows flexibility.");
    }
    
    // ===== Special Trait Analysis =====
    if (trait === 'growth') {
        score += 1;
        explanations.push("Fast growth helps population recovery.");
        tips.push("📈 Fast growth is good, but consider survival traits first in extreme environments.");
    } else if (trait === 'thick-membrane') {
        if (atmosphere === 'toxic') {
            score += 1;
        }
        explanations.push("Extra thick membrane provides additional protection.");
    }
    
    // ===== Final Score Adjustment =====
    // Ensure score is between 1 and 10
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
    
    // Add general tips if none were generated
    if (tips.length === 0) {
        if (status === 'survives') {
            tips.push("🌟 Excellent adaptation! Your alien is well-suited for this environment.");
        } else if (status === 'struggles') {
            tips.push("🔬 Try different trait combinations to improve survival chances.");
        } else {
            tips.push("💀 This environment is very challenging. Try completely different traits!");
        }
    }
    
    // Always add educational tip
    tips.push("🧠 Remember: In nature, organisms evolve over millions of years to match their environment!");
    
    // Generate score explanation
    const scoreExplanation = generateScoreExplanation(score, status);
    
    return {
        score,
        status,
        explanations,
        tips,
        scoreExplanation
    };
}

function generateScoreExplanation(score, status) {
    if (score <= 3) {
        const explanations = [
            "Critical failure. Multiple adaptations are missing for this environment.",
            "Poor survival chance. Major trait mismatches detected.",
            "Life support failing. Organism cannot sustain basic functions."
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    } else if (score <= 6) {
        const explanations = [
            "Partial survival. Needs better adaptation to environmental stressors.",
            "Marginal survival. Some traits work, but improvements needed.",
            "Uncertain outcome. Organism may survive with modifications."
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    } else {
        const explanations = [
            "Strong survival chance. Excellent trait-environment match!",
            "Highly adapted. Organism should thrive in this environment.",
            "Optimal configuration. This alien is built to survive!"
        ];
        return explanations[Math.floor(Math.random() * explanations.length)];
    }
}

function displayResults(result) {
    // Set survival status
    const statusEl = document.getElementById('survival-status');
    statusEl.className = 'survival-status ' + result.status;
    
    if (result.status === 'survives') {
        statusEl.innerHTML = '✅ SURVIVES';
    } else if (result.status === 'struggles') {
        statusEl.innerHTML = '⚠️ STRUGGLES';
    } else {
        statusEl.innerHTML = '❌ DIES';
    }
    
    // Set score number with color class
    const scoreNumberEl = document.getElementById('score-number');
    scoreNumberEl.className = 'score-number ' + getScoreClass(result.score);
    scoreNumberEl.textContent = result.score + ' / 10';
    
    // Set score explanation
    const scoreExplanationEl = document.getElementById('score-explanation');
    scoreExplanationEl.className = 'score-explanation ' + getScoreClass(result.score);
    scoreExplanationEl.textContent = `Score ${result.score}/10 → ${result.scoreExplanation}`;
    
    // Set explanation
    const explanationEl = document.getElementById('explanation-text');
    explanationEl.innerHTML = result.explanations.join('<br><br>');
    
    // Set tips
    const tipsList = document.getElementById('tips-list');
    tipsList.innerHTML = result.tips.map(tip => `<li>${tip}</li>`).join('');
    
    // Set alien summary
    const alienSummary = document.getElementById('alien-summary');
    alienSummary.innerHTML = `
        <div class="alien-trait"><span>Environment:</span> ${displayNames.temperature[selections.temperature]}</div>
        <div class="alien-trait"><span>Atmosphere:</span> ${displayNames.atmosphere[selections.atmosphere]}</div>
        <div class="alien-trait"><span>Radiation:</span> ${displayNames.radiation[selections.radiation]}</div>
        <div class="alien-trait"><span>Cell Type:</span> ${displayNames.cellType[selections.cellType]}</div>
        <div class="alien-trait"><span>Energy:</span> ${displayNames.energy[selections.energy]}</div>
        <div class="alien-trait"><span>Structure:</span> ${displayNames.structure[selections.structure]}</div>
        <div class="alien-trait"><span>Trait:</span> ${displayNames.trait[selections.trait]}</div>
    `;
}

function getScoreClass(score) {
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
}

function animateScoreMeter(score) {
    const meterFill = document.getElementById('score-meter-fill');
    const percentage = (score / 10) * 100;
    
    // Reset and animate
    meterFill.style.width = '0%';
    meterFill.className = 'score-meter-fill'; // Reset class
    
    setTimeout(() => {
        meterFill.style.width = percentage + '%';
        meterFill.classList.add(getScoreClass(score));
    }, 100);
}

function resetGame() {
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
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset score meter
    const meterFill = document.getElementById('score-meter-fill');
    if (meterFill) {
        meterFill.style.width = '0%';
        meterFill.className = 'score-meter-fill';
    }
}

// ===== Create Floating Particles =====
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🪐 Alien Biology Builder loaded!');
    createParticles();
});

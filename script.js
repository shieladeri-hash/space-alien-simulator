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

// ===== Alien Emojis =====
const alienEmojis = ['👽', '👾', '🤖', '👻', '💀', '🎃'];

// ===== Navigation =====
function goToScreen(screenId) {
    console.log('Navigating to:', screenId);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.classList.remove('active');
    });

    // Show target screen
    var targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Screen shown:', screenId);
    }

    // Update alien preview on builder screen
    if (screenId === 'builder-screen') {
        updateAlienPreview();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Selection Handling =====
function selectOption(group, value) {
    console.log('Selected:', group, '=', value);
    selections[group] = value;

    // Update button styles
    document.querySelectorAll('[data-group="' + group + '"]').forEach(function(btn) {
        btn.classList.remove('selected');
    });

    var selectedBtn = document.querySelector('[data-group="' + group + '"][data-value="' + value + '"]');
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }

    // Update alien preview if on builder screen
    if (group !== 'temperature' && group !== 'atmosphere' && group !== 'radiation') {
        updateAlienPreview();
    }
}

// ===== Alien Preview Update =====
function updateAlienPreview() {
    var previewContainer = document.querySelector('.alien-preview');
    if (!previewContainer) return;

    // Pick alien emoji based on selections
    var alienIndex = 0;
    if (selections.cellType === 'complex') alienIndex = 1;
    if (selections.structure === 'hard') alienIndex = 2;
    if (selections.trait === 'radiation') alienIndex = 4;

    var alienEmoji = alienEmojis[alienIndex % alienEmojis.length];

    previewContainer.innerHTML = '<div class="alien-morph">' + alienEmoji + '</div><p style="color: #aaf; margin-top: 10px;">Your evolving alien...</p>';
}

// ===== Simulation Logic =====
function runSimulation() {
    console.log('=== Run Simulation Called ===');
    console.log('Current selections:', selections);

    // Check if all selections are made
    var allSelected = true;
    var keys = ['temperature', 'atmosphere', 'radiation', 'cellType', 'energy', 'structure', 'trait'];
    for (var i = 0; i < keys.length; i++) {
        if (selections[keys[i]] === null || selections[keys[i]] === undefined) {
            allSelected = false;
            console.log('Missing selection:', keys[i]);
            break;
        }
    }

    if (!allSelected) {
        alert('🚨 Please select options in all categories before simulating!');
        return;
    }

    console.log('All selections made, calculating...');

    // Calculate survival
    var result = calculateSurvival();
    console.log('Result:', result);

    // Display results
    displayResults(result);

    // Go to results screen
    goToScreen('results-screen');

    // Animate score meter after a short delay
    setTimeout(function() {
        animateScoreMeter(result.score);
    }, 300);

    console.log('=== Simulation Complete ===');
}

function calculateSurvival() {
    var score = 5;
    var explanations = [];
    var tips = [];

    var temperature = selections.temperature;
    var atmosphere = selections.atmosphere;
    var radiation = selections.radiation;
    var cellType = selections.cellType;
    var energy = selections.energy;
    var structure = selections.structure;
    var trait = selections.trait;

    // Temperature Analysis
    if (temperature === 'cold') {
        if (trait === 'heat') {
            score += 1;
            explanations.push('Heat resistance helps in cold environments.');
        }
        if (cellType === 'complex') {
            score += 1;
            explanations.push('Complex cells handle cold better.');
        }
    } else if (temperature === 'extreme') {
        if (trait === 'heat') {
            score += 2;
            explanations.push('Heat resistance is crucial in extreme heat!');
        } else {
            score -= 2;
            tips.push('🔥 Add Heat Resistance trait for extreme heat environments.');
        }
        if (energy === 'heat') {
            score += 1;
            explanations.push('Using heat as energy source is smart in hot environments.');
        }
    } else {
        explanations.push('Moderate temperature is ideal for most life forms.');
    }

    // Atmosphere Analysis
    if (atmosphere === 'oxygen') {
        if (cellType === 'complex') {
            score += 1;
            explanations.push('Complex cells efficiently use oxygen.');
        }
    } else if (atmosphere === 'no-oxygen') {
        if (energy === 'chemicals') {
            score += 2;
            explanations.push('Chemosynthesis works perfectly without oxygen!');
        } else if (energy === 'light') {
            score -= 1;
            tips.push('🧪 Chemical energy works better than light in no-oxygen environments.');
        }
        if (cellType === 'simple') {
            score += 1;
            explanations.push('Simple cells can survive without oxygen.');
        }
    } else if (atmosphere === 'toxic') {
        if (structure === 'membrane' || trait === 'thick-membrane') {
            score += 2;
            explanations.push('Thick membrane protects against toxic gases!');
        } else {
            score -= 2;
            tips.push('🛡️ Choose Thick Membrane for toxic atmospheres.');
        }
        if (cellType === 'unknown') {
            score += 1;
            explanations.push('Unknown cell type may have natural toxin resistance.');
        }
    }

    // Radiation Analysis
    if (radiation === 'high') {
        if (trait === 'radiation') {
            score += 2;
            explanations.push('Radiation resistance is essential in high radiation!');
        } else {
            score -= 2;
            tips.push('☢️ Radiation Resistance trait is critical for high radiation.');
        }
        if (structure === 'hard') {
            score += 1;
            explanations.push('Hard shell provides some radiation protection.');
        }
    } else if (radiation === 'medium') {
        if (trait === 'radiation' || structure === 'hard') {
            score += 1;
            explanations.push('Some radiation protection helps in medium radiation.');
        } else {
            score -= 1;
            tips.push('Consider radiation protection for medium radiation levels.');
        }
    } else {
        explanations.push('Low radiation is safe for most organisms.');
    }

    // Energy Source Analysis
    if (energy === 'light') {
        if (temperature === 'moderate') {
            score += 1;
            explanations.push('Photosynthesis works well in moderate temperatures.');
        }
    } else if (energy === 'chemicals') {
        score += 1;
        explanations.push('Chemosynthesis is versatile and works in many environments.');
    } else if (energy === 'heat') {
        if (temperature === 'extreme') {
            score += 1;
            explanations.push('Thermal energy is perfect for hot environments.');
        } else if (temperature === 'cold') {
            score -= 1;
            tips.push('🔥 Heat energy needs warm environments to work well.');
        }
    }

    // Cell Type Analysis
    if (cellType === 'complex') {
        score += 1;
        explanations.push('Complex cells are more adaptable overall.');
    } else if (cellType === 'simple') {
        explanations.push('Simple cells are basic but can survive in harsh conditions.');
    } else if (cellType === 'unknown') {
        if (Math.random() > 0.5) {
            score += 1;
            explanations.push('Unknown cells have surprising adaptations!');
        } else {
            score -= 1;
            explanations.push('Unknown cells have unpredictable biology.');
        }
    }

    // Structure Analysis
    if (structure === 'hard') {
        score += 1;
        explanations.push('Hard shell provides good physical protection.');
    } else if (structure === 'membrane') {
        score += 1;
        explanations.push('Thick membrane helps with chemical protection.');
    } else {
        explanations.push('Soft body is vulnerable but allows flexibility.');
    }

    // Special Trait Analysis
    if (trait === 'growth') {
        score += 1;
        explanations.push('Fast growth helps population recovery.');
        tips.push('📈 Fast growth is good, but consider survival traits first.');
    } else if (trait === 'thick-membrane') {
        if (atmosphere === 'toxic') {
            score += 1;
        }
        explanations.push('Extra thick membrane provides additional protection.');
    }

    // Final Score Adjustment
    score = Math.max(1, Math.min(10, score));

    // Determine survival status
    var status;
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
            tips.push('🌟 Excellent adaptation! Your alien is well-suited.');
        } else if (status === 'struggles') {
            tips.push('🔬 Try different trait combinations to improve.');
        } else {
            tips.push('💀 This environment is challenging. Try different traits!');
        }
    }

    tips.push('🧠 In nature, organisms evolve over millions of years!');

    var scoreExplanation = generateScoreExplanation(score, status);

    return { score: score, status: status, explanations: explanations, tips: tips, scoreExplanation: scoreExplanation };
}

function generateScoreExplanation(score, status) {
    if (score <= 3) {
        var msgs = [
            'Critical failure. Multiple adaptations missing.',
            'Poor survival chance. Major trait mismatches.',
            'Life support failing. Cannot sustain basic functions.'
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    } else if (score <= 6) {
        var msgs2 = [
            'Partial survival. Needs better adaptation.',
            'Marginal survival. Some traits work, improvements needed.',
            'Uncertain outcome. May survive with modifications.'
        ];
        return msgs2[Math.floor(Math.random() * msgs2.length)];
    } else {
        var msgs3 = [
            'Strong survival chance. Excellent trait-environment match!',
            'Highly adapted. Organism should thrive.',
            'Optimal configuration. Built to survive!'
        ];
        return msgs3[Math.floor(Math.random() * msgs3.length)];
    }
}

function displayResults(result) {
    console.log('Displaying results:', result);

    // Survival status
    var statusEl = document.getElementById('survival-status');
    if (statusEl) {
        statusEl.className = 'survival-status ' + result.status;
        if (result.status === 'survives') {
            statusEl.innerHTML = '✅ SURVIVES';
        } else if (result.status === 'struggles') {
            statusEl.innerHTML = '⚠️ STRUGGLES';
        } else {
            statusEl.innerHTML = '❌ DIES';
        }
    }

    // Score number
    var scoreNumberEl = document.getElementById('score-number');
    if (scoreNumberEl) {
        var scoreClass = getScoreClass(result.score);
        scoreNumberEl.className = 'score-number ' + scoreClass;
        scoreNumberEl.innerHTML = result.score + ' / 10';
    }

    // Score explanation
    var scoreExplanationEl = document.getElementById('score-explanation');
    if (scoreExplanationEl) {
        var scoreClass2 = getScoreClass(result.score);
        scoreExplanationEl.className = 'score-explanation ' + scoreClass2;
        scoreExplanationEl.innerHTML = 'Score ' + result.score + '/10 → ' + result.scoreExplanation;
    }

    // Explanation text
    var explanationEl = document.getElementById('explanation-text');
    if (explanationEl) {
        explanationEl.innerHTML = result.explanations.join('<br><br>');
    }

    // Tips list
    var tipsList = document.getElementById('tips-list');
    if (tipsList) {
        var tipsHtml = '';
        for (var i = 0; i < result.tips.length; i++) {
            tipsHtml += '<li>' + result.tips[i] + '</li>';
        }
        tipsList.innerHTML = tipsHtml;
    }

    // Alien summary
    var alienSummary = document.getElementById('alien-summary');
    if (alienSummary) {
        alienSummary.innerHTML = 
            '<div class="alien-trait"><span>Environment:</span> ' + displayNames.temperature[selections.temperature] + '</div>' +
            '<div class="alien-trait"><span>Atmosphere:</span> ' + displayNames.atmosphere[selections.atmosphere] + '</div>' +
            '<div class="alien-trait"><span>Radiation:</span> ' + displayNames.radiation[selections.radiation] + '</div>' +
            '<div class="alien-trait"><span>Cell Type:</span> ' + displayNames.cellType[selections.cellType] + '</div>' +
            '<div class="alien-trait"><span>Energy:</span> ' + displayNames.energy[selections.energy] + '</div>' +
            '<div class="alien-trait"><span>Structure:</span> ' + displayNames.structure[selections.structure] + '</div>' +
            '<div class="alien-trait"><span>Trait:</span> ' + displayNames.trait[selections.trait] + '</div>';
    }

    console.log('Results displayed');
}

function getScoreClass(score) {
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
}

function animateScoreMeter(score) {
    var meterFill = document.getElementById('score-meter-fill');
    if (!meterFill) return;

    var percentage = (score / 10) * 100;

    meterFill.style.width = '0%';
    meterFill.className = 'score-meter-fill';

    setTimeout(function() {
        meterFill.style.width = percentage + '%';
        meterFill.classList.add(getScoreClass(score));
    }, 50);
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
    document.querySelectorAll('.option-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });

    // Reset score meter
    var meterFill = document.getElementById('score-meter-fill');
    if (meterFill) {
        meterFill.style.width = '0%';
        meterFill.className = 'score-meter-fill';
    }

    console.log('Game reset');
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🪐 Alien Simulator loaded!');
    console.log('Version: 2.0 - Stable Release');
});

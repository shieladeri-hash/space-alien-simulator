# 🪐 Alien Simulator

**An interactive educational simulation game inspired by Project Hail Mary**

Design your own alien organism and test if it can survive in different space environments! Learn about biochemistry, adaptation, and survival through this fun, game-like simulation.

![Alien Simulator](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🎯 Features

- **🌍 Environment Selection** - Choose temperature, atmosphere, and radiation levels
- **🧬 Alien Builder** - Design your organism with custom traits
- **🔬 Simulation Engine** - Smart analysis of trait-environment compatibility
- **📊 Visual Results** - Animated score meter with color-coded survival feedback
- **💡 Learning Tips** - Educational feedback after each simulation
- **🎮 Sci-Fi Theme** - Beautiful space visuals with neon effects and animations

---

## 🚀 Quick Start

### Option 1: Play Online (GitHub Pages)

Once deployed to GitHub Pages, visit:
```
https://<your-username>.github.io/alien-simulator/
```

### Option 2: Run Locally

1. **Clone or download** this repository
2. **Open** `index.html` in any modern web browser
3. **Start playing!** No installation required

```bash
# Clone the repository
git clone https://github.com/your-username/alien-simulator.git

# Navigate to the folder
cd alien-simulator

# Open in your default browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

---

## 🎮 How to Play

### Step 1: Welcome Screen
Click **"Start Mission"** to begin your simulation.

### Step 2: Choose Environment
Select the conditions your alien will face:
- **Temperature:** Cold / Moderate / Extreme Heat
- **Atmosphere:** Oxygen / No Oxygen / Toxic Gas
- **Radiation Level:** Low / Medium / High

### Step 3: Build Your Alien
Design your organism:
- **Cell Type:** Simple / Complex / Unknown
- **Energy Source:** Light / Chemicals / Heat
- **Body Structure:** Soft Body / Hard Shell / Thick Membrane
- **Special Trait:** Radiation Resistance / Fast Growth / Extra Thick Membrane / Heat Resistance

### Step 4: Run Simulation
Click **"Simulate"** and see if your alien survives!

### Step 5: Review Results
- **Survival Status:** ✅ Survives / ⚠️ Struggles / ❌ Dies
- **Score:** 1-10 with animated meter
- **Analysis:** Why your alien succeeded or failed
- **Tips:** How to improve your design

### Step 6: Try Again
Experiment with different combinations to master survival!

---

## 🧠 Educational Concepts

This app teaches:

| Concept | Description |
|---------|-------------|
| **Adaptation** | How organisms evolve traits suited to their environment |
| **Energy Sources** | Photosynthesis, chemosynthesis, and thermal energy |
| **Environmental Factors** | Temperature, atmosphere, and radiation effects on life |
| **Cell Biology** | Simple vs. complex cell advantages |
| **Protective Structures** | How body structures protect against hazards |

---

## 📁 Project Structure

```
alien-biology-builder/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # Game logic and simulation
├── README.md           # This file
├── LICENSE             # MIT License
├── .gitignore          # Git ignore rules
└── assets/             # Future assets folder
    └── (images, etc.)
```

---

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Animations, gradients, flexbox, grid
- **JavaScript (ES6+)** - Game logic, no frameworks required
- **Emoji Graphics** - No external image dependencies

---

## 🎨 Design Features

### Visual Effects
- 🌌 Animated nebula background
- ✨ Twinkling stars
- 🪐 Floating planets
- 💫 Rising particle effects
- 🔮 Neon glow on all UI elements
- 📊 Animated score meter
- 👾 Bioluminescent alien preview

### Color-Coded Feedback
| Score Range | Color | Meaning |
|-------------|-------|---------|
| 1-3 | 🔴 Red | Critical failure |
| 4-6 | 🟡 Yellow | Partial survival |
| 7-10 | 🟢 Green | Strong survival |

---

## 🔧 Customization

### Change Difficulty
Edit `script.js` and modify the scoring logic in `calculateSurvival()`:

```javascript
// Make it harder (lower base score)
let score = 3; // was 5

// Make it easier (higher base score)
let score = 7; // was 5
```

### Add New Environments
Add options in `index.html` and update the logic in `script.js`:

```javascript
// In displayNames object
temperature: {
    cold: "❄️ Cold",
    moderate: "🌤️ Moderate",
    extreme: "🔥 Extreme Heat",
    // Add your own:
    freezing: "🧊 Absolute Zero"
}
```

### Customize Alien Emojis
Edit the `alienEmojis` array in `script.js`:

```javascript
const alienEmojis = ['👽', '👾', '🤖', '👻', '💀', '🎃', '👹', '👺'];
```

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 13+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |
| Opera | 65+ | ✅ Full Support |

---

## 🚀 Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Alien Biology Builder"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/alien-biology-builder.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Select **main** branch and **/(root)** folder
   - Click **Save**

3. **Access your app:**
   - Your app will be live at: `https://YOUR_USERNAME.github.io/alien-biology-builder/`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Issues & Feedback

Found a bug or have a suggestion? Please:
- Open an issue on the [Issues page](https://github.com/YOUR_USERNAME/alien-simulator/issues)
- Include your browser and OS version
- Describe the problem and steps to reproduce

---

## 📚 References & Inspiration

- **Project Hail Mary** by Andy Weir - Inspiration for the space biology theme
- **Astrobiology** - NASA's research on life in extreme environments
- **Evolution Games** - Spore, Cell Lab, and similar educational games

---

## 👨‍💻 Author

Created as an educational tool to make biochemistry and adaptation fun and accessible for students.

---

## 🌟 Acknowledgments

- Thanks to all educators who make science accessible
- Inspired by the amazing work of astrobiologists worldwide
- Built with ❤️ for curious minds everywhere

---

<div align="center">

**🪐 Happy Exploring! May your aliens always survive! 👽**

</div>

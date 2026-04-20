
# 🍽️ FoodWise - AI-Powered Food Analysis App

> Analyze meals, ingredients, and nutrition instantly using AI vision & voice recognition

</div>

---

## ✨ Overview

**FoodWise** is an intelligent food analysis application that helps users understand their meals in real-time using Google's Gemini AI. Whether you're taking a photo of your plate, scanning a nutrition label, or logging food via voice - FoodWise provides instant nutritional insights, allergen detection, and dietary compatibility checks.

**Perfect for:**
- 🎯 Health-conscious users
- 💪 Fitness enthusiasts  
- 🏥 People with allergies/dietary restrictions
- 📊 Nutrition tracking

---

## 🚀 Features

### Core Functionality
- **📸 Meal Photo Analysis** - Identify food, estimate portions, calculate calories & macros
- **📋 Label OCR Scanning** - Extract nutritional data from ingredient labels automatically
- **🎤 Voice Logging** - Describe meals verbally for quick analysis
- **⚠️ Allergen Detection** - Identifies common allergens (gluten, dairy, nuts, etc.)
- **✅ Dietary Filters** - Check compatibility: Vegan, Gluten-Free, Diabetic-Safe

### User Experience
- 🌙 Dark/Light mode toggle with system preference detection
- 📱 Full responsive design (mobile-first)
- ⚡ Smooth animations with Motion framework
- 📜 Persistent history of analyses
- ⚙️ Customizable settings menu

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Modern UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Motion** | Smooth animations |
| **Google Gemini AI** | Vision & NLP analysis |
| **Lucide React** | Beautiful icons |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- Google Gemini API key ([get free API key](https://ai.google.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wassim-chouayakh/foodwise.git
   cd foodwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Then edit .env.local and add your Gemini API key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build        # Create optimized build
npm run preview      # Preview production build locally
npm run lint         # Type-check with TypeScript
npm run clean        # Clean dist folder
```

---

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── CameraCapture.tsx      # Camera input handler
│   ├── VoiceInput.tsx         # Voice recording component
│   ├── AnalysisDisplay.tsx    # Results visualization
│   ├── HistoryView.tsx        # Previous analyses
│   └── SettingsMenu.tsx       # User preferences
├── services/            # Business logic & API calls
│   └── gemini.ts              # Gemini AI integration
├── lib/                 # Utilities & helpers
│   └── utils.ts               # Common functions
├── types.ts             # TypeScript interfaces
├── App.tsx              # Main application component
└── main.tsx             # Entry point
```

---

## 🔑 Key Interfaces

### FoodAnalysisResult
```typescript
{
  itemName: string;           // e.g., "Grilled Salmon with Rice"
  portionEstimate: string;    // e.g., "medium portion"
  nutrition: {
    calories: number;         // Total calories
    protein: number;          // Grams
    carbs: number;            // Grams
    fat: number;              // Grams
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  allergens: {
    detected: string[];       // e.g., ["Fish", "Sesame"]
    warnings: string[];
    suitability: {
      glutenFree: boolean;
      vegan: boolean;
      diabeticSafe: boolean;
    };
  };
  summary: string;            // Detailed analysis
}
```

---

## 🎨 Screenshots & Demo

*Demo GIF coming soon - feature in action*

---

## 🔐 Security & Privacy

- ✅ API keys stored in `.env.local` (never committed)
- ✅ No data stored on external servers (Gemini API only)
- ✅ All processing happens client-side when possible
- ✅ History stored locally in browser (localStorage)

---

## 📚 How It Works

1. **Capture/Input**: User provides meal via camera, label image, or voice description
2. **Send to Gemini AI**: Image/text sent to Google's Gemini API with structured analysis prompt
3. **Structured Output**: Gemini returns JSON with nutrition & allergen data
4. **Display Results**: App presents findings with visual breakdown
5. **Save to History**: Analysis saved locally for future reference

---

## 🚧 Future Enhancements

- [ ] Backend database for account sync
- [ ] Meal plan recommendations
- [ ] Barcode scanning integration
- [ ] Export reports (PDF/CSV)
- [ ] Social sharing & comparisons
- [ ] Macro calculator & custom goals

---

## 💡 Learning Highlights

This project demonstrates proficiency in:
- ✅ React hooks & state management
- ✅ TypeScript for type-safe code
- ✅ External API integration (Gemini)
- ✅ Modern build tools (Vite)
- ✅ Responsive UI design
- ✅ Real-world problem solving

---

## 📞 Contact

**Wassim Chouayakh**
- 🔗 LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/wassim-chouayakh-174534178/)
- 📧 GitHub: [GitHub Profile](https://github.com/wassim-chouayakh)

---

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by Wassim Chouayakh**

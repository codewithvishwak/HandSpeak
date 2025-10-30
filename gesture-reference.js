// 🖐️ HANDSPE AK - COMPLETE GESTURE REFERENCE GUIDE
// This file provides a comprehensive mapping of all supported gestures

const GESTURE_REFERENCE = {
  // ===== BASIC COMMUNICATION GESTURES =====
  basicCommunication: {
    "Thank you": {
      fingerPattern: [1, 1, 1, 1, 1],
      description: "All five fingers extended upward",
      useCase: "Expression of gratitude",
      difficulty: "Easy"
    },
    "I love you": {
      fingerPattern: [1, 1, 0, 0, 1],
      description: "Thumb, index, and pinky extended; middle and ring curled",
      useCase: "Affection",
      difficulty: "Easy"
    },
    "Hello": {
      fingerPattern: [0, 1, 1, 1, 1],
      description: "All fingers except thumb extended",
      useCase: "Greeting",
      difficulty: "Easy"
    },
    "Goodbye": {
      fingerPattern: [0, 0, 0, 0, 1],
      description: "Only pinky finger extended",
      useCase: "Farewell",
      difficulty: "Easy"
    },
    "Yes": {
      fingerPattern: [1, 0, 0, 0, 0],
      description: "Only thumb extended upward",
      useCase: "Affirmation",
      difficulty: "Very Easy"
    },
    "No": {
      fingerPattern: [0, 1, 1, 0, 0],
      description: "Index and middle fingers extended in V-shape",
      useCase: "Negation",
      difficulty: "Easy"
    }
  },

  // ===== MEDICAL & EMERGENCY GESTURES =====
  medicalSigns: {
    "Emergency": {
      fingerPattern: [0, 1, 1, 0, 1],
      description: "Index, middle, and pinky extended",
      useCase: "Critical situation requiring immediate help",
      difficulty: "Medium"
    },
    "Call doctor": {
      fingerPattern: [1, 0, 0, 1, 1],
      description: "Thumb, ring, and pinky extended",
      useCase: "Request medical professional",
      difficulty: "Medium"
    },
    "Medicine": {
      fingerPattern: [1, 1, 0, 1, 0],
      description: "Thumb, index, and ring extended",
      useCase: "Need medication",
      difficulty: "Medium"
    },
    "Hospital": {
      fingerPattern: [0, 0, 1, 1, 1],
      description: "Middle, ring, and pinky extended",
      useCase: "Facility/hospitalization",
      difficulty: "Medium"
    },
    "Pain": {
      fingerPattern: [0, 1, 0, 1, 1],
      description: "Index, ring, and pinky extended",
      useCase: "Indicating discomfort",
      difficulty: "Medium"
    },
    "Cant breathe": {
      fingerPattern: [0, 0, 1, 1, 0],
      description: "Middle and ring fingers extended",
      useCase: "Respiratory distress",
      difficulty: "Hard"
    },
    "Need injection": {
      fingerPattern: [0, 0, 0, 0, 0],
      description: "Closed fist",
      useCase: "Medical treatment",
      difficulty: "Very Easy"
    }
  },

  // ===== ALPHABET (A-Z) =====
  alphabet: {
    "Letter A": { fingerPattern: [1, 0, 0, 0, 0], description: "Fist with thumb on side" },
    "Letter B": { fingerPattern: [0, 1, 1, 1, 1], description: "Four fingers extended" },
    "Letter C": { fingerPattern: [1, 0, 0, 0, 0], description: "C-shape hand" },
    "Letter D": { fingerPattern: [1, 1, 0, 0, 0], description: "Index up, thumb on side" },
    "Letter E": { fingerPattern: [1, 1, 1, 1, 1], description: "All fingers slightly curved" },
    "Letter F": { fingerPattern: [0, 1, 1, 1, 1], description: "Four fingers, thumb touches" },
    "Letter G": { fingerPattern: [1, 1, 0, 0, 0], description: "Index to side" },
    "Letter H": { fingerPattern: [0, 1, 1, 0, 0], description: "Index and middle extended" },
    "Letter I": { fingerPattern: [0, 0, 0, 0, 1], description: "Pinky only" },
    "Letter J": { fingerPattern: [0, 0, 0, 0, 1], description: "Pinky curled in J-shape" },
    "Letter K": { fingerPattern: [1, 1, 1, 0, 0], description: "V-shape on hand" },
    "Letter L": { fingerPattern: [1, 1, 0, 0, 0], description: "L-shape (thumb and index)" },
    "Letter M": { fingerPattern: [1, 0, 1, 1, 0], description: "Three fingers pointing down" },
    "Letter N": { fingerPattern: [1, 1, 0, 0, 0], description: "Two fingers pointing down" },
    "Letter O": { fingerPattern: [1, 1, 1, 1, 1], description: "Circular O-shape" },
    "Letter P": { fingerPattern: [0, 1, 1, 0, 0], description: "Two fingers down (P-shape)" },
    "Letter Q": { fingerPattern: [1, 1, 0, 0, 1], description: "Q-shape" },
    "Letter R": { fingerPattern: [0, 1, 1, 0, 0], description: "Crossed fingers" },
    "Letter S": { fingerPattern: [0, 0, 0, 0, 0], description: "Closed fist" },
    "Letter T": { fingerPattern: [1, 0, 0, 0, 0], description: "T-position" },
    "Letter U": { fingerPattern: [0, 1, 1, 0, 0], description: "U-shape" },
    "Letter V": { fingerPattern: [0, 1, 1, 0, 0], description: "V-peace sign" },
    "Letter W": { fingerPattern: [0, 1, 1, 1, 0], description: "W-shape" },
    "Letter X": { fingerPattern: [1, 0, 0, 0, 0], description: "X-shape" },
    "Letter Y": { fingerPattern: [1, 0, 0, 0, 1], description: "Y-shape" },
    "Letter Z": { fingerPattern: [0, 1, 0, 0, 0], description: "Z-shape" }
  },

  // ===== NUMBERS (1-10) =====
  numbers: {
    "Number 1": { fingerPattern: [0, 1, 0, 0, 0], description: "Index only" },
    "Number 2": { fingerPattern: [0, 1, 1, 0, 0], description: "Index and middle" },
    "Number 3": { fingerPattern: [0, 1, 1, 1, 0], description: "Index, middle, ring" },
    "Number 4": { fingerPattern: [0, 1, 1, 1, 1], description: "Four fingers" },
    "Number 5": { fingerPattern: [1, 1, 1, 1, 1], description: "All fingers extended" },
    "Number 6": { fingerPattern: [1, 0, 1, 1, 1], description: "All except index" },
    "Number 7": { fingerPattern: [1, 1, 0, 1, 1], description: "All except middle" },
    "Number 8": { fingerPattern: [1, 1, 1, 0, 1], description: "All except ring" },
    "Number 9": { fingerPattern: [1, 1, 1, 1, 0], description: "All except pinky" },
    "Number 10": { fingerPattern: [0, 0, 0, 0, 0], description: "Closed fist" }
  }
};

// Function to get gesture info
function getGestureInfo(gestureName) {
  for (const category in GESTURE_REFERENCE) {
    if (GESTURE_REFERENCE[category][gestureName]) {
      return {
        name: gestureName,
        ...GESTURE_REFERENCE[category][gestureName]
      };
    }
  }
  return null;
}

// Function to list all gestures in a category
function listGesturesByCategory(category) {
  return GESTURE_REFERENCE[category] ? Object.keys(GESTURE_REFERENCE[category]) : [];
}

// Function to get random gesture for practice
function getRandomGesture() {
  const allCategories = Object.values(GESTURE_REFERENCE).flat();
  const randomIndex = Math.floor(Math.random() * allCategories.length);
  return allCategories[randomIndex];
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GESTURE_REFERENCE, getGestureInfo, listGesturesByCategory, getRandomGesture };
}
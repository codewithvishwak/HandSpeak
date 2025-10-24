# 🖐️ SignToSpeak

**SignToSpeak** is a web-based application designed to assist individuals with speech disabilities in communicating effectively through **sign language**.  
By utilizing a webcam or touchscreen, users can input sign language gestures, which are then converted into **text** and the text into **speech output**.

---

## ✨ Features
- **Gesture Recognition**: Input sign language gestures using a webcam or touchscreen.  
- **Speech Output**: Converts recognized gestures into spoken words.  
- **User-Friendly Interface**: Clean design, simple navigation, and accessibility in mind.  

---

## 🛠️ Technology Stack
- **Frontend**:  
  - HTML5  
  - CSS3  
  - JavaScript  

- **Libraries / Frameworks**:  
  - [OpenCV](https://opencv.org/) – for computer vision tasks (image preprocessing, cropping, etc.)  
  - [Mediapipe](https://developers.google.com/mediapipe) – for hand tracking and landmarks detection  
  - [cvzone](https://github.com/cvzone/cvzone) – wrapper for Mediapipe to simplify hand detection  
  - [NumPy](https://numpy.org/) – efficient array and image operations  
  - [gTTS](https://pypi.org/project/gTTS/) – for text-to-speech conversion  

---

## ⚙️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/codewithvishwak/SignToSpeak.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SignToSpeak
   ```

3. For the web app (frontend only):
   - Simply open `index.html` in your web browser.

4. For Python-based sign data collection / model training:
   - Install dependencies:
   ```bash
   pip install opencv-python cvzone mediapipe numpy gTTS
   ```

   - Run the script:
   ```bash
   python hand_data.py
   ```

### ▶️ Usage
- Allow access to your webcam when prompted.
- Perform sign language gestures in front of the camera.
- The application will:
  - Detect the gesture
  - Convert it into text
  - Speak it out using speech synthesis

---

## 📊 Project Structure
```
SignToSpeak/
├── Data/                 # Folder for collected sign images
│   └── Hello/            # Example sign dataset
├── hand_data.py          # Python script for collecting hand images
├── index.html            # Web app frontend
├── style.css             # CSS styles
├── script.js             # JavaScript logic
└── README.md             # Project documentation
```

---

## 🤝 Contributing
Contributions are welcome! 🎉  
If you would like to contribute to this project:
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## Acknowledgments
Special thanks to all contributors and supporters of this project.  
Inspired by the need for better communication tools for individuals with speech disabilities.

---

## 📬 Contact
For any inquiries, suggestions, or feedback:
- Email: yellamallivishwak1@gmail.com  
- GitHub: https://github.com/codewithvishwak
- LinkedIn: www.linkedin.com/in/vishwak-yellamalli-a0686428b

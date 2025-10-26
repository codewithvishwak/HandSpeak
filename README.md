# 🖐️ HandSpeak

**HandSpeak** is an AI-powered web application that bridges communication gaps between individuals with speech disabilities and the hearing community through **real-time sign language recognition and translation**.

Using advanced gesture recognition technology, HandSpeak converts sign language into **text** and generates **natural speech output**, making communication seamless and accessible for everyone.

---

## ✨ Features

- **🎥 Real-time Hand Detection**: Captures and analyzes hand gestures using MediaPipe with high accuracy
- **🔍 AI-Powered Gesture Recognition**: Recognizes 20+ sign language gestures instantly
- **💬 Text Conversion**: Converts recognized hand signs into clear, readable text
- **🔊 Speech Synthesis**: Generates natural voice output for spoken communication
- **👥 Multi-User Support**: User authentication with email verification and OAuth integration
- **🔐 Secure Authentication**: Password reset with OTP verification via email
- **📧 Contact & Feedback System**: Professional email notifications for user inquiries
- **🌍 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **⚡ Fast & Lightweight**: Optimized performance with no lag or latency
- **🎨 Modern UI/UX**: Beautiful gradient interfaces with smooth animations
- **🌟 Galaxy Theme**: Stunning animated background with twinkling stars and visual effects

---

## 🛠️ Technology Stack

### **Frontend**
- **HTML5** - Semantic markup structure
- **CSS3** - Advanced styling with gradients and animations
- **JavaScript (Vanilla)** - No dependencies for core functionality
- **MediaPipe Hands** - Hand tracking and landmark detection
- **Canvas API** - Real-time gesture visualization

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Nodemailer** - Email service integration
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcryptjs** - Password hashing and encryption

### **Database & Storage**
- **In-Memory Storage** - User data management (MongoDB ready)
- **dotenv** - Environment variable management

### **APIs & OAuth**
- **Google OAuth 2.0** - Google account authentication
- **GitHub OAuth** - GitHub account login
- **Facebook Login** - Facebook authentication
- **LinkedIn OAuth** - Professional network sign-in
- **Gmail SMTP** - Email service provider

### **Libraries**
- **axios** - HTTP client for API calls
- **cors** - Cross-Origin Resource Sharing
- **MediaPipe Drawing Utils** - Hand landmark visualization

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser with camera access
- Gmail account with App Password enabled

### **1. Clone the Repository**
```bash
git clone https://github.com/codewithvishwak/HandSpeak.git
cd HandSpeak
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory:
```plaintext
JWT_SECRET=your-jwt-secret-key-here

# Email Configuration (Gmail SMTP)
EMAIL_USER=handspeakcompany@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Server Port
PORT=5000
```

### **4. Start the Server**
```bash
npm start
```

The server will run on `http://localhost:5000`

### **5. Open in Browser**
```
http://localhost:5000/landing.html
```

---

## 📊 Project Structure
```
HandSpeak/
├── public/                 # Static assets
│   └── image/             # Logo and images
├── landing.html           # Landing page
├── landing.css            # Landing page styles
├── landing.js             # Landing page animations
├── index.html             # Main application page
├── style.css              # Application styles
├── script.js              # Hand detection & gestures
├── login.html             # Login/Registration page
├── login.css              # Login styles
├── login.js               # OAuth & authentication
├── server.js              # Express backend server
├── package.json           # Project dependencies
├── .env                   # Environment variables
└── README.md              # Project documentation
```

---

## ▶️ Usage Guide

### **1. Landing Page**
- View project information and features
- Click "Start Now" to proceed to login

### **2. Authentication**
- **Sign Up**: Create account with email/password
- **Sign In**: Login with credentials
- **OAuth**: Use Google, GitHub, Facebook, or LinkedIn
- **Password Reset**: Use OTP sent via email

### **3. Gesture Recognition**
1. Click **"▶ Start Translating"** button
2. Allow camera access when prompted
3. Position your hand in the camera frame
4. Make sign language gestures
5. The app will display recognized text and speak it aloud
6. Click **"⏹ Stop Translating"** to stop detection

### **4. Supported Gestures**
- ✋ **Thank you** - All fingers extended
- 🤟 **I love you** - Thumb, index, pinky extended
- ☮️ **Peace** - Index & middle fingers extended
- 👍 **Yes** - Thumb up
- 🤙 **Call me** - Pinky finger extended
- 👌 **OK** - Thumb, index, middle extended
- 🆘 **Help** - Index, middle, ring, pinky extended
- 🖖 **Spock** - Thumb, index, middle, ring extended
- And more...

### **5. Contact & Feedback**
- Navigate to **Contact Us** section
- Fill in name, email, and message
- Submit to send feedback to support team

---

## 🔐 Security Features

✅ **Password Encryption** - bcryptjs hashing  
✅ **JWT Authentication** - Secure token-based sessions  
✅ **OTP Verification** - Email-based password reset  
✅ **CORS Protection** - Cross-origin request security  
✅ **Email Validation** - Verified communication channels  
✅ **OAuth 2.0** - Industry-standard authentication  

---

## 📧 Email Configuration

### **Gmail App Password Setup**
1. Enable 2-Factor Authentication on Gmail
2. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste into `.env` file as `EMAIL_PASSWORD`

### **Email Types**
- ✉️ OTP Password Reset
- ✉️ Contact Form Submissions
- ✉️ User Confirmation Messages

---

## 🤝 Team & Contributors

| Name | Role | LinkedIn |
|------|------|----------|
| 👨‍💻 **Vishwak Yellamalli** | Full Stack Developer & UI/UX Designer | [LinkedIn](https://www.linkedin.com/in/vishwak-yellamalli-a0686428b) |
| 🛠️ **Kush Vora** | Backend Developer | - |
| ⚙️ **Sairaj Walawalkar** | Backend Developer | - |
| 🔧 **Karthik Yadav** | Backend Developer | - |

---

## 🎯 Future Enhancements

- [ ] Machine learning model for improved gesture accuracy
- [ ] Support for more sign languages (ASL, ISL, BSL)
- [ ] Real-time video translation
- [ ] Mobile app development
- [ ] Offline mode capability
- [ ] Community gesture library
- [ ] Advanced analytics dashboard
- [ ] Multi-language speech output

---

## 📝 License

This project is open-source and available under the MIT License.


---

## 📬 Contact & Support

For inquiries, suggestions, or bug reports:

- 📧 **Email**: handspeakcompany@gmail.com
- 🌐 **Website**: [handspeak.com](https://handspeak.com)
- 💻 **GitHub**: [codewithvishwak](https://github.com/codewithvishwak)
- 💼 **LinkedIn**: [Vishwak Yellamalli](https://www.linkedin.com/in/vishwak-yellamalli-a0686428b)

---

## ❓ FAQ

**Q: Which browsers are supported?**  
A: Chrome, Firefox, Safari, and Edge with camera support.

**Q: Do I need a GPU for hand detection?**  
A: No, it works on CPU but GPU provides better performance.

**Q: Can I use this offline?**  
A: Currently requires internet for OAuth and email services.

**Q: How accurate is gesture recognition?**  
A: Typically 80-95% accuracy depending on lighting and hand position.

---

**Made with 💙 by the HandSpeak Team**  
*Bridging Communication Gaps, One Gesture at a Time* 🖐🏻

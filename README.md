# Hark: The Ultimate Real-Time Speech-to-Text-to-LLM* 🚀
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

![screenshot of app](https://github.com/us/Hark/blob/main/assets/screenshot1.png)

![chatgpt cheat](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHBkcW11OTBvYjZvZnlpY3libTI1eWJ5a3V3dTR3ZWdoNXNvZjVneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ehgxL0CGDqOtO8MYjv/giphy-downsized-medium.gif)

Hark is your new favorite gadget for turning live audio into text, all while mingling with OpenAI’s GPT-4 for some extra brainpower! Whether you're capturing epic meetings or casual chats, Hark’s got you covered with its slick features and nerdy charm.

# 🌟 Key Features

- **Real-Time Speech-to-Text-to-LLM**: Watch in awe as live audio transforms into text instantaneously thanks to cutting-edge speech recognition.
- **Multi-Language Support**: Speak in your language of choice! Hark supports a ton of languages for flawless transcriptions.
- **Interactive GPT-4 Integration**: Chat with OpenAI’s GPT-4 for smart answers and insights that go beyond mere transcription.
- **Meeting Summarization**: Get concise summaries of your meetings that highlight all the important bits without the fluff.
- **User-Friendly Interface**: Big, friendly buttons for starting, stopping, and clearing recordings—perfect for all levels of tech wizardry.

# 🚀 Getting Started

Gear up and get ready to roll! Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your machine.

## Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/us/hark.git
   cd hark
   ```

2. **Install dependencies:**

   ```bash
   npm install yarn
   yarn
   ```

# 🎧 Usage Guide

## Audio Input Setup

### macOS (OS X)

To capture system audio on macOS, grab BlackHole—a nifty virtual audio driver.

1. **Install BlackHole**: Download and install BlackHole.

2. **Create a Multi-Output Device**:
   - Open Audio MIDI Setup.
   - Hit the + button and choose "Create Multi-Output Device."
   - Add your speakers and BlackHole to this device.
   - Set it as your system audio output.

3. **Set BlackHole as Input**:
   - In Hark, select BlackHole from the audio input device dropdown.

### Windows

We’re working on it! If you know of cool free and open-source alternatives, we’d love your input.

## Run the Application

Fire up your local server with:

```bash
yarn dev
```

Then check out your app at [http://localhost:3000](http://localhost:3000).

# 🔧 Configuration

# 📜 How It Works

1. **Select Audio Device**: Choose BlackHole to capture system sound.
2. **Start Recording**: Hit "Start Recording" to capture and transcribe audio in real-time.
3. **Language Selection**: Pick your preferred language from the dropdown.
4. **Ask GPT-4**: Use "Answer the Latest Question" to get smart responses from GPT-4.
5. **Summarize Meeting**: Click "What’s This Meeting About?" for a quick summary of your discussion.
6. **Stop Recording**: End the session with "Stop Recording."
7. **Clear Results**: Hit "Clear" to reset and prep for the next session.

![Gollum Image](https://media.giphy.com/media/V4uGHRgz0zi6Y/giphy-downsized-large.gif)

# 🔮 Future Features

- **Whisper Integration**: Planning to add Whisper API for even more accurate transcriptions. Note: It's heavy and slow, so our current system is still quicker.
- **More Languages**: Expanding language options to cover even more tongues.
- **React UI Overhaul**: A fresh, React-based UI to make the interface even more user-friendly.
- **Local Speech-to-Text Models**: Offline capabilities so you’re never left hanging.
- **Expanded Model Support**: Additional AI models for broader interaction possibilities.

# 🔍 Final Checklist Before Using Hark

Before you dive into using Hark, make sure you've completed these steps for a seamless experience:

1. **Audio Routing**: Ensure that audio routing is correctly set up with BlackHole (or a similar virtual audio driver). BlackHole captures system audio, allowing Hark to process sound from other applications.
2. **Input Device Configuration**: Verify that BlackHole is selected as the input device within Hark. This ensures the app captures all system sounds accurately.
3. **API Key Setup**: Enter your OpenAI API key in `app.js` to enable GPT-4 interactions.
4. **Model Selection**: Choose the appropriate GPT-4 model for your needs.
5. **Application Testing**: Start listening with Hark, and test by asking questions to ensure everything works as expected.

By following these steps, you ensure that Hark is fully functional and ready to provide a smooth, real-time transcription and interaction experience.

# 🤝 Contributing

Got ideas or want to help out? We’re all ears! Submit a pull request or open an issue to join the fun.

### How this will help you:
- More feedback to fix and improve your project.
- New ideas about your project.
- Greater fame.
- ![SungerBob Image](https://media.giphy.com/media/3o7absbD7PbTFQa0c8/source.gif)

---

_“Sharing knowledge is the most fundamental act of friendship. Because it is a way you can give something without losing something.”_

_**— Richard Stallman**_

## 📜 License
This project is licensed under [GLWTPL](https://github.com/us/hark/blob/master/LICENSE) (GOOD LUCK WITH THAT PUBLIC LICENSE)

## ⚠️ Disclaimer
It is built for educational purposes only. If you choose to use it otherwise, the developers will not be held responsible. Please, do not use it with evil intent.

# 📬 Contact

Questions, suggestions, or just want to chat? Hit us up at [rahmetsaritekin@gmail.com](mailto:rahmetsaritekin@gmail.com).

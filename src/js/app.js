const audioDeviceSelect = document.getElementById('audioDeviceSelect');
const resultElement = document.getElementById('result');
const startBtn = document.getElementById('startBtn');
const animatedSvg = startBtn.querySelector('svg');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const languageSelect = document.getElementById('languageSelect');
const askChatGPTBtn = document.getElementById('askChatGPTBtn');
const summarizeBtn = document.getElementById('summarizeBtn');
const wordCountInput = document.getElementById('wordCountInput');
const chatgptResponse = document.getElementById('chatgptResponse');
const apiKeyInput = document.getElementById('apiKeyInput');
const modelSelect = document.getElementById('modelSelect');

let recognition;
let fullTranscript = ''; // Store full transcript
let recognizing = false; // Flag to track recognition state
let restartTimeout; // Timeout for debouncing recognition restarts

// Load saved state from localStorage
loadState();

// List available audio input devices and populate the dropdown
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'audioinput') {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = `${device.label || 'Unknown Device'} (${device.kind})`;
        audioDeviceSelect.appendChild(option);
      }
    });

    // Restore previously selected device
    const savedDeviceId = localStorage.getItem('audioDeviceId');
    if (savedDeviceId) {
      audioDeviceSelect.value = savedDeviceId;
      setAudioInputDevice(savedDeviceId);
    }
  })
  .catch(err => console.error('Error accessing audio devices:', err));

// Set the selected audio input device and start the speech recognition
audioDeviceSelect.addEventListener('change', () => {
  const selectedDeviceId = audioDeviceSelect.value;
  localStorage.setItem('audioDeviceId', selectedDeviceId);
  setAudioInputDevice(selectedDeviceId);
});

// Configure the audio input device
function setAudioInputDevice(deviceId) {
  const constraints = {
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      const audioTracks = stream.getAudioTracks();
      console.log('Using audio input device:', audioTracks[0].label);

      if (recognition && typeof recognition.stop === 'function') {
        recognition.stop();
      }

      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = languageSelect.value; // Keep the same language setting
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        animatedSvg.classList.remove('hidden');
        recognizing = true;
        console.log('Recording started');
      };

      recognition.onresult = function (event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript.trim();
            fullTranscript += finalTranscript + ' '; // Append to full transcript
          } else {
            interimTranscript += event.results[i][0].transcript; // Capture interim results
          }
        }
        resultElement.innerText = fullTranscript + interimTranscript; // Display interim and final transcripts
        saveState(); // Save state after each result
      };

      recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        if (recognizing && event.error !== 'aborted') {
          restartRecognition();
        }
      };

      recognition.onend = function () {
        if (recognizing) {
          console.log('Speech recognition ended, restarting...');
          restartRecognition();
        } else {
          startBtn.disabled = false;
          stopBtn.disabled = true;
          animatedSvg.classList.add('hidden');
          console.log('Speech recognition stopped');
        }
      };

      recognition.start();
    })
    .catch(err => console.error('Error accessing selected audio input:', err));
}

// Restart the recognition process with a delay to handle pauses
function restartRecognition() {
  clearTimeout(restartTimeout);
  restartTimeout = setTimeout(() => {
    if (recognizing) {
      console.log('Restarting recognition after pause.');
      recognition.start();
    }
  }, 1000); // 1 second delay before restarting
}

// Start recording
function startRecording() {
  recognizing = true;
  const selectedDeviceId = audioDeviceSelect.value;
  setAudioInputDevice(selectedDeviceId);
}

// Stop recording
function stopRecording() {
  recognizing = false;
  clearTimeout(restartTimeout); // Clear any pending restarts
  if (recognition && typeof recognition.stop === 'function') {
    recognition.stop();
  }
}

// Update the language for speech recognition
function updateLanguage() {
  if (recognition) {
    recognition.lang = languageSelect.value;
    console.log(`Language changed to: ${recognition.lang}`);
    saveState(); // Save state when language is changed
  }
}

// Handle ChatGPT interactions
async function askChatGPT(type) {
  const wordCount = parseInt(wordCountInput.value, 10) || 100; // Default to 100 words if not a valid number
  const lastWords = getLastWords(wordCount);

  // Save API key and model selection whenever ChatGPT is called
  localStorage.setItem('apiKey', apiKeyInput.value);
  localStorage.setItem('model', modelSelect.value);

  const apiKey = apiKeyInput.value; // Get the current API key from input
  const model = modelSelect.value; // Get the current model from selection

  let prompt;
  if (type === 'latestQuestion') {
    prompt =
      `You are attending a meeting, and the following transcription has been captured by a speech-to-text system. Some words may be incorrect. Please answer the latest question asked by the interviewer, providing a brief response first, followed by a more detailed explanation if necessary. Here is the text:

      "${lastWords}"

      What is the answer to the latest question?`;
  } else if (type === 'summary') {
    prompt =
      `You are reviewing a transcription of a meeting. The transcription was captured by a speech-to-text system, so some words may be incorrect. Please summarize what the meeting is about, providing a brief overview first, followed by more details if necessary. Here is the text:

      "${lastWords}"

      What is this meeting about?`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Use the stored API key
      },
      body: JSON.stringify({
        model: model, // Use the stored model
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          { "role": "user", "content": prompt }
        ],
        stream: true // Enable streaming
      })
    });

    if (!response.ok) {
      throw new Error(`Error with OpenAI API: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let partialData = '';
    chatgptResponse.innerText = ''; // Clear previous response

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      partialData += decoder.decode(value, { stream: true });

      // Process chunks as they arrive
      const segments = partialData.split('\n');
      partialData = segments.pop(); // Keep incomplete data for next chunk

      for (const segment of segments) {
        if (segment.trim() === '') continue;

        // Check for [DONE] message
        if (segment === 'data: [DONE]') {
          return; // End of stream, exit the loop
        }

        // Parse JSON message
        const jsonSegment = segment.slice(6); // Remove 'data: ' prefix
        try {
          const message = JSON.parse(jsonSegment);
          if (message.choices) {
            const text = message.choices[0].delta?.content || '';
            chatgptResponse.innerText += text; // Append to response
          }
        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
      }
    }
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    chatgptResponse.innerText = 'Failed to get a response from ChatGPT.';
  }
}

// Get the last few words of the transcript
function getLastWords(wordCount) {
  const words = fullTranscript.split(/\s+/);
  return words.slice(-wordCount).join(' ');
}

// Clear results and reset the transcript
function clearResults() {
  fullTranscript = '';
  resultElement.innerText = '';
  chatgptResponse.innerText = '';
  localStorage.removeItem('fullTranscript');
  console.log('Results cleared');
}

// Save the current state to localStorage
function saveState() {
  localStorage.setItem('fullTranscript', fullTranscript);
  localStorage.setItem('language', languageSelect.value);
  localStorage.setItem('wordCount', wordCountInput.value);
  const selectedDeviceId = audioDeviceSelect.value;
  localStorage.setItem('audioDeviceId', selectedDeviceId);
}

// Load the saved state from localStorage
function loadState() {
  const savedTranscript = localStorage.getItem('fullTranscript');
  const savedLanguage = localStorage.getItem('language');
  const savedWordCount = localStorage.getItem('wordCount');
  const savedDeviceId = localStorage.getItem('audioDeviceId');
  const savedApiKey = localStorage.getItem('apiKey'); // Load API key
  const savedModel = localStorage.getItem('model'); // Load model

  if (savedTranscript) {
    fullTranscript = savedTranscript;
    resultElement.innerText = fullTranscript;
  }
  if (savedLanguage) {
    languageSelect.value = savedLanguage;
  }
  if (savedWordCount) {
    wordCountInput.value = savedWordCount;
  }
  if (savedDeviceId) {
    audioDeviceSelect.value = savedDeviceId;
  }
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey; // Set API key input
  }
  if (savedModel) {
    modelSelect.value = savedModel; // Set model select
  }
}

// Initialize event listeners
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
clearBtn.addEventListener('click', clearResults);
languageSelect.addEventListener('change', updateLanguage);
askChatGPTBtn.addEventListener('click', () => askChatGPT('latestQuestion'));
summarizeBtn.addEventListener('click', () => askChatGPT('summary'));

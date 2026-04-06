#  Medical Record Summarizer 

An AI-powered clinical extraction and analysis tool built with the MERN stack. This application securely processes patient medical records, automatically extracts key clinical data, and provides an interactive AI assistant for follow-up questions.

## Features

* **Smart Document Parsing:** Upload PDFs, Word docs, TXT files, or images.
* **Automated Clinical Extraction:** Instantly isolates and formats Diagnosis, Medications, and Follow-Up Plans using Google's Gemini AI.
* **Interactive MedAI Chat:** Ask follow-up, context-aware questions directly against the uploaded patient records.
* **Persistent History Log:** Automatically saves past patient summaries locally in the browser (`localStorage`) for quick retrieval across sessions.
* **100% Client-Side PDF Export:** Generates clean, formatted, text-selectable A4 PDF reports directly from the JSON data using `jsPDF`.
* **Dynamic Dark-Mode UI:** Fully responsive CSS Flexbox/Grid layout built for clinical environments.

##  Tech Stack

* **Frontend:** React.js, Vite, Axios, HTML2Canvas/jsPDF
* **Backend:** Node.js, Express.js, Multer (for file handling)
* **AI Integration:** Google Gemini Pro API
* **Architecture:** Decoupled Client-Server Model

##  Getting Started (Local Development)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/KevinPWilson/AI-Medical-Summarizer.git
cd AI-Medical-Summarizer
\`\`\`

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.
\`\`\`bash
cd backend
npm install
\`\`\`
*Create a `.env` file in the root of the `backend` folder and add your Gemini API key:*
\`\`\`env
GEMINI_API_KEY=your_api_key_here
PORT=5000
\`\`\`
*Start the server:*
\`\`\`bash
node index.js
\`\`\`

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start the Vite development server.
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The application will now be running at `http://localhost:5173`.

---
*Built as a functional prototype for secure, AI-driven medical data parsing.*

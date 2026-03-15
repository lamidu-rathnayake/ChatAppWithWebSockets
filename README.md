# Chat Application with Web Sockets

This project consists of a React frontend and a Python FastAPI backend using WebSockets. 
Follow the instructions below to run both ends of the application locally.

## Prerequisites

- **Node.js**: Required to install packages and run the frontend.
- **Python 3.8+**: Required to run the backend server.

---

## 1. Backend Setup (WebSocket Server)

The backend is built with FastAPI and Uvicorn.

1. Open your terminal or command prompt and navigate to the backend directory:
   ```bash
   cd websocket-server
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **On Windows:**
     ```cmd
     venv\Scripts\activate
     ```
   - **On macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn
   ```

5. Start the backend server:
   ```bash
   python server.py
   ```
   *The backend will start running on `ws://127.0.0.1:8000`. Keep this terminal window open.*

---

## 2. Frontend Setup (React App)

The frontend is built with React and Vite.

1. Open a **new** terminal or command prompt window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The terminal will display a local URL (e.g., `http://localhost:5173/` typically). Open that URL in your web browser to view the chat application.

---

**Lamidu Rathnayak**
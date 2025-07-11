# 🚀 Full Stack Project – Next.js + FastAPI

This is a full-stack web application built using:

- **Frontend**: [Next.js](https://nextjs.org/) (TypeScript + React)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.x)

---

## 📁 Project Structure


project-root/
│
├── frontend/ → Next.js frontend
│ ├── package.json
│ ├── tsconfig.json
│ └── ...
│
├── backend/ → FastAPI backend
│ ├── main.py
│ ├── models.py
│ ├── auth.py
│ ├── database.py
│ ├── test.py
│ ├── requirement.txt
│ └── ...
│
└── README.md



---

## 🖥️ Frontend Setup (Next.js)

### 🔧 Steps:

1. Open terminal and go to the frontend directory:
   ```bash
   cd frontend

2. Install dependencies:
   ```bash
   npm install

3. Start the development server:
    ```bash
   npm run dev

4. Open your browser and visit:
   👉 http://localhost:3000

    
## ⚙️ Backend Setup (FastAPI)

### 🔧 Steps:

1. Open terminal and go to the backend directory:
   ```bash
   cd backend

2. Create a virtual environment:
   ```bash
   python -m venv venv

3. Activate the virtual environment:
   # On Windows
      ```bash
      venv\Scripts\activate
      
  # On macOS/Linux:
      ```bash
      source venv/bin/activate

4. Install the required dependencies:
   ```bash
   pip install -r requirement.txt
   pip install "pydantic[email]"

5. Start the FastAPI development server:
    ```bash
      python -m uvicorn main:app --reload

6. Open your browser and visit:
   👉 http://127.0.0.1:8000
   📘 API Docs: http://127.0.0.1:8000/docs    







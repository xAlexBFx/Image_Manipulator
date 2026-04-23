<img width="2840" height="1471" alt="Screenshot 2026-04-23 074440" src="https://github.com/user-attachments/assets/d2ec13d8-db4b-4a9e-b629-94b591cf12cc" />

<img width="2845" height="1473" alt="Screenshot 2026-04-23 074502" src="https://github.com/user-attachments/assets/19ad0e1b-e791-425c-8c85-2b2bcc7ef674" />

<img width="2847" height="1464" alt="Screenshot 2026-04-23 074535" src="https://github.com/user-attachments/assets/314de4fd-a749-40db-9218-285a8e904d90" />

<img width="2842" height="1463" alt="Screenshot 2026-04-23 074548" src="https://github.com/user-attachments/assets/d249cfcd-e211-4a59-aa4d-ff5940c38312" />

<img width="2839" height="1075" alt="Screenshot 2026-04-23 074611" src="https://github.com/user-attachments/assets/5489328e-1852-48d4-a645-13dad4afee49" />


# ImageBlackBox

A web-based image manipulation application that allows users to perform various image editing operations using a modern, responsive interface.

## Features

- Upload and process images
- Multiple image manipulation operations
- Responsive web interface
- Real-time image preview
- Modern UI built with React and Shadcn UI
- RESTful API backend

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Shadcn UI (Radix UI components)
- Tailwind CSS

### Backend
- Python Flask
- Pillow (PIL) for image processing
- Flask-CORS for cross-origin requests
- Gunicorn for production deployment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xAlexBFx/ImageBlackBox.git
cd ImageBlackBox
```

2. Install server dependencies:
```bash
cd server
pip install -r requirements.txt
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the server:
```bash
cd server
python app.py
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

The application will show you the URL in the console

### Building for Production

1. Build the client:
```bash
cd client
npm run build
```

2. Start the production server:
```bash
cd server
gunicorn app:app
```

## Project Structure

```
imageblackbox/
├── client/              # Frontend React application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── server/             # Backend Flask application
│   ├── app.py         # Main Flask application
│   └── requirements.txt # Backend dependencies
└── README.md          # This file
```

## API Documentation

The backend API provides REST endpoints for image manipulation:

- `POST /api/upload` - Upload an image
- `POST /api/process` - Process image with specified operations
- `GET /api/operations` - Get available image operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

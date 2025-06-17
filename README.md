![Screenshot (21)](https://github.com/user-attachments/assets/2ba5be81-1f34-40ab-b301-a5f8b2510c07)



![Screenshot (23)](https://github.com/user-attachments/assets/23ec5d01-bcdf-4071-8747-e6a22022438e)



![Screenshot (22)](https://github.com/user-attachments/assets/30b4ea78-6a09-4080-b4b7-120fcfde754e)

# Image Manipulator

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
git clone https://github.com/xAlexBFx/Image_Manipulator.git
cd Image_Manipulator
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
image_manipulator/
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

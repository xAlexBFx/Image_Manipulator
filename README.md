![Screenshot (21)](https://github.com/user-attachments/assets/2ba5be81-1f34-40ab-b301-a5f8b2510c07)



![Screenshot (23)](https://github.com/user-attachments/assets/23ec5d01-bcdf-4071-8747-e6a22022438e)



![Screenshot (22)](https://github.com/user-attachments/assets/30b4ea78-6a09-4080-b4b7-120fcfde754e)

# ImageBlackBox

An interactive, web-based image manipulation playground focused on building intuition for *what vision models “see”*.

Most image processing runs **client-side** (Canvas + typed utilities) for instant feedback. A small **optional** Flask API is included under `server/`.

## Features

- Upload an image with drag-and-drop
- RGB channel overrides (set R/G/B channels to chosen values)
- Convolution kernels
  - Presets (Sobel/Scharr, Laplacian, blur, sharpen, LoG, etc.)
  - Custom kernel editing
  - Optional multi-step kernel pipeline (chain multiple kernels)
- Before/after comparisons with sliders
- Download processed output as PNG

## Tech Stack

## Frontend

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- `@tanstack/react-query` (app scaffolding)

## Backend (optional)

- Python Flask
- Pillow (PIL)
- Flask-CORS

## Getting Started

## Prerequisites

- Node.js 16+
- npm

## Run the frontend (recommended)

```bash
cd client
npm install
npm run dev
```

Vite runs on `http://localhost:8080`.

## Optional: Run the Flask API

The UI currently performs processing in the browser, but the repo contains a Flask endpoint you can use for server-side processing.

```bash
cd server
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
pip install flask pillow flask-cors gunicorn
python app.py
```

The server listens on `http://localhost:5000`.

Note: `server/app.py` currently enables CORS for a specific deployed origin. For local development, you may need to adjust the `CORS(...)` origin list.

## Production build (frontend)

```bash
cd client
npm run build
npm run preview
```

## Project Structure

```text
Image_Manipulator/
  client/               # React frontend (Vite)
  server/               # Optional Flask API
    app.py
  README.md
```

## API Documentation (optional backend)

### `POST /api/process-image`

Accepts a multipart form upload and returns a base64 `data:` URL.

- `image` (file)
- `grid_size` (string/int, default `3`)
- `rgb_values` (JSON string, e.g. `{ "red": 0, "green": 0, "blue": 0 }`)
- `kernel_values` (JSON string, e.g. `[[0,-1,0],[-1,5,-1],[0,-1,0]]`)
- `rgb_modified` (`true`/`false`)
- `kernel_modified` (`true`/`false`)

Response:

- `image`: `data:image/png;base64,...`
- plus echo fields like `grid_size`, `rgb_values`, `kernel_values`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

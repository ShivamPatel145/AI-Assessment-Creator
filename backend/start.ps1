# Set environment variable from .env file
$env:GEMINI_API_KEY = "AIzaSyCpZ4OV730AwK53xnHji41BTXyqBriE5BA"

Write-Host "Starting backend with GEMINI_API_KEY set..." -ForegroundColor Green

# Start the dev server
npm run dev

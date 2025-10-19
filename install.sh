# Install dependencies for all components
echo "Installing dependencies for all components..."

# Install root dependencies
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install middleware dependencies
echo "Installing middleware dependencies..."
cd middleware
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "All dependencies installed successfully!"
echo ""
echo "To start the application:"
echo "1. Copy .env.example to .env and configure your environment variables"
echo "2. Make sure MongoDB is running on port 27017"
echo "3. Run 'npm run dev' to start all services"
echo ""
echo "Services will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Middleware API: http://localhost:3001"
echo "- Backend API: http://localhost:5000"
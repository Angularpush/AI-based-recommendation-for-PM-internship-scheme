# PM Internship Scheme Portal

A comprehensive web application for managing internship opportunities under the PM Internship Scheme. The platform connects candidates with organizations through an AI-powered recommendation system.

## Features

### For Candidates
- 🎯 Personalized internship recommendations using AI/ML
- 📋 Easy application management and tracking
- 📊 Dashboard with application statistics
- 🔍 Advanced search and filtering options
- 📱 Responsive design for mobile access

### For Organizations
- 🏢 Internship posting and management
- 👥 Application review and candidate management
- 📈 Analytics and reporting tools
- ⚡ Quick approval/rejection workflows
- 📋 Candidate profile viewing

### For Administrators
- 📊 Comprehensive system analytics
- 👤 User management and verification
- 🔍 Content moderation capabilities
- 📈 Real-time system monitoring
- ⚙️ System configuration options

### Technical Features
- 🤖 AI-powered recommendation engine
- 🔐 JWT-based authentication
- 🎨 Modern React frontend with Tailwind CSS
- 🚀 Node.js/Express backend API
- 🗄️ MongoDB database
- 🐳 Docker containerization
- 📱 Progressive Web App (PWA) support

## Technology Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- CORS enabled

### ML Engine
- Python with Flask
- Scikit-learn for ML algorithms
- NLTK for text processing
- Joblib for model persistence

### Infrastructure
- Docker containers
- Nginx for frontend serving
- Environment-based configuration
- Health checks and monitoring

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9+
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pm-internship-portal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install ML engine dependencies:
```bash
cd ../ml-engine
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Backend configuration (`.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pm-internship
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ML_ENGINE_URL=http://localhost:8000
```

2. ML Engine configuration (`.env`):
```env
PORT=8000
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/pm-internship
JWT_SECRET=your-secret-key
BACKEND_URL=http://localhost:5000
MODEL_PATH=./models/
```

3. Frontend configuration (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_ENGINE_URL=http://localhost:8000
```

### Running the Application

#### Development Mode

1. Start MongoDB:
```bash
mongod
```

2. Start the backend:
```bash
cd backend
npm run dev
```

3. Start the ML engine:
```bash
cd ml-engine
python app.py
```

4. Start the frontend:
```bash
cd frontend
npm start
```

#### Docker Deployment

1. Build all containers:
```bash
docker-compose build
```

2. Start all services:
```bash
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Engine: http://localhost:8000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Internship Endpoints
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create internship (organization)
- `GET /api/internships/:id` - Get internship details
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

### Application Endpoints
- `GET /api/applications` - Get applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id/status` - Update application status

### ML Engine Endpoints
- `POST /api/recommendations` - Get personalized recommendations
- `POST /api/match-score` - Calculate match score
- `POST /api/similar-skills` - Find similar skills
- `GET /api/statistics` - Get system statistics

### Admin Endpoints
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/analytics` - Get analytics data

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String, // 'candidate', 'organization', 'admin'
  status: String, // 'pending', 'approved', 'rejected'
  profile: {
    // Role-specific profile data
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Internships Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  organizationId: ObjectId,
  requirements: [String],
  skills: [String],
  duration: String,
  stipend: Number,
  location: String,
  sector: String,
  status: String, // 'active', 'inactive', 'filled'
  applicationDeadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId,
  internshipId: ObjectId,
  coverLetter: String,
  status: String, // 'pending', 'approved', 'rejected'
  matchScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## AI/ML Features

### Recommendation Engine
- Content-based filtering using candidate profiles and internship requirements
- Collaborative filtering based on application patterns
- Skill matching algorithms
- Location and sector preferences
- Social category considerations

### Match Score Calculation
- Skills similarity (40% weight)
- Education alignment (20% weight)
- Location preference (15% weight)
- Sector alignment (15% weight)
- Social category matching (10% weight)

### Text Processing
- Natural language processing for skill extraction
- Resume parsing and analysis
- Job description keyword extraction
- Similarity scoring using TF-IDF and cosine similarity

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## Performance Optimizations

- Database indexing for frequently queried fields
- Caching mechanisms for recommendations
- Pagination for large datasets
- Lazy loading for images and components
- Code splitting for frontend bundles

## Monitoring and Logging

- Health check endpoints
- Structured logging with Winston
- Error tracking and reporting
- Performance metrics collection
- Real-time system monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and queries, please contact:
- Email: support@pminternship.gov.in
- Phone: 1800-XXX-XXXX
- Help Desk: Available Monday-Friday, 9 AM - 6 PM IST

## Acknowledgments

- Government of India for the PM Internship Scheme initiative
- All contributors and supporters
- Open source community for the amazing tools and libraries
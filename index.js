const express = require('express');
const cors = require('cors');
const habitRoutes = require('./routes/HabitRoutes');
const database = require('./database/database');
require('dotenv').config()

const app = express();
const port = 8000;

// CORS Configuration
// app.use(cors({
//   // origin: 'https://66c95d259d77677365ca965d--zesty-kitten-96034b.netlify.app',
//   origin: '*',

//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// Middleware to handle preflight requests
// app.options('*', cors());

const corsOptions = {
  origin: ['http://localhost:3000', 'https://66c95d259d77677365ca965d--zesty-kitten-96034b.netlify.app'], 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1', habitRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('You are in the root directory');
});

// Connect to the database
database.connect();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

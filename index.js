const express = require('express');
const app = express();
const database = require('./database/database');
const habitRoutes = require('./routes/HabitRoutes');
const cors=require('cors')
const path = require('path');


const allowedOrigins = [
  'http://localhost:3000', // Development URL
  'https://habittrackerbylalit-iwpkr4j2a-lalits-projects-550a0518.vercel.app', // Production URL
]

const PORT = 4000;

app.use(
  cors({   
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
      credentials:true
  })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/v1/', habitRoutes);



app.get('/', (req, res) => {
  res.send('You are in the root directory');
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

database.connect();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

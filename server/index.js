const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;

// Sample data points
const points = [
    { "id": 1, "lat": 30.3165, "lng": 78.0322 },
    { "id": 2, "lat": 30.3159, "lng": 78.0335 },
    { "id": 3, "lat": 30.3162, "lng": 78.0329 },
    { "id": 4, "lat": 30.3173, "lng": 78.0336 },
    { "id": 5, "lat": 30.3148, "lng": 78.0341 },
    { "id": 6, "lat": 30.3157, "lng": 78.0319 },
    { "id": 7, "lat": 30.3168, "lng": 78.0311 },
    { "id": 8, "lat": 30.3144, "lng": 78.0326 },
    { "id": 9, "lat": 30.3180, "lng": 78.0331 },
    { "id": 10, "lat": 30.3151, "lng": 78.0339 }
  ]

// Route to get all data points
app.get('/api/points', (req, res) => {
    console.log("sending response")
    res.json(points);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

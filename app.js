const express = require('express');
const app = express();
require('dotenv').config();
const schoolRoutes = require('./routes/schoolRoutes');

app.use(express.json());
// app.use('/api', schoolRoutes);
app.use('/', schoolRoutes);

// Default route for '/'
app.get('/', (req, res) => {
    res.send('Welcome to the School Management API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

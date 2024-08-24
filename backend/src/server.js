const express = require('express');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes')

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


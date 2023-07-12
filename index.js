const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
// const config = require('config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
// const PORT = process.env.PORT || config.get('port') || 8080;
// const mongoUri = config.get('mongoUri');
const mongoUri = process.env.mongoUri;
const authRouter = require('./routers/AuthRouter');
const userRouter = require('./routers/UserRouter');
const truckRouter = require('./routers/TruckRouter');
const loadRouter = require('./routers/LoadRouter');

app.use(cors());
app.use(express.json({extended: true}));
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);
app.use('/api/users/me', userRouter);
app.use('/api/trucks', truckRouter);
app.use('/api/loads', loadRouter);

// app.use('/', express.static(path.join(__dirname, "/client/build")));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await mongoose.connect(mongoUri);

    app.listen(PORT, () => {
      console.log(`Server is starting on port ${PORT}...`);
    });
  } catch (e) {
    console.log(`server error ${e.message}`);
    process.exit(1);
  }
};

start();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const usersRoutes = require('./routes/users');
const scorecardRoutes = require('./routes/scorecards');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB CONNECTED')).catch((err) => console.log('DB Connection Error', err));

app.use(cors({ origin: true, credentials: true }));

app.use('/api/users', usersRoutes);

app.use('/api/scorecards', scorecardRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on ${port}`));

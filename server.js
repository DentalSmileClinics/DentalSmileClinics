require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

// Import routes
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'brightsmile_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Make session messages available in views (flash messages alternative)
app.use((req, res, next) => {
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    res.locals.active_form = req.session.active_form;
    res.locals.new_temp_password = req.session.new_temp_password;
    res.locals.user_name = req.session.user_name;
    
    // Clear them after passing to views
    delete req.session.error;
    delete req.session.success;
    delete req.session.active_form;
    delete req.session.new_temp_password;
    
    next();
});

// Routes
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

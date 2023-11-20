//Imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const PORT = process.env.PORT || 3000;
const path = require('path');
const ExpressError = require('./utils/ExpressError'); 

const campgrounds = require('./routes/campgrounds');  //import campgrounds route
const reviews = require('./routes/reviews'); //import reviews route

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp'); //connecting to the database

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connection established');
});

app.engine('ejs', ejsMate);

const sessionConfig = {
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//middlewares setup
app.use(session(sessionConfig));  //using session() middleware to store the user's session

app.use(flash());  //using connect-flash() middleware to store flash messages in the session store.

app.use(express.static(path.join(__dirname, 'public')));  //using static() middleware to serve static files.

app.use((req, res, next) => {  //Setting up a middleware to add local variables to the response object that we can access in all our views templates.
    res.locals.success = req.flash('success');  //Assigning the success flash message to the response.locals object.
    res.locals.error = req.flash('error');  //Assigning the error flash message to the response.locals object.
    next(); //next() is the next middleware in the middleware chain.
});

app.use(methodOverride('_method'));  //using methodOverride() middleware to parse the request method.

app.use(express.urlencoded({ extended: true }));  //using express.urlencoded() middleware to parse the request body.

app.use('/campgrounds', campgrounds); // using campgrounds route as middleware.
app.use('/campgrounds/:id/reviews', reviews); // using reviews route as middleware.

app.set('view engine', 'ejs'); //Setting EJS as the view engine.
app.set('views', path.join(__dirname, 'views')); //Setting the views folder as the view


app.get('/', (req, res) => {
    res.render('campgrounds/home');
});

//error handling middleware when a route is not found. This will throw an error based on our pre-defined error class which extends the Error class.
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
});

//catch-all error handling middleware. This will handle all the errors that has been thrown by all our previous error handling middleware that has called 'next(err)'. This is the last error handling middleware in the chain of our error handling middlewares.
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
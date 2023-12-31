//Imports
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const PORT = process.env.PORT || 3000;
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const campgroundsRoutes = require('./routes/campgrounds');  //import campgrounds route
const reviewsRoutes = require('./routes/reviews'); //import reviews route
const userRoutes = require('./routes/user'); //import user-routes route
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp_camp';

mongoose.connect(dbUrl); //connecting to the database

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connection established');
});

app.engine('ejs', ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, //time in seconds
    crypto: {
        secret: 'Super secret secret'
    }
});

store.on('error', function(error){
    console.log('SESSION STORE ERROR', error);
})

const sessionConfig = {
    store,
    name: 'yelp.session',
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true  //ensures that our cookies are only configured, stored and accesed over https only
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//middlewares setup
app.use(session(sessionConfig));  //using session() middleware to store the user's session

app.use(flash());  //using connect-flash() middleware to store flash messages in the session store.

app.use(express.static(path.join(__dirname, 'public')));  //using static() middleware to serve static files.

app.use(passport.initialize());  //using passport.initialize() middleware to initialize passport.

app.use(passport.session());  //using passport.session() middleware to store the user's session in the session store.

app.use(mongoSanitize()); //Using monog sanitize middleware to sanitize received inputs and remove any offending keys or replace the characters with a 'safe' one for our mongo database.

//Helmet security configs
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls]
    },
  })
);

passport.use(new LocalStrategy(User.authenticate())); //Setting passport to use the local strategy and setting the authentication method for local strategy to be the static method/function 'authenticate' on our User model. This method is added in our user model automatically when we wrote this - "userSchema.plugin(passportLocalMongoose);"

passport.serializeUser(User.serializeUser()); //Specify a function to passport to determine how we want to store a user object in the session. The function we specify is a static method on our User model that was passed in by calling - "userSchema.plugin(passportLocalMongoose);"

passport.deserializeUser(User.deserializeUser());
//Specify a function to passport to determine how we want to retrieve a user object in the session."

app.use((req, res, next) => {  //Setting up a middleware to add local variables to the response object that we can access in all our views templates.
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user; //
    res.locals.success = req.flash('success');  //Assigning the success flash message to the response.locals object.
    res.locals.error = req.flash('error');  //Assigning the error flash message to the response.locals object.
    next(); //next() is the next middleware in the middleware chain.
});

app.use(methodOverride('_method'));  //using methodOverride() middleware to parse the request method.

app.use(express.urlencoded({ extended: true }));  //using express.urlencoded() middleware to parse the request body.

app.use('/campgrounds', campgroundsRoutes); // using campgrounds route as middleware.
app.use('/campgrounds/:id/reviews', reviewsRoutes); // using reviews route as middleware.
app.use('/', userRoutes); //using user-routes route as middleware.

app.set('view engine', 'ejs'); //Setting EJS as the view engine.
app.set('views', path.join(__dirname, 'views')); //Setting the views folder as the view

//Home Route
app.get('/', (req, res) => {
    res.render('home');
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
# YelpCamp

YelpCamp is a full-stack web application that allows users to create and review campgrounds. To engage with the platform, users need to create an account.
This project was developed as part of Colt Steele's web development course on Udemy.

## Technologies Used

  1. [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
  2. [Express](https://expressjs.com//) - Fast, unopinionated, minimalist web framework for Node.js.
  3. [MongoDB](https://www.mongodb.com/) - The database for modern applications.
  4. [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modelling for Node.js.
  5. [Bootstrap](https://getbootstrap.com/) - Powerful, extensible, and feature-packed frontend toolkit.
  6. [Helmet.js](https://helmetjs.github.io/) - Open source JavaScript library that helps secure Node.js applications by setting several HTTP response headers.
  7. [Passport.js](https://www.passportjs.org/) - Simple, unobtrusive authentication for Node.js.
  8. [EJS](https://ejs.co/) - Simple templating language that lets you generate HTML markup with plain JavaScript.

## Features

* Users can create an account by registering and can login and logout.
* Users can view all/individual campgrounds without being logged in.
* Users can create, edit and delete campgrounds but must first be logged in.
* Users can upload and delete single/multiple images on a campground but must first be logged in.
* Users can write reviews and ratings on any campground.
* Campground reviews can be created, edited, or removed by users who authored or created them.
* Users can view all campgrounds and their location on the map on the campgrounds page.
* Users can directly view/visit individual campground pages by clicking on their location on the map.

## Getting Started

### Prerequisites

1. Node.js for running server-side JavaScript. You can find instructions on downloading and installing Node.js for your computer [here](https://nodejs.org/en/download/).
2. MongoDB (Community Edition preferably) to store data. Instructions on downloading and installing MongoDB on your computer can be found [here](https://docs.mongodb.com/manual/installation/).
3. Create a [cloudinary account](https://cloudinary.com/users/register_free) to get an API key, cloudname and secret.

### Installing

Once you have Node.js and MongoDB installed on your computer,

1. Download or clone the project to your computer by running `git clone https://github.com/chuba-cn/YelpCamp.git` on your Git terminal.
2. In the directory of the folder `yelpcamp` containing the files of the repositiory, open up the terminal and run `npm install`.
3. Create a new `.env` file in the root of the project and add the following:

  ```
  CLOUDINARY_CLOUD_NAME='<your_cloudinary_cloud_name>
  CLOUDINARY_KEY='<your_cloudinary_api_key>'
  CLOUDINARY_SECRET='<your_cloudinary_api_secret>'
  DB_URL='<your_mongodb_url>'
  ```

4. Once installation is complete, run `npm start` on the same terminal and run `mongosh` on another terminal to start your mongodb database server.
5. Open your web browser and visit the address <http://localhost:3000> and voila!
6. Sign up to use the awesome features of the app!

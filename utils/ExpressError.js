class ExpressError extends Error{
    constructor(message, statusCode){
        super(); //Invokes the error class constructor
        this.message = message; //sets the message property on the instance of the error class
        this.statusCode = statusCode; //Sets the status code property on the instance of the error class
    }
}

module.exports = ExpressError;
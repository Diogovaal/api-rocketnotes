class AppError extends Error {
   
    message
    statuscode

    constructor(message, statuscode = 400){
        
        super(message)

        this.message= message
        this.statuscode = statuscode

        
    }
}

module.exports = AppError
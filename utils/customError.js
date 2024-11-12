class customError extends Error {
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode
    }
}

class loginError extends Error {
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode
    }
}

const Errors = {
    customError,
    loginError
}

export default Errors;
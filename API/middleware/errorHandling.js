function errorHandling(err, req, res, next) {
    if(err){
        const status = err.status || 500
        res.status(status).json(
            {
                status: status,
                err: 'An error has occurred, please try again'
            }
        )
    }
    next()
}

module.exports = {errorHandling}
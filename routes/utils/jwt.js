const getToken = (req)=> {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    return token
}

module.exports = getToken
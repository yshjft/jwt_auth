const express = require("express")
const router = express.Router();
const {sequelize} = require('../models')
const {checkAccessToken} = require('./middlewares/authenticateAccessToken')

router.get('/:id', checkAccessToken, async (req, res, next) => {
    try {
        const {id} = req.params

        const [users] = await sequelize.query(`select * from users where id = ${id}`)
        const {name,birthYear, birthMonth, birthDate, address, email} = users[0];
        const resBody = {
            id,
            name,
            birth: birthYear+"-"+birthMonth+"-"+birthDate,
            address,
            email
        }

        res.status(200).json(resBody)
    }catch (error) {
        next(error)
    }
})

module.exports = router
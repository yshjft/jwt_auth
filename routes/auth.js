const express = require('express')
const router=  express.Router()
const {User, sequelize} = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const redis = require('./utils/redis')
const getToken = require('./utils/jwt')
const {checkAccessToken} = require('./middlewares/authenticateAccessToken')

async function checkUnique(type, value) {
    let query = 'select users.id from users '
    switch (type) {
        case 'EMAIL':
            query += `where users.email = '${value}'`
            break
        default:
            break
    }
    const [users] = await sequelize.query(query)
    return users.length > 0 ? false : true
}

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN, {
        expiresIn: "1m",
    });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN, {
        expiresIn: "3m",
    });
};

// 회원 가입
router.post('/join', async(req, res, next) => {
    const {name, birthYear, birthMonth, birthDate, address, email, password} = req.body

    try {
        let isUnique = await checkUnique('EMAIL', email)

        if (!isUnique) res.status(409).json({type: 'SAME_EMAIL'})

        const hashedPwd = await bcrypt.hash(password, 14)
        await User.create({
            name,
            birthYear, birthMonth , birthDate,
            address,
            email,
            password: hashedPwd
        })

        res.status(201).json({type: 'JOIN_SUCCESS'})
    }catch (error){
        next(error)
    }
})


// 로그인
router.post("/login", async(req, res, next) => {
    const {email, password} = req.body

    try{
        const exUser = await User.findOne({where: {email}})

        if(exUser) {
            const result = await bcrypt.compare(password, exUser.password)

            if(result) {
                const refreshToken = generateRefreshToken(exUser.id)
                redis.set(exUser.id, refreshToken)
                const accessToken = generateAccessToken(exUser.id)

                res.cookie('accessToken', accessToken);
                res.cookie('refreshToken', refreshToken);
                res.status(200).json({message:"LOGIN_SUCCESS"})
            }else{
                res.json({message: 'NOT_REGISTERED'})
            }
        }else{
            res.json({message: 'NOT_REGISTERED'})
        }
    }catch(error){
        next(error)
    }
})

router.post('/refresh', (req, res, next) => {
    const {refreshToken} = req.body

    if (!refreshToken) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, user) => {
            if (error) return res.sendStatus(403)

            redis.get(user.id, (err, value) => {
                // 비교
                if(value !== refreshToken) return res.sendStatus(403)

                // accessToken
                const accessToken = generateAccessToken(user.id)

                res.json({ accessToken })
            })
        }
    )
})

// 로그아웃
router.get("/logout", checkAccessToken, (req, res, next) => {
    let token = getToken(req)

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, payload) => {
        redis.del(payload.id)
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(200).json({message: "LOGOUT_SUCCESS"})
    })
})


module.exports = router
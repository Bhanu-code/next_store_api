const router = require('express').Router();
const User = require('../models/User')
const Cryptojs = require('crypto-js')
const jwt = require("jsonwebtoken")
const { verifyToken } = require('./verifyToken')

//REGISTER
router.post("/register", async (req, res) => {
    // try {
    //     const user = await User.findOne({ username: req.body.username })

    //     if (user.username === req.body.username) {
    //         res.status(201).json("username");
    //     }
    //     if (user.email === req.body.email) {
    //         res.status(201).json("email");
    //     }

    // } catch (error) {
    //     // res.status(201).json(error);
    //     console.log(error)
    // }


    const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: Cryptojs.AES.encrypt(req.body.password, process.env.SECRET_PHRASE).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        !user && res.status(401).json("Wrong credendtials");

        const hashedPassword = Cryptojs.AES.decrypt(user.password, process.env.SECRET_PHRASE);
        const Originalpassword = hashedPassword.toString(Cryptojs.enc.Utf8);

        Originalpassword !== req.body.password &&
            res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "1d" }
        );


        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken});

    } catch (err) {
        res.status(500).json(err)
    }

 

})




module.exports = router;
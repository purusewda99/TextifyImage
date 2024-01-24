const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        let newUser = new User(req.body);
        newUser.password = await bcrypt.hash(req.body.password, 10);
        newUser = await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error on the server.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send('No user found.');
        }

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Password does not match.');
        }

        const token = jwt.sign({ id: user._id }, 'supersecret', {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    } catch (err) {
        res.status(500).send('Error on the server.');
    }
});

module.exports = router;
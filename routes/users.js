const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { User } = models;

const bcryptjs = require('bcryptjs');
const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');

router.get('/', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.json({
        name: `${user.firstName} ${user.lastName}`,
        username: user.emailAddress
    })
});

router.post('/', ([
    check('firstName').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "firstName"'),
    check('lastName').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "lastName"'),
    check('emailAddress').exists().withMessage('Please provide an email for "emailAddress"').isEmail().withMessage('Please provide a valid email'),
    check('password').exists().isLength({min: 5, max: 20}).withMessage('Please provide a valid password for "password"')
]), (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        let user = req.body;
        user.password = bcryptjs.hashSync(user.password);
        
        User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            password: user.password
        })
        .then(() => res.status(201).location('/'))
        .catch(err => console.log(err));
    }
})
  

module.exports = router;
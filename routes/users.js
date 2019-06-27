const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { User } = models;

const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');
const controller = require('../controllers/users')

router.get('/', authenticateUser, controller.getUser);

router.post('/', ([
    check('firstName').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "firstName"'),
    check('lastName').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "lastName"'),
    check('password').exists().isLength({min: 5, max: 20}).withMessage('Please provide a valid password for "password"'),
    check('emailAddress').exists().withMessage('Please provide an email for "emailAddress"').isEmail().withMessage('Please provide a valid email')
    .custom(email => {
        if(email){
            return User.findOne({
                where: {
                    emailAddress: email
                }
            })
            .then(user => {
                if(user){
                    return Promise.reject('The specified email is already in use')
                } 
            });
        } else {
            return Promise.reject('No email sepecified')
        }
    })
]), controller.createUser)

module.exports = router;
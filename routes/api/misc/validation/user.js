const { check } = require('express-validator/check');

const { models } = require('../../../../db');
const { User } = models;

exports.userInfo = [
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
                    return Promise.reject('The specified email is already in use');
                } 
            });
        } else {
            return Promise.reject('No email sepecified');
        }
    })
];
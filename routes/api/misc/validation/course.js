const { check } = require('express-validator/check');

const { models } = require('../../../../db');
const { User, Course } = models;

exports.courseInfo = [
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"')
];

/**
 * CUSTOM VALIDATION
 * 
 * check('userId').exists().isInt().withMessage('Please enter a valid User ID for "userId"').custom(value => {
        return User.findByPk(value)
        .then(user => {
            if(!user){
                return Promise.reject('User ID does not exist')
            } 
        });
    })
 */
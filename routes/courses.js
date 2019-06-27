const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { User, Course } = models;

const bcryptjs = require('bcryptjs');
const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');

const controller = require('../controllers/courses')

//GET - Returns a list of courses (including the user that owns each course)
router.get('/', controller.getCourses);
//GET - Returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', controller.getCourse);
//POST -  Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', authenticateUser, ([
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"')
]), controller.createCourse);
//PUT - Updates a course and returns no content
router.put('/:id', authenticateUser, ([
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"')
]), controller.updateCourse);
//DELETE - Deletes a course and returns no content
router.delete('/:id', authenticateUser, controller.deleteCourse);

module.exports = router;

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
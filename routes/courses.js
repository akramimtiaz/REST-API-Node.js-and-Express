const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { User, Course } = models;

const bcryptjs = require('bcryptjs');
const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');

//GET - Returns a list of courses (including the user that owns each course)
router.get('/', (req, res) => {
    Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{ model: User, as: 'User', attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]
    })
    .then(courses => res.status(200).json(courses))
    .catch(error => console.log(error));
});
//GET - Returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Course.findOne({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [{ model: User, as: 'User', attributes: ['id', 'firstName', 'lastName', 'emailAddress']}],
        where: {
            id: id
        }
    })
    .then(course => {
        if(course){
            res.status(200).json(course);
        } else {
            res.status(404).json({ error: 'Not Found' });
        }
    })
    .catch(error => console.log(error));
});
//POST -  Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', authenticateUser, ([
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"')
]), (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        const course = req.body;
        Course.create({
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
            userId: course.userId    
        })
        .then((course) => res.status(201).location(`/api/courses/${course.id}`).end())
        .catch((error) => console.log(error));
    }
});
//PUT - Updates a course and returns no content
router.put('/:id', authenticateUser, ([
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"')
]),(req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        Course.findOne({
            where: {
                id: id
            }
        })
        .then((course) => {
            if(course){
                if(course.userId == req.currentUser.id){
                    course.update({
                        title: req.body.title,
                        description: req.body.description,
                        estimatedTime: req.body.estimatedTime,
                        materialsNeeded: req.body.materialsNeeded,
                        userId: req.body.userId
                    })
                    .then(() => res.status(204).end())
                    .catch(error => console.log(error));
                } else {
                    res.status(403).end();
                }
            } else {
                res.status(404).json({ error: 'Not Found' });
            }
        })
        .catch((error) => console.log(error));
    }
});
//DELETE - Deletes a course and returns no content
router.delete('/:id', authenticateUser, (req, res) => {
    const id = req.params.id;
    Course.findOne({
        where: {
            id: id
        }
    })
    .then(course => {
        if(course){
            if(course.userId == req.currentUser.id){
                course.destroy();
                res.status(204).end();
            } else {
                res.status(403).end();
            }
        } else {
            res.status(404).json({ error: 'Not Found' });
        }
    })
    .catch(error => console.log(error));
});

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
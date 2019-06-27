const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { User, Course } = models;

const bcryptjs = require('bcryptjs');
const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');

//RETRIEVE ALL
router.get('/', (req, res) => {
    Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{ model: User, as: 'User', attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]
    })
    .then(courses => res.status(200).json(courses))
    .catch(error => console.log(error));
});
//READ
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
//CREATE
router.post('/', ([
    check('title').exists().isLength({min: 2, max: 255}).withMessage('Please provide a value for "title"'),
    check('description').exists().isLength({min: 2}).withMessage('Please enter a value for "description"'),
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
        .then((course) => res.status(201).location(`/api/courses/${course.id}`))
        .catch((error) => console.log(error));
    }
});
//UPDATE
router.put('/:id', ([
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
                const course = req.body
                course.update({
                    title: course.title,
                    description: course.description,
                    estimatedTime: course.estimatedTime,
                    materialsNeeded: course.materialsNeeded,
                    userId: course.userId
                });
                res.status(204).end();
            } else {
                res.status(404).json({ error: 'Not Found' });
            }
        })
        .catch((error) => console.log(error));
    }
});
//DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Course.findOne({
        where: {
            id: id
        }
    })
    .then(course => {
        if(course){
            course.destroy();
            res.status(204).end();
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
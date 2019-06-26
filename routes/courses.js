const express = require('express');
const router = express.Router();

const { sequelize, models } = require('../db');
const { Course } = models;

const bcryptjs = require('bcryptjs');
const authenticateUser = require('./misc/authenticate');

const { check, validationResult } = require('express-validator/check');

//RETRIEVE ALL
router.get('/', (req, res) => {
    Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId']
    })
    .then(courses => res.status(200).json(courses))
    .catch(error => console.log(error));
});
//READ
router.get('/:id', (req, res) => {

});
//CREATE
router.post('/', (req, res) => {

});
//UPDATE
router.put('/:id', (req, res) => {

})
//DELETE
router.delete('/:id', (req, res) => {
    
})

module.exports = router;
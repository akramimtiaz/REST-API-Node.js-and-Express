const express = require('express');
const router = express.Router();

const authenticateUser = require('./misc/authenticate');
const validate = require('./misc/validation/course');
const controller = require('../../controllers/courses');

//GET - Returns a list of courses (including the user that owns each course)
router.get('/', controller.getCourses);

//GET - Returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', controller.getCourse);

//POST -  Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', authenticateUser, validate.courseInfo, controller.createCourse);

//PUT - Updates a course and returns no content
router.put('/:id', authenticateUser, validate.courseInfo, controller.updateCourse);

//DELETE - Deletes a course and returns no content
router.delete('/:id', authenticateUser, controller.deleteCourse);

module.exports = router;
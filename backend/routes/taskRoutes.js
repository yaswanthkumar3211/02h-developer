const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define API routes
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

const Task = require('../models/taskModel');

// 1. GET /tasks - Get tasks with filters, search, sorting, pagination, and dashboard stats
exports.getTasks = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const sort = req.query.sort || 'newest';
    
    // Pagination params
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '5', 10);
    
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page number. Page must be a positive integer.'
      });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit. Limit must be a positive integer.'
      });
    }

    // Validate status value if provided
    if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be 'Pending', 'In Progress', or 'Completed'."
      });
    }

    // Validate sort value
    if (sort && !['newest', 'oldest'].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort option. Must be 'newest' or 'oldest'."
      });
    }

    const offset = (page - 1) * limit;

    // Fetch tasks, total count, and dashboard statistics in parallel
    const [tasks, totalTasks, statistics] = await Promise.all([
      Task.getAll({ search, status, sort, limit, offset }),
      Task.count({ search, status }),
      Task.getStats()
    ]);

    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          totalTasks,
          totalPages,
          currentPage: page,
          limit
        },
        statistics
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tasks',
      error: error.message
    });
  }
};

// 2. POST /tasks - Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const errors = [];

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.push('Title is required');
    }

    if (!description || typeof description !== 'string' || description.trim().length < 20) {
      errors.push('Description is required and must be at least 20 characters long');
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      errors.push("Status must be 'Pending', 'In Progress', or 'Completed'");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: status || 'Pending'
    };

    const newTaskId = await Task.create(taskData);
    const createdTask = await Task.getById(newTaskId);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: createdTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating task',
      error: error.message
    });
  }
};

// 3. PUT /tasks/:id - Update status of an existing task
exports.updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID. ID must be an integer.'
      });
    }

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status is required and must be one of: 'Pending', 'In Progress', 'Completed'"
      });
    }

    // Check if task exists
    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found`
      });
    }

    // Update status
    await Task.updateStatus(taskId, status);
    const updatedTask = await Task.getById(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating task',
      error: error.message
    });
  }
};

// 4. DELETE /tasks/:id - Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID. ID must be an integer.'
      });
    }

    // Check if task exists
    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found`
      });
    }

    // Delete task
    await Task.delete(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: taskId }
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting task',
      error: error.message
    });
  }
};

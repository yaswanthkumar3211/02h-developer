const db = require('../config/db');

const Task = {
  // Get tasks with filtering, search, sorting, and pagination
  getAll: async ({ search, status, sort, limit, offset }) => {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    // Sorting
    if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC, id ASC';
    } else {
      // Default to newest first
      query += ' ORDER BY created_at DESC, id DESC';
    }

    // Pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Count total tasks matching search & status filters (for pagination metadata)
  count: async ({ search, status }) => {
    let query = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    const [rows] = await db.query(query, params);
    return rows[0].count;
  },

  // Get statistics for the dashboard
  getStats: async () => {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
      FROM tasks
    `;
    const [rows] = await db.query(query);
    const stats = rows[0];
    return {
      total: stats.total || 0,
      pending: stats.pending || 0,
      inProgress: stats.inProgress || 0,
      completed: stats.completed || 0
    };
  },

  // Get a single task by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create a new task
  create: async ({ title, description, status }) => {
    const query = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [title, description, status || 'Pending']);
    return result.insertId;
  },

  // Update a task's status
  updateStatus: async (id, status) => {
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    const [result] = await db.query(query, [status, id]);
    return result.affectedRows > 0;
  },

  // Delete a task
  delete: async (id) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Task;

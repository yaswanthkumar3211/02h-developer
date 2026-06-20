const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

let pool;

async function initializeDatabase() {
  try {
    // 1. Connect without database name to ensure DB exists
    const tempConnection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || 'project_db';
    
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConnection.end();
    
    // 2. Initialize connection pool with DB name
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableQuery);

    // 4. Seed database if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const count = rows[0].count;
    if (count === 0) {
      console.log('Tasks table is empty. Auto-seeding initial data...');
      const seedTasks = [
        ['Build User Authentication Flow', 'Implement JSON Web Tokens (JWT) for secure user login, registration, and password recovery flows.', 'Completed'],
        ['Configure Database Migrations', 'Define database schemas and set up connection pooling using MySQL with promise wrapper.', 'Completed'],
        ['Design Dashboard UI Components', 'Create premium glassmorphic cards, charts, and dark mode toggles in React and Tailwind CSS.', 'In Progress'],
        ['Optimize API Performance', 'Implement query pagination, search indexing, and status filtering for faster page loads.', 'Pending'],
        ['Draft Technical Documentation', 'Create the project README with installation steps, database structure, and architecture overview.', 'Pending']
      ];
      await pool.query('INSERT INTO tasks (title, description, status) VALUES ?', [seedTasks]);
      console.log('Auto-seeding completed.');
    }

    console.log(`Database and tables verified/created successfully.`);
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

initializeDatabase();

// Export a getter or the pool directly. We will export the pool so controllers can import it.
module.exports = {
  query: (sql, params) => {
    if (!pool) {
      throw new Error("Database pool has not been initialized yet.");
    }
    return pool.query(sql, params);
  },
  getPool: () => pool
};

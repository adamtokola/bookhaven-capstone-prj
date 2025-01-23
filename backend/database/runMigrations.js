const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file from the correct location (backend folder)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Verify environment variables are loaded
console.log('Database connection config:', {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('Starting migrations...\n');

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        console.log(`Running migration: ${file}`);
        try {
          await client.query(sql);
          console.log(`✓ Completed: ${file}\n`);
        } catch (error) {
          throw new Error(`Error in ${file}: ${error.message}`);
        }
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('All migrations completed successfully! 🎉');

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    // Release the client
    client.release();
    await pool.end();
  }
}

runMigrations(); 
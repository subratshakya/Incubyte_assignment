import { Pool } from 'pg';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface Database {
  query(text: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}

class PostgreSQLDatabase implements Database {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async query(text: string, params?: any[]): Promise<any> {
    return this.pool.query(text, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

class SQLiteDatabase implements Database {
  private db: sqlite3.Database;

  constructor(path: string) {
    this.db = new sqlite3.Database(path);
  }

  async query(text: string, params?: any[]): Promise<any> {
    const all = promisify(this.db.all.bind(this.db));
    const get = promisify(this.db.get.bind(this.db));
  
    // Convert PostgreSQL-style $1, $2 to SQLite-style ?
    // Also convert ILIKE to LIKE (SQLite doesn't support ILIKE)
    let sqliteQuery = text.replace(/ILIKE/gi, 'LIKE');
    
    const paramMatches: number[] = [];
    
    // Extract parameter indices
    const paramRegex = /\$(\d+)/g;
    let match;
    while ((match = paramRegex.exec(text)) !== null) {
      paramMatches.push(parseInt(match[1]));
    }
    
    // Replace with ? placeholders
    sqliteQuery = sqliteQuery.replace(/\$(\d+)/g, '?');
    
    // Reorder params if needed (SQLite uses positional parameters)
    const orderedParams = params ? paramMatches.map(idx => params[idx - 1]) : [];
    
    if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
      if (sqliteQuery.includes('LIMIT 1') || sqliteQuery.match(/SELECT.*COUNT/i)) {
        const result = await get(sqliteQuery, orderedParams);
        return { rows: result ? [result] : [], rowCount: result ? 1 : 0 };
      }
      const rows = await all(sqliteQuery, orderedParams);
      return { rows, rowCount: rows.length };
    } else {
      // For INSERT, UPDATE, DELETE - wrap run to capture changes and lastID
      return new Promise((resolve, reject) => {
        this.db.run(sqliteQuery, orderedParams, function(err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rows: [],
              rowCount: this.changes || 0,
              lastID: this.lastID || undefined,
            });
          }
        });
      });
    }
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export async function initializeDatabase(): Promise<Database> {
  const dbType = process.env.DATABASE_TYPE || 'postgresql';
  
  if (dbType === 'sqlite') {
    const dbPath = process.env.DATABASE_PATH || './sweet_shop.db';
    const db = new SQLiteDatabase(dbPath);
    
    // Initialize SQLite schema
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS sweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create trigger to update updated_at timestamp
    await db.query(`
      CREATE TRIGGER IF NOT EXISTS update_sweets_timestamp 
      AFTER UPDATE ON sweets
      BEGIN
        UPDATE sweets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    return db;
  } else {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is required for PostgreSQL');
    }
    
    const db = new PostgreSQLDatabase(connectionString);
    
    // Initialize PostgreSQL schema
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS sweets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return db;
  }
}


const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sweet_shop.db');
const db = new sqlite3.Database(dbPath);

// Replace with your email
const userEmail = 'subratshakya20@gmail.com'; // CHANGE THIS!

db.run(
  "UPDATE users SET role = 'admin' WHERE email = ?",
  [userEmail],
  function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      if (this.changes > 0) {
        console.log(`✅ Successfully updated ${this.changes} user(s) to admin!`);
        console.log(`User with email: ${userEmail} is now admin.`);
      } else {
        console.log(`❌ No user found with email: ${userEmail}`);
        console.log('Available users:');
        db.all("SELECT id, username, email, role FROM users", [], (err, rows) => {
          if (err) {
            console.error('Error:', err.message);
          } else {
            console.table(rows);
          }
          db.close();
        });
        return;
      }
      
      // Show updated user
      db.get("SELECT id, username, email, role FROM users WHERE email = ?", [userEmail], (err, row) => {
        if (err) {
          console.error('Error:', err.message);
        } else {
          console.log('\nUpdated user:');
          console.table([row]);
        }
        db.close();
      });
    }
  }
);
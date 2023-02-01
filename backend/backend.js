const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database('database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }else {
        console.log('Connected to the database.');
    }
  });

  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, user INT)");
  db.run("CREATE TABLE IF NOT EXISTS users_messages (user_id INTEGER, message_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (message_id) REFERENCES messages(id))");

//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });

module.exports = db;

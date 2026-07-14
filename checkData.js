const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('prisma/dev.db');

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
  if (err) throw err;
  console.log("Tables:");
  console.log(rows.map(r => r.name));
  
  db.all("SELECT COUNT(*) as count FROM Book", (err, result) => {
    console.log("Books:", result[0].count);
  });
  db.all("SELECT COUNT(*) as count FROM Poem", (err, result) => {
    console.log("Poems:", result[0].count);
  });
  db.all("SELECT COUNT(*) as count FROM ResearchPaper", (err, result) => {
    console.log("ResearchPapers:", result[0].count);
  });
  db.all("SELECT COUNT(*) as count FROM Article", (err, result) => {
    console.log("Articles:", result[0].count);
  });
  db.all("SELECT COUNT(*) as count FROM Paper", (err, result) => {
    if (result) console.log("Legacy Papers:", result[0].count);
  });
});

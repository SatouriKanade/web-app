const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./items.db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            date_created TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err);
        }
    });
});
app.get('/api/items', (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error fetching items");
        }
        res.json(rows);
    });
});
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    const sql = `INSERT INTO items (name, description, date_created) VALUES (?, ?, ?)`;
    const params = [name, description || '', new Date().toISOString()];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error inserting item:", err); 
            return res.status(500).send('Error inserting item');
        }
        res.status(201).json({ id: this.lastID, name, description });
    });
});

app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM items WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).send('Error deleting item');
        }
        res.status(200).send('Item deleted');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

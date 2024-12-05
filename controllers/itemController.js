const sqlite3 = require('sqlite3').verbose();

const getAllItems = (req, res) => {
    const db = new sqlite3.Database('./database/items.db');
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
    db.close();
};

const createItem = (req, res) => {
    const { name, description } = req.body;
    const db = new sqlite3.Database('./database/items.db');
    db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function (err) {
        if (err) return res.status(500).send(err.message);
        res.status(201).json({ id: this.lastID });
    });
    db.close();
};

const updateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const db = new sqlite3.Database('./database/items.db');
    db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send('Item updated.');
    });
    db.close();
};

const patchItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const db = new sqlite3.Database('./database/items.db');
    db.run(
        'UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
        [name, description, id],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.send('Item updated.');
        }
    );
    db.close();
};

const deleteItem = (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database('./database/items.db');
    db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send('Item deleted.');
    });
    db.close();
};

module.exports = { getAllItems, createItem, updateItem, patchItem, deleteItem };

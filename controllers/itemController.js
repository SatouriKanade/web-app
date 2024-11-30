const db = require('../models/itemModel');

exports.getAllItems = (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.addItem = (req, res) => {
  const { name, description } = req.body;
  db.run(
    'INSERT INTO items (name, description) VALUES (?, ?)',
    [name, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, description });
      }
    }
  );
};

exports.updateItem = (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE items SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Item updated successfully' });
      }
    }
  );
};

exports.patchItem = (req, res) => {
  const updates = Object.keys(req.body)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(req.body), req.params.id];
  db.run(
    `UPDATE items SET ${updates} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Item updated successfully' });
      }
    }
  );
};

exports.deleteItem = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
};

exports.searchItems = (req, res) => {
    const { name } = req.query;
    db.all(
      'SELECT * FROM items WHERE name LIKE ?',
      [`%${name}%`],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
      }
    );
  };
  
  exports.getAllItems = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    db.all(
      'SELECT * FROM items LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
      }
    );
  };
  
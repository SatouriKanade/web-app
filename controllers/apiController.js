const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const populateItems = async () => {
    const db = new sqlite3.Database('./database/items.db');

    try {
        const { data } = await axios.get('https://fakestoreapi.com/products');
        const stmt = db.prepare(`INSERT INTO items (name, description) VALUES (?, ?)`);

        data.forEach(product => {
            stmt.run(product.title, product.description);
        });

        stmt.finalize();
        console.log('Items populated successfully.');
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        db.close();
    }
};

module.exports = { populateItems };

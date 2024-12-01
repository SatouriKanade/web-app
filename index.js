const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const genshinRoutes = require('./routes/genshinRoutes');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); 

app.use('/genshin', genshinRoutes); 

let items = [
  { id: 1, name: "Item 1", description: "This is the first item" },
  { id: 2, name: "Item 2", description: "This is the second item" },
];

app.get('/api/items', (req, res) => res.json(items));

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  const newItem = { id: items.length + 1, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

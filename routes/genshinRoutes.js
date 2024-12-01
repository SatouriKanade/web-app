const express = require('express');
const router = express.Router();
const genshinService = require('./genshinService'); 

router.get('/characters', (req, res) => {
  const characters = genshinService.getCharacters();
  res.json(characters);
});

module.exports = router;

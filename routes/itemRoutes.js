const express = require('express');
const { getAllItems, createItem, updateItem, patchItem, deleteItem } = require('../controllers/itemController');
const router = express.Router();

router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.patch('/:id', patchItem);
router.delete('/:id', deleteItem);

module.exports = router;

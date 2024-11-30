const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/', itemController.addItem);
router.put('/:id', itemController.updateItem);
router.patch('/:id', itemController.patchItem);
router.delete('/:id', itemController.deleteItem);
router.get('/search', itemController.searchItems);

module.exports = router;
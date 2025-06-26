// routes/relations.js
const express = require('express');
const router = express.Router();
const relations = require('../controllers/contactRelations');

router.post('/', relations.createRelation);
router.delete('/:id', relations.deleteRelation);

module.exports = router;

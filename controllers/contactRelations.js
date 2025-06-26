// controllers/contactRelations.js
const db = require('../models');

exports.createRelation = async (req, res) => {
  const { contact_id, related_contact_id, relationship } = req.body;
  const rel = await db.ContactRelation.create({ contact_id, related_contact_id, relationship });
  res.json(rel);
};

exports.deleteRelation = async (req, res) => {
  await db.ContactRelation.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
};


// routes/groups.js
const express = require('express');
const router = express.Router();
const groups = require('../controllers/contactGroups');

router.get('/', groups.listGroups);
router.post('/', groups.createGroup);
router.put('/:id', groups.updateGroup);
router.delete('/:id', groups.deleteGroup);
router.post('/:id/members', groups.addMember);
router.delete('/:id/members/:contactId', groups.removeMember);

module.exports = router;

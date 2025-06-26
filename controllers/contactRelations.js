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

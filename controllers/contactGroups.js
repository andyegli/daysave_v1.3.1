// controllers/contactGroups.js
const db = require('../models');

exports.listGroups = async (req, res) => {
  const groups = await db.ContactGroup.findAll({
    where: { user_id: req.user.id },
    include: [{ model: db.ContactGroupMember, include: db.Contact }]
  });
  res.json(groups);
};

exports.createGroup = async (req, res) => {
  const { name, description } = req.body;
  const group = await db.ContactGroup.create({ user_id: req.user.id, name, description });
  res.json(group);
};

exports.updateGroup = async (req, res) => {
  const { name, description } = req.body;
  const group = await db.ContactGroup.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!group) return res.status(404).send('Group not found');
  await group.update({ name, description });
  res.json(group);
};

exports.deleteGroup = async (req, res) => {
  await db.ContactGroup.destroy({ where: { id: req.params.id, user_id: req.user.id } });
  res.sendStatus(204);
};

exports.addMember = async (req, res) => {
  const { contact_id } = req.body;
  const member = await db.ContactGroupMember.create({ group_id: req.params.id, contact_id });
  res.json(member);
};

exports.removeMember = async (req, res) => {
  await db.ContactGroupMember.destroy({
    where: { group_id: req.params.id, contact_id: req.params.contactId }
  });
  res.sendStatus(204);
};
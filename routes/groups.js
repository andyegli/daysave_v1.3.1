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

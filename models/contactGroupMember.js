module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactGroupMember', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    group_id: { type: DataTypes.UUID, allowNull: false },
    contact_id: { type: DataTypes.UUID, allowNull: false }
  });
};

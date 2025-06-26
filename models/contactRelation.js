module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactRelation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    related_contact_id: { type: DataTypes.UUID, allowNull: false },
    relationship: DataTypes.STRING
  });
};

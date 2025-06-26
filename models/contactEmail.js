module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactEmail', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    address: DataTypes.STRING
  });
};

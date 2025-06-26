module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactPhone', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    number: DataTypes.STRING
  });
};

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactGroup', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });
};

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactAddress', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    country: DataTypes.STRING
  });
};

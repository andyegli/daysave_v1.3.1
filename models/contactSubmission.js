module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactSubmission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    subject: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    language: { type: DataTypes.STRING(5), defaultValue: 'en' },
    status: { type: DataTypes.ENUM('new', 'read', 'replied'), defaultValue: 'new' }
  });
};

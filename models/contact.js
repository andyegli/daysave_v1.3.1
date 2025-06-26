module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    job_title: DataTypes.STRING,
    company: DataTypes.STRING,
    notes: DataTypes.TEXT
  });

  Contact.associate = models => {
    Contact.belongsTo(models.User, { foreignKey: 'user_id' });
    Contact.hasMany(models.ContactPhone, { foreignKey: 'contact_id' });
    Contact.hasMany(models.ContactEmail, { foreignKey: 'contact_id' });
    Contact.hasMany(models.ContactAddress, { foreignKey: 'contact_id' });
    Contact.hasMany(models.ContactSocial, { foreignKey: 'contact_id' });
    Contact.hasMany(models.ContactRelation, { foreignKey: 'contact_id' });
  };

  return Contact;
};

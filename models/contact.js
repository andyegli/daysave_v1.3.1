// models/Contact.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
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
  };

  return Contact;
};

// models/ContactPhone.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactPhone', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    number: DataTypes.STRING
  });
};

// models/ContactEmail.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactEmail', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    address: DataTypes.STRING
  });
};

// models/ContactAddress.js
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

// models/ContactSocial.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ContactSocial', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contact_id: { type: DataTypes.UUID, allowNull: false },
    label: DataTypes.STRING,
    platform: DataTypes.STRING,
    url: DataTypes.STRING
  });
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: true },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false, validate: { isEmail: true } },
    password_hash: { type: DataTypes.STRING(255), allowNull: true },
    country: { type: DataTypes.STRING(10), allowNull: true },
    device_fingerprint: { type: DataTypes.TEXT, allowNull: true },
    subscription_status: { type: DataTypes.ENUM('trial', 'basic', 'pro', 'expired'), defaultValue: 'trial' },
    language: { type: DataTypes.STRING(5), defaultValue: 'en' },
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    two_factor_secret: { type: DataTypes.STRING(255), allowNull: true },
    two_factor_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    profile_image: { type: DataTypes.STRING(500), allowNull: true },
    oauth_provider: { type: DataTypes.STRING(50), allowNull: true },
    oauth_id: { type: DataTypes.STRING(255), allowNull: true },
    trial_expires_at: { type: DataTypes.DATE, allowNull: true }
  }, {
    timestamps: true,
    createdAt: 'created_at',  // 👈 map snake_case to camelCase
    updatedAt: 'updated_at',
    tableName: 'Users'
  });

  User.associate = models => {
    User.hasMany(models.SocialAccount, { foreignKey: 'user_id' });
    User.hasMany(models.Contact, { foreignKey: 'user_id' });
    User.hasMany(models.ContactGroup, { foreignKey: 'user_id' });
  };

  return User;
};

module.exports = (sequelize, DataTypes) => {
  const SocialAccount = sequelize.define('SocialAccount', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    platform: {
      type: DataTypes.ENUM('facebook','youtube','instagram','tiktok','wechat','messenger','telegram','snapchat','pinterest','twitter','whatsapp'),
      allowNull: false
    },
    handle: { type: DataTypes.STRING(100), allowNull: false },
    access_token: DataTypes.TEXT,
    refresh_token: DataTypes.TEXT,
    expires_at: DataTypes.DATE
  });

  SocialAccount.associate = models => {
    SocialAccount.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return SocialAccount;
};

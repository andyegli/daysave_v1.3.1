// migrations/[timestamp]-create-contact.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.UUID, allowNull: false },
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      middle_name: Sequelize.STRING,
      nickname: Sequelize.STRING,
      job_title: Sequelize.STRING,
      company: Sequelize.STRING,
      notes: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactPhones', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      label: Sequelize.STRING,
      number: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactEmails', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      label: Sequelize.STRING,
      address: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactAddresses', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      label: Sequelize.STRING,
      street: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      postalCode: Sequelize.STRING,
      country: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactSocials', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      label: Sequelize.STRING,
      platform: Sequelize.STRING,
      url: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactRelations', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      related_contact_id: { type: Sequelize.UUID, allowNull: false },
      relationship: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactGroups', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.UUID, allowNull: false },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.createTable('ContactGroupMembers', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      group_id: { type: Sequelize.UUID, allowNull: false },
      contact_id: { type: Sequelize.UUID, allowNull: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ContactGroupMembers');
    await queryInterface.dropTable('ContactGroups');
    await queryInterface.dropTable('ContactRelations');
    await queryInterface.dropTable('ContactSocials');
    await queryInterface.dropTable('ContactAddresses');
    await queryInterface.dropTable('ContactEmails');
    await queryInterface.dropTable('ContactPhones');
    await queryInterface.dropTable('Contacts');
  }
};

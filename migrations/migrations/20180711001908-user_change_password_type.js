'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete('users', {})
      .then(() => {
        return queryInterface.removeColumn('users', 'password', {});
      })
      .then(() => {
        const attributes = {
          type: Sequelize.BIGINT,
          allowNull: false
        };
        return queryInterface.addColumn('users', 'password', attributes, {});
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete('users', {})
      .then(() => {
        return queryInterface.removeColumn('users', 'password', {});
      })
      .then(() => {
        const attributes = {
          type: Sequelize.STRING,
          allowNull: false
        };
        return queryInterface.addColumn('users', 'password', attributes, {});
      });
  }
};

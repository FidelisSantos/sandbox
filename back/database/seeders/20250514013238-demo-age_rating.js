'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('age_ratings', [
      { name: 'Livre'  },
      { name: '12 anos' },
      { name: '18 anos' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('age_ratings', null, {});
  }
};
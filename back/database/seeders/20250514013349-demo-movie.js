'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('movies', [
      {
        title: 'Filme A',
        description: 'Descrição do Filme A',
        img_url: 'https://i.pinimg.com/736x/e8/2d/4b/e82d4b4e5b60ba55475c1c50279d9f95.jpg',
        genre_id: 1,
        age_rating_id: 1
      },
      {
        title: 'Filme B',
        description: 'Descrição do Filme B',
        img_url: 'https://i.pinimg.com/736x/e8/2d/4b/e82d4b4e5b60ba55475c1c50279d9f95.jpg',
        genre_id: 2,
        age_rating_id: 2
      },
      {
        title: 'Filme C',
        description: 'Descrição do Filme C',
        img_url: 'https://i.pinimg.com/736x/e8/2d/4b/e82d4b4e5b60ba55475c1c50279d9f95.jpg',
        genre_id: 3,
        age_rating_id: 3
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('movies', null, {});
  }
};
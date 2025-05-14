'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('movies', [
      {
        title: 'Filme A',
        description: 'Descrição do Filme A',
        img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FPranksta_Rap&psig=AOvVaw3paGSondYnZsrdfqiz2YYY&ust=1747272967557000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCll5vpoY0DFQAAAAAdAAAAABAE',
        genre_id: 1,
        age_rating_id: 1
      },
      {
        title: 'Filme B',
        description: 'Descrição do Filme B',
        img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FPranksta_Rap&psig=AOvVaw3paGSondYnZsrdfqiz2YYY&ust=1747272967557000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCll5vpoY0DFQAAAAAdAAAAABAE',
        genre_id: 2,
        age_rating_id: 2
      },
      {
        title: 'Filme C',
        description: 'Descrição do Filme C',
        img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FPranksta_Rap&psig=AOvVaw3paGSondYnZsrdfqiz2YYY&ust=1747272967557000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCll5vpoY0DFQAAAAAdAAAAABAE',
        genre_id: 3,
        age_rating_id: 3
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('movies', null, {});
  }
};
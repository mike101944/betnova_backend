const sequelize = require('../config/database');
const User = require('./user.model');
const Bet = require('./bet.model');


const initModels = async () => {
  try {
    await sequelize.sync({
      alter: false // usitumie true kila wakati
    });
  

    console.log('Database models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  initModels,
  User,
  Bet
};
// models/bet.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Bet = sequelize.define('Bet', {
  id: {
    type: DataTypes.STRING(11), // String to store 11-digit random number
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [11, 11], // Exactly 11 characters
      isNumeric: true // Must be numeric only
    }
  },

  // Booking code (unique identifier for sharing)
  bookingCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },

  // User who placed the bet
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  // Bet details
  selections: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of selected bets with match details'
  },

  // Stake amount
  stake: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 1
    }
  },

  // Total odds (product of all selections)
  totalOdds: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  // Potential return
  potentialReturn: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  // Bet status: OPEN, SETTLED, CANCELLED
  status: {
    type: DataTypes.ENUM('OPEN', 'SETTLED', 'CANCELLED'),
    defaultValue: 'OPEN'
  },

  // Bet result: PENDING, WON, LOST
  result: {
    type: DataTypes.ENUM('PENDING', 'WON', 'LOST'),
    defaultValue: 'PENDING'
  },

  // Whether booking code is active for sharing
  isBookingCodeActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  // When bet was settled
  settledAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'bets',
  timestamps: true
});

module.exports = Bet;
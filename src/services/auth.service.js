const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');

const registerUser = async (phone_number, password) => {

  const existingUser = await userRepository.findByPhone(phone_number);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    phone_number,
    password: hashedPassword
  });

  return {
    id: user.id,
    phone_number: user.phone_number
  };
};

const loginUser = async (phone_number, password) => {

  const user = await userRepository.findByPhone(phone_number);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

 

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    id: user.id,
    phone_number: user.phone_number,
    accessToken,
    refreshToken
  };
 
};

const refreshAccessToken = async (refreshToken) => {

  if (!refreshToken) {
    throw new Error('Refresh token required');
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken
  };
};


const deposit = async (userId, amount) => {
  // Validate amount
  if (!amount || amount <= 0) {
    throw new Error('Invalid deposit amount');
  }

  // Find user
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Calculate new balance
  const currentBalance = parseFloat(user.balance) || 0;
  const depositAmount = parseFloat(amount);
  const newBalance = currentBalance + depositAmount;

  // Update balance
  const updatedUser = await userRepository.updateBalance(userId, newBalance);

  return {
    id: updatedUser.id,
    phone_number: updatedUser.phone_number,
    previous_balance: currentBalance,
    deposited_amount: depositAmount,
    new_balance: newBalance
  };
};

const withdraw = async (userId, amount) => {
  // Validate amount
  if (!amount || amount <= 0) {
    throw new Error('Invalid withdrawal amount');
  }

  // Find user
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check sufficient balance
  const currentBalance = parseFloat(user.balance) || 0;
  const withdrawAmount = parseFloat(amount);

  if (currentBalance < withdrawAmount) {
    throw new Error('Insufficient balance');
  }

  // Calculate new balance
  const newBalance = currentBalance - withdrawAmount;

  // Update balance
  const updatedUser = await userRepository.updateBalance(userId, newBalance);

  return {
    id: updatedUser.id,
    phone_number: updatedUser.phone_number,
    previous_balance: currentBalance,
    withdrawn_amount: withdrawAmount,
    new_balance: newBalance
  };
};

const getBalance = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    phone_number: user.phone_number,
    balance: user.balance
  };
};




const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    phone_number: user.phone_number,
    balance: user.balance,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
};




module.exports = {
  refreshAccessToken,

  registerUser,
  loginUser,
  deposit,
  withdraw,
  getBalance,
  getProfile
};

const {generateToken} = require("../lib/generateToken");

const bcrypt = require("bcrypt");

const UserLoginDetails = require("../models/UserLoginDetails");
const UserShippingDetails = require("../models/UserShippingDetails");

const {
  EMAIL_PATTERN,
  EMAIL_ERROR_MESSAGE,
  EMAIL_ALREADY_EXISTS_ERROR_MESSAGE,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
} = require("../constants/email");

const {
  DEFAULT_SALT,
  INVALID_PASSWORD_ERROR_MESSAGE,
} = require("../constants/password");

exports.register = async (data) => {
  const user = await UserLoginDetails.findOne({ email: data.email });

  if (user) {
    throw new Error(EMAIL_ALREADY_EXISTS_ERROR_MESSAGE);
  }

  const createdUser = await UserLoginDetails.create(data);

  const token = await generateToken(createdUser);

  const userId = createdUser._id;

  return { token, userId };
};

exports.login = async (data) => {
  const user = await UserLoginDetails.findOne({ email: data.email });

  if (!user) {
    throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE);
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    throw new Error(INVALID_CREDENTIALS_ERROR_MESSAGE);
  }

  const token = await generateToken(user);

  return { token, user };
};

exports.updateEmail = async (userId, data) => {
  let user = await UserLoginDetails.findById(userId);

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  const isEmailValid = EMAIL_PATTERN.test(data.email);

  if (!isPasswordValid) {
    throw new Error(INVALID_PASSWORD_ERROR_MESSAGE);
  } else if (!isEmailValid) {
    throw new Error(EMAIL_ERROR_MESSAGE);
  } else {
    await UserLoginDetails.findByIdAndUpdate(userId, { email: data.email });

    return user;
  }
};

exports.getUser = async (userId) => {
  const result = await UserLoginDetails.findById(userId);

  return result;
};

exports.updatePassword = async (userId, data) => {
  let user = await UserLoginDetails.findById(userId);

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error(INVALID_PASSWORD_ERROR_MESSAGE);
  } else {
    const hash = await bcrypt.hash(data.newPassword, DEFAULT_SALT);

    const user = await UserLoginDetails.findByIdAndUpdate(userId, {
      password: hash,
    });
    return user;
  }
};

// exports.delete = async (userId) => {
//   const result = await UserLoginInformation.findByIdAndDelete(userId);

//   return result;
// };

exports.createUserShippingDetails = async (data) => {
  await UserShippingDetails.create(data);
};

// exports.find = async (userId) => {
//   const result = await UserAddressInformation.findById(userId);

//   return result;
// };

// exports.update = async (userId, data) => {
//   const result = await UserAddressInformation.findByIdAndUpdate(userId, data, {
//     runValidators: true,
//     new: true,
//   });

//   return result;
// };

// exports.delete = async (userId) => {
//   const result = await UserAddressInformation.findByIdAndDelete(userId);

//   return result;
// };
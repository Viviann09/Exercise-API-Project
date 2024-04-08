const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('password_confirm'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  change_password: {
    body: {
      old_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('old_password'),
      new_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('new_password'),
      new_password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('new_password_confirm'),
    },
  },
};

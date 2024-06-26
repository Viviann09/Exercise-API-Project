const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { name, email, password } = require('../../../models/users-schema');
const { modelNames } = require('mongoose');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    if (password != password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Different password and password_confrim '
      );
    } else {
      const checkDuplicateEmail =
        await usersService.preventDuplicateEmail(email);
      if (checkDuplicateEmail == true) {
        throw errorResponder(
          errorTypes.EMAIL_ALREADY_TAKEN,
          'Email already taken'
        );
      } else if (checkDuplicateEmail == false) {
        const success = await usersService.createUser(name, email, password);
        if (!success) {
          throw errorResponder(
            errorTypes.UNPROCESSABLE_ENTITY,
            'Failed to create user'
          );
        }
        return response.status(200).json({ name, email });
      }
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const checkDuplicateEmail = await usersService.preventDuplicateEmail(email);
    if (checkDuplicateEmail == true) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    } else if (checkDuplicateEmail == false) {
      const success = await usersService.updateUser(id, name, email);
      if (!success) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to Update user'
        );
      }
      return response.status(200).json({ id });
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change password
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;
    const newPasswordConfirm = request.body.newPasswordConfirm;

    if (oldPassword == newPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Failed to Change Password Because Old Password Same With New Password'
      );
    }

    if (newPassword != newPasswordConfirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Failed to Change Password Because New Password Different With New Password Confirm'
      );
    }

    const success = await usersService.checkOldPassword(
      id,
      oldPassword,
      newPassword,
      newPasswordConfirm
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Change Password'
      );
    }
    return response
      .status(200)
      .json({ id, oldPassword, newPassword, newPasswordConfirm });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
};

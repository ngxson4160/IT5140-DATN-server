import { HttpStatus } from '@nestjs/common';

export const MessageResponse = {
  HTTPS: {
    INTERNAL_SERVER_ERROR: {
      code: 500000,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error.',
    },
    UNAUTHORIZED: {
      code: 401000,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorize.',
    },
    FORBIDDEN: {
      code: 403000,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden.',
    },
  },

  COMMON: {
    OK: {
      code: 200000,
      statusCode: HttpStatus.OK,
      message: 'Success.',
    },
    UNAUTHORIZED: {
      code: 401001,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please enter token in following format: Bearer <JWT>.',
    },
    INVALID_TOKEN: {
      code: 401002,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid Token.',
    },
    MIN_LENGTH_8: {
      code: 400003,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Minimum 8 characters',
    },
    FORBIDDEN: {
      code: 403001,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'The user does not have execute this permission.',
    },
    S3_UPLOAD_ERROR: {
      code: 500001,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred when uploading the file to s3.',
    },
    S3_DELETE_ERROR: {
      code: 500002,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred when deleting the file in s3.',
    },
    LOCAL_UPLOAD_ERROR: {
      code: 500003,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred when uploading the file local.',
    },
  },

  AUTH: {
    //TODO delete url
    SIGN_UP_SUCCESS: (urlActive: string) => ({
      code: 200001,
      message:
        'Account registration is successful, please wait for admin to approve your account',
      extraMeta: { urlActive },
    }),
    ACTIVE_ACCOUNT_SUCCUSS: {
      code: 200002,
      message: 'Active account is successful.',
    },
    SIGN_IN_SUCCESS: {
      code: 200003,
      message: 'Sign in user successfully.',
    },
    CHANGE_PASSWORD_SUCCESS: {
      code: 200004,
      message: 'Change password successfully.',
    },
    EMAIL_OR_PASSWORD_NOT_TRUE: {
      code: 400001,
      message: `Email or password not true.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    EMAIL_EXIST: {
      code: 400002,
      message: `Email already exist.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ACTIVE_ACCOUNT_FAIL: {
      code: 400010,
      message: `Active account fail.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ACTIVE_ACCOUNT: {
      code: 400011,
      message: `Please activate your account via email before performing this operation.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    PASSWORD_INCORRECT: {
      code: 400012,
      message: `Password incorrect.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  USER: {
    CREATE_SUCCESS: {
      code: 200021,
      message: 'Create user successfully.',
    },
    UPDATE_SUCCESS: {
      code: 200022,
      message: `Update user success.`,
    },
    GET_USER_DETAIL: {
      code: 200023,
      message: `Get user detail success.`,
    },
    NOT_FOUND: (id: number) => ({
      code: 400021,
      message: `User not found with id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
    NOT_EXIST: {
      code: 400022,
      message: `User does not exist.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },
};

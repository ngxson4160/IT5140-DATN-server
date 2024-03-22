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
    MIN_LENGTH_8: {
      code: 400002,
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
  },

  AUTH: {
    SIGN_UP_SUCCESS: {
      code: 200001,
      message:
        'Account registration is successful, please wait for admin to approve your account',
    },
    SIGN_IN_SUCCESS: {
      code: 200002,
      message: 'Sign in user successfully.',
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
  },

  USER: {
    CREATE_SUCCESS: {
      code: 200021,
      message: 'Create user successfully.',
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

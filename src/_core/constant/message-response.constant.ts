import { HttpStatus } from '@nestjs/common';

export const MessageResponse = {
  HTTPS: {
    INTERNAL_SERVER_ERROR: {
      code: 500000,
      message: 'Internal Server Error.',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    UNAUTHORIZED: {
      code: 401000,
      message: 'Unauthorize.',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
    FORBIDDEN: {
      code: 403000,
      message: 'Forbidden.',
      statusCode: HttpStatus.FORBIDDEN,
    },
  },

  COMMON: {
    UNAUTHORIZED: {
      code: 401001,
      message: 'Please enter token in following format: Bearer <JWT>.',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
    FORBIDDEN: {
      code: 403001,
      message: 'The user does not have execute this permission.',
      statusCode: HttpStatus.FORBIDDEN,
    },
  },

  USER: {
    CREATE_SUCCESS: {
      code: 200001,
      message: 'Create user successfully.',
    },
    NOT_FOUND: (id: number) => ({
      code: 404001,
      message: `User not found with id = ${id}.`,
      statusCode: HttpStatus.UNAUTHORIZED,
    }),
  },
};

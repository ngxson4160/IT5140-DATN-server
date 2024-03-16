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
    UNAUTHORIZED: {
      code: 401001,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please enter token in following format: Bearer <JWT>.',
    },
    FORBIDDEN: {
      code: 403001,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'The user does not have execute this permission.',
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

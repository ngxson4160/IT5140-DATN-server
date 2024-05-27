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
    USER_SIGN_UP_SUCCESS: (urlActive: string) => ({
      code: 200001,
      message:
        'Account registration is successful, please wait for admin to approve your account',
      extraMeta: { urlActive },
    }),
    COMPANY_SIGN_UP_SUCCESS: (urlActive: string) => ({
      code: 200002,
      message:
        'Company registration is successful, please wait for admin to approve your account',
      extraMeta: { urlActive },
    }),
    ACTIVE_ACCOUNT_SUCCUSS: {
      code: 200003,
      message: 'Active account is successful.',
    },
    SIGN_IN_SUCCESS: {
      code: 200004,
      message: 'Sign in user successfully.',
    },
    CHANGE_PASSWORD_SUCCESS: {
      code: 200005,
      message: 'Change password successfully.',
    },
    REQUEST_RESET_PASSWORD_SUCCESS: {
      code: 200006,
      message:
        'The link to create a new password has been sent to the corresponding email.',
    },
    RESET_PASSWORD_SUCCESS: {
      code: 200007,
      message: 'Reset password success.',
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
    RESET_PASSWORD_FAIL: {
      code: 400013,
      message: `Reset password fail.`,
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
      code: 404021,
      message: `User not found with id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
    CANDIDATE_NOT_FOUND: (id: number) => ({
      code: 400023,
      message: `Candidate not found with id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
    NOT_EXIST: {
      code: 400022,
      message: `User does not exist.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ATTACHMENT_CV_REQUIRED: {
      code: 400024,
      message: `Require publicAttachmentCv when publicCvType = 2.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  COMPANY: {
    NAME_EXIST: {
      code: 400041,
      message: `Company name exist.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    NOT_FOUND: (id: number) => ({
      code: 404041,
      message: `Company not found with id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
  },

  JOB: {
    NOT_FOUND: (id: number) => ({
      code: 404061,
      message: `Job not found with id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
  },

  APPLICATION: {
    NOT_FOUND: {
      code: 404081,
      message: `Application not found`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ALREADY_APPLICATION: {
      code: 400081,
      message: `User has applied for this job.`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  USER_FOLLOW_JOB: {
    NOT_FOUND: {
      code: 404101,
      message: `Not found user follow job`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  CONVERSATION: {
    EXIST: {
      code: 400121,
      message: `Conversation exist`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    NOT_FOUND: {
      code: 404102,
      message: `Not found conversation`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },
};

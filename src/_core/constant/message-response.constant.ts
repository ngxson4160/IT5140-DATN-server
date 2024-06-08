import { HttpStatus } from '@nestjs/common';

export const MessageResponse = {
  HTTPS: {
    INTERNAL_SERVER_ERROR: {
      code: 500000,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
    UNAUTHORIZED: {
      code: 401000,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Bạn không có quyền',
    },
    FORBIDDEN: {
      code: 403000,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Bạn không có quyền',
    },
  },

  COMMON: {
    OK: {
      code: 200000,
      statusCode: HttpStatus.OK,
      message: 'Thành công',
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
      message: 'Tối thiểu 8 ký tự',
    },
    FORBIDDEN: {
      code: 403001,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Bạn không có quyền thực hiện hành động này',
    },
    S3_UPLOAD_ERROR: {
      code: 500001,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra trong quá trình tải ảnh',
    },
    S3_DELETE_ERROR: {
      code: 500002,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra trong quá trình xóa ảnh',
    },
    LOCAL_UPLOAD_ERROR: {
      code: 500003,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra trong quá trình tải ảnh',
    },
  },

  AUTH: {
    //TODO delete url
    USER_SIGN_UP_SUCCESS: {
      code: 200001,
      message:
        'Account registration is successful, please wait for admin to approve your account',
    },
    COMPANY_SIGN_UP_SUCCESS: {
      code: 200002,
      message:
        'Company registration is successful, please wait for admin to approve your account',
    },
    ACTIVE_ACCOUNT_SUCCUSS: {
      code: 200003,
      message: 'Kích hoạt tài khoản thành công',
    },
    SIGN_IN_SUCCESS: {
      code: 200004,
      message: 'Đăng nhập thành công',
    },
    CHANGE_PASSWORD_SUCCESS: {
      code: 200005,
      message: 'Thay đổi mật khẩu thành công',
    },
    REQUEST_RESET_PASSWORD_SUCCESS: {
      code: 200006,
      message: 'Link đặt lại mật khẩu đã được gửi tới email tương ứng',
    },
    RESET_PASSWORD_SUCCESS: {
      code: 200007,
      message: 'Đặt lại mật khẩu thành công',
    },
    EMAIL_OR_PASSWORD_NOT_TRUE: {
      code: 400001,
      message: `Email hoặc mật khẩu không chính xác`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    EMAIL_EXIST: {
      code: 400002,
      message: `Email đã được sử dụng`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ACTIVE_ACCOUNT_FAIL: {
      code: 400010,
      message: `Kich hoạt tài khoản thất bại`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    ACTIVE_ACCOUNT: {
      code: 400011,
      message: `Vui lòng kích hoạt tài khoản trước khi sử dụng`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
    PASSWORD_INCORRECT: {
      code: 400012,
      message: 'Tài khoản hoặc mật khẩu không chính xác',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    RESET_PASSWORD_FAIL: {
      code: 400013,
      message: `Đặt lại mật khẩu thất bại`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  USER: {
    CREATE_SUCCESS: {
      code: 200021,
      message: 'Tạo người dùng thành công',
    },
    UPDATE_SUCCESS: {
      code: 200022,
      message: `Cập nhật thông tin người dùng thành công`,
    },
    GET_USER_DETAIL: {
      code: 200023,
      message: `Láy thông tin cá nhân thành công`,
    },
    NOT_FOUND: (id: number) => ({
      code: 404021,
      message: `Không timg thấy người dùng với id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
    CANDIDATE_NOT_FOUND: (id: number) => ({
      code: 400023,
      message: `Không tìm thấy ứng viên với id = ${id}.`,
      statusCode: HttpStatus.BAD_REQUEST,
    }),
    NOT_EXIST: {
      code: 400022,
      message: `Người dùng không tồn tại`,
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
      statusCode: HttpStatus.NOT_FOUND,
    },
    FOLLOWED: {
      code: 400101,
      message: `Followed this blog`,
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
      code: 404121,
      message: `Not found conversation`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },

  BLOG: {
    NOT_FOUND: {
      code: 404141,
      message: `Blog not found`,
      statusCode: HttpStatus.NOT_FOUND,
    },
  },

  USER_FOLLOW_BLOG: {
    NOT_FOUND: {
      code: 404161,
      message: `Not found user follow blog`,
      statusCode: HttpStatus.NOT_FOUND,
    },
    FOLLOWED: {
      code: 400161,
      message: `Followed this blog`,
      statusCode: HttpStatus.BAD_REQUEST,
    },
  },
};

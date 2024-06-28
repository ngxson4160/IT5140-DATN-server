import { EApplicationStatus } from './enum.constant';

export const COMMON_CONSTANT = {
  LOG_TIMESTAMP_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
  VERIFY_ACCOUNT: 'Xác minh tài khoản',
  RESET_PASSWORD: 'Đặt lại mật khẩu',
  ACCEPT_JOB: 'Đồng ý nhận',
  REJECT_JOB: 'Từ chối nhận',
};

export const DECORATOR_KEY = {
  IS_PUBLIC: 'isPublic',
};

export const HANDLEBARS_TEMPLATE_MAIL = {
  USER_SIGN_UP: 'user-sign-up',
  RESET_PASSWORD: 'reset-password',
  ACCEPT_JOB: 'accept-job',
  REJECT_JOB: 'reject-job',
};

export const NOTIFICATION_TEMPLATE = {
  CANDIDATE_APPLY_JOB: 'CANDIDATE_APPLY_JOB',
  CANDIDATE_DELETE_APPLY_JOB: 'CANDIDATE_DELETE_APPLY_JOB',
  COMPANY_UPDATE_APPLICATION_STATUS: 'COMPANY_UPDATE_APPLICATION_STATUS',
  COMPANY_DELETE_JOB: 'COMPANY_DELETE_JOB',
  COMPANY_ADD_INTERVIEW_SCHEDULE: 'COMPANY_ADD_INTERVIEW_SCHEDULE',
  COMPANY_VIEW_CV: 'COMPANY_VIEW_CV',
};

export const CONFIGURATION = {
  USER_AVATAR_DEFAULT: 'USER_AVATAR_DEFAULT',
  COMPANY_AVATAR_DEFAULT: 'COMPANY_AVATAR_DEFAULT',
  COMPANY_COVER_IMAGE_DEFAULT: 'COMPANY_COVER_IMAGE_DEFAULT',
};

export const CApplicationStatus = [
  { value: EApplicationStatus.WAITING, name: 'Chưa liên hệ' },
  { value: EApplicationStatus.CONTACTED, name: 'Đã liên hệ' },
  { value: EApplicationStatus.INTERVIEWED, name: 'Đã phỏng vấn' },
  { value: EApplicationStatus.SUCCESS, name: 'Trúng tuyển' },
  { value: EApplicationStatus.FAILURE, name: 'Từ chối' },
];

export const CRatingJobScore = {
  VIEW_DETAIL: 1,
  FOLLOW_JOB: 3,
  APPLY_JOB: 5,
};

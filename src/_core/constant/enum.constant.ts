export enum ERole {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  USER = 'USER',
}

export enum EUserStatus {
  INACTIVE,
  ACTIVE,
}

export enum EGender {
  MALE,
  FEMALE,
  OTHER,
}

export enum EWorkMode {
  PART_TIME,
  FULL_TIME,
}

export enum EJobStatus {
  DRAFT,
  PUBLIC,
  DELETED,
}

export enum EApplicationStatus {
  WAITING_CV,
  APPROVE_CV,
  REJECT_CV,
  INTERVIEW,
  PROCESSING,
  SUCCESS,
  FAILURE,
  DELETED,
}

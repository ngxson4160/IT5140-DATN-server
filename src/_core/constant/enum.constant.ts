export enum ESort {
  ASC = 'asc',
  DESC = 'desc',
}

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

export enum EJobMode {
  PART_TIME,
  FULL_TIME,
}

export enum EJobLevel {
  INTERN,
  STAFF,
  LEADER,
  HEAD_OR_DEPUTY_DEPARTMENT,
  MANAGER,
  HEAD_BRANCH,
  VICE_DIRECTOR,
  DIRECTOR,
}

export enum EJobStatus {
  DRAFT,
  PUBLIC,
  DELETED,
}

export enum EApplicationStatus {
  WAITING,
  CONTACTED,
  INTERVIEWED,
  SUCCESS,
  FAILURE,
  DELETED,
}

export enum EMaritalStatus {
  SINGLE,
  MARRIED,
}

export enum EEducationLevel {
  ELEMENTARY,
  JUNIOR_HIGHT_SCHOOL,
  HIGHT_SCHOOL,
  COLLEGE,
  BACHELOR,
  ENGINEER,
  MASTER,
  DOCTOR,
}

export enum ECompanySizeType {
  TINY,
  SMALL,
  LITTLE,
  FAT,
  LARGE,
  BIG,
}

export enum EYearExperience {
  NOT_AVAILABLE,
  UNDER_ONE,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  HIGHER_FIVE,
}

export enum EPublicCVType {
  NOT_PUBLIC = 0,
  SYSTEM_CV = 1,
  ATTACHMENT_CV = 2,
}

export enum EApplicationClassify {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export enum ENotificationStatus {
  UNREAD,
  READ,
}

export enum EConversationType {
  PAIR,
  GROUP,
}

export enum EUserHasConversationStatus {
  UNREAD_MESSAGE,
  READ_MESSAGE,
}

export enum EConversationStatus {
  NOT_ACTIVE,
  ACTIVE,
}

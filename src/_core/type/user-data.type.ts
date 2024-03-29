import { EUserStatus } from '../constant/enum.constant';

export type IUserData = {
  id: number;
  email: string;
  status: EUserStatus;
  roleIds: Array<{ roleId: number }>;
};

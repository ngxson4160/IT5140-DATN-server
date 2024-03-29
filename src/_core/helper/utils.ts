import * as bcrypt from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { CommonException } from '../middleware/filter/exception.filter';
import { MessageResponse } from '../constant/message-response.constant';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, parseInt(process.env.AUTH_SALT_ROUND));
};

export const comparePassword = async (
  inputPassword: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};

export const createToken = async (
  payload: any,
  privateKey: string,
  tokenLife: string,
): Promise<string> => {
  return sign({ data: payload }, privateKey, { expiresIn: tokenLife });
};

export const verifyToken = async (token: string, privateKey: string) => {
  try {
    return verify(token, privateKey);
  } catch (e) {
    throw new CommonException(MessageResponse.COMMON.INVALID_TOKEN);
  }
};

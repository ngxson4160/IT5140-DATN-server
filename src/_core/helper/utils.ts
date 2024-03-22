import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

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
  return verify(token, privateKey);
};

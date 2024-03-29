import { SetMetadata } from '@nestjs/common';
import { DECORATOR_KEY } from 'src/_core/constant/common.constant';

export const Public = () => SetMetadata(DECORATOR_KEY.IS_PUBLIC, true);

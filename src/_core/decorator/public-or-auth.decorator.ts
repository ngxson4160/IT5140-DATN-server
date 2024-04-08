import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_OR_AUTH_KEY = 'isPublicOrAuth';
export const PublicOrAuth = () => SetMetadata(IS_PUBLIC_OR_AUTH_KEY, true);

import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'messageKey';
export const Message = (message: string) => SetMetadata(MESSAGE_KEY, message);

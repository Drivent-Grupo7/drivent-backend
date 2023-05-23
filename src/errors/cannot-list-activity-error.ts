import { ApplicationError } from '@/protocols';

export function cannotListActivityError(message: string): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message,
  };
}

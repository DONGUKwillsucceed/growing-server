import { Chattings, ChattingStorage, Users } from '@prisma/client';

export type ArchivedChattingInterface = ChattingStorage & {
  Chattings: Chattings & {
    Users: Users;
  };
};

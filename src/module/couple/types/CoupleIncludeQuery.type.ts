import { Couples, Pets, Users } from '@prisma/client';

export type CoupleIncludeQueryType = Couples & {
  Pets: Pets[];
  Users: Users[];
};

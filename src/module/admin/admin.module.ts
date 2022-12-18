import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { env } from 'process';
import * as AdminJSPrisma from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { PrismaService } from 'src/service/prisma.service';
import { DMMFClass } from '@prisma/client/runtime';

const DEFAULT_ADMIN = {
  email: env.EMAIL,
  password: env.PASSWORD,
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const growingNav = {
  name: 'Growing',
};

AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => {
        const prisma = new PrismaService();
        const dmmf = (prisma as any)._baseDmmf as DMMFClass;

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: { model: dmmf.modelMap.Users, client: prisma },
                options: {
                  sort: {
                    sortBy: 'createdAt',
                    direction: 'desc',
                  },
                  navigation: growingNav,
                },
              },
              {
                resource: { model: dmmf.modelMap.Couples, client: prisma },
                options: {
                  navigation: growingNav,
                },
              },
              {
                resource: {
                  model: dmmf.modelMap.Questions_Warehouse,
                  client: prisma,
                },
                options: {
                  sort: {
                    sortBy: 'createdAt',
                    direction: 'desc',
                  },
                  filterProperties: [
                    'level',
                    'content',
                    'createdAt',
                    'modifiedAt',
                  ],
                  editProperties: ['content', 'level'],
                  navigation: growingNav,
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: env.COOKIE_SECRET,
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: env.SESSION_SECRET,
          },
        };
      },
    }),
  ],
})
export class AdminJSModule {}

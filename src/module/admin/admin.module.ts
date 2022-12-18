import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { env } from 'process';
import * as AdminJSPrisma from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { PrismaService } from 'src/service/prisma.service';
import { DMMFClass } from '@prisma/client/runtime';
import { config } from 'dotenv';
config();

const DEFAULT_ADMIN = {
  email: 'admin@growing.com',
  password: 'gorwing306',
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
              {
                resource: {
                  model: dmmf.modelMap.Error_Log,
                  client: prisma,
                },
                options: {
                  sort: {
                    sortBy: 'createdAt',
                    direction: 'desc',
                  },
                  filterProperties: ['label', 'name', 'createdAt'],
                  editProperties: [],
                  navigation: growingNav,
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        };
      },
    }),
  ],
})
export class AdminJSModule {}

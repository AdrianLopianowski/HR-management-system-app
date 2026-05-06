import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env['FIREBASE_PROJECT_ID'],
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    }),
  });

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  app.enableCors();

  await app.listen(3000);
}
bootstrap();

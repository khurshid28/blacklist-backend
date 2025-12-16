import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Global error handlers to prevent Telegram panics from crashing the app
process.on('unhandledRejection', (reason: any, promise) => {
  console.error('🔴 Unhandled Rejection at:', promise);
  console.error('🔴 Reason:', reason);
  
  // Check if it's a Telegram panic
  if (reason?.message?.includes('PANIC') || reason?.code === 'GenericFailure') {
    console.error('⚠️  Telegram library panic detected - ignoring to keep server alive');
    console.error('⚠️  Telegram features may be unavailable');
    // Don't crash the app
    return;
  }
  
  // For other errors, log but don't crash
  console.error('⚠️  Error will be logged but server continues');
});

process.on('uncaughtException', (error) => {
  console.error('🔴 Uncaught Exception:', error);
  
  // Check if it's a Telegram panic
  if (error?.message?.includes('PANIC') || (error as any)?.code === 'GenericFailure') {
    console.error('⚠️  Telegram library panic detected - ignoring to keep server alive');
    console.error('⚠️  Telegram features may be unavailable');
    // Don't crash the app
    return;
  }
  
  // For other critical errors, we might need to exit
  console.error('⚠️  Critical error - server may need restart');
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 7777;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`🌍 Server is accessible at: http://90.156.197.252:${port}`);
}

bootstrap();

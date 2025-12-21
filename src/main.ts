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
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  
  // Enable CORS
  app.enableCors();
  
  // Request/Response Logger Middleware
  app.use((req, res, next) => {
    const { method, originalUrl, body, query, params } = req;
    const startTime = Date.now();
    
    // Log request
    console.log('\n📥 ===== INCOMING REQUEST =====');
    console.log(`🔹 Method: ${method}`);
    console.log(`🔹 URL: ${originalUrl}`);
    console.log(`🔹 Time: ${new Date().toISOString()}`);
    if (Object.keys(query).length > 0) {
      console.log(`🔹 Query:`, JSON.stringify(query, null, 2));
    }
    if (Object.keys(params).length > 0) {
      console.log(`🔹 Params:`, JSON.stringify(params, null, 2));
    }
    if (body && Object.keys(body).length > 0) {
      // Don't log passwords
      const safeBody = { ...body };
      if (safeBody.password) safeBody.password = '***';
      console.log(`🔹 Body:`, JSON.stringify(safeBody, null, 2));
    }
    console.log('==============================\n');

    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      
      console.log('\n📤 ===== OUTGOING RESPONSE =====');
      console.log(`🔸 Method: ${method}`);
      console.log(`🔸 URL: ${originalUrl}`);
      console.log(`🔸 Status: ${res.statusCode}`);
      console.log(`🔸 Duration: ${duration}ms`);
      
      // Try to parse and log response data
      try {
        const responseData = typeof data === 'string' ? JSON.parse(data) : data;
        if (responseData) {
          // Limit response logging size
          const dataStr = JSON.stringify(responseData, null, 2);
          if (dataStr.length > 500) {
            console.log(`🔸 Response: ${dataStr.substring(0, 500)}... (truncated)`);
          } else {
            console.log(`🔸 Response:`, dataStr);
          }
        }
      } catch (e) {
        // If not JSON, just log type
        console.log(`🔸 Response Type: ${typeof data}`);
      }
      
      console.log('===============================\n');
      
      return originalSend.call(this, data);
    };
    
    next();
  });
  
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

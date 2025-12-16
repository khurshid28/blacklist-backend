"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
BigInt.prototype.toJSON = function () {
    return this.toString();
};
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔴 Unhandled Rejection at:', promise);
    console.error('🔴 Reason:', reason);
    if (reason?.message?.includes('PANIC') || reason?.code === 'GenericFailure') {
        console.error('⚠️  Telegram library panic detected - ignoring to keep server alive');
        console.error('⚠️  Telegram features may be unavailable');
        return;
    }
    console.error('⚠️  Error will be logged but server continues');
});
process.on('uncaughtException', (error) => {
    console.error('🔴 Uncaught Exception:', error);
    if (error?.message?.includes('PANIC') || error?.code === 'GenericFailure') {
        console.error('⚠️  Telegram library panic detected - ignoring to keep server alive');
        console.error('⚠️  Telegram features may be unavailable');
        return;
    }
    console.error('⚠️  Critical error - server may need restart');
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const port = process.env.PORT || 7777;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    console.log(`🌍 Server is accessible at: http://90.156.197.252:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
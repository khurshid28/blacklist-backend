const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
require('dotenv').config();

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession('');

(async () => {
  console.log('Telegram login boshlandi...');
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text('Telefon raqamingizni kiriting (+998...): '),
    password: async () => await input.text('2FA parolni kiriting (agar bor bo\'lsa): '),
    phoneCode: async () => await input.text('Telegram\'dan kelgan kodni kiriting: '),
    onError: (err) => console.log('Xato:', err),
  });

  console.log('Muvaffaqiyatli login qilindi!');
  console.log('Session saqlanyapti...');
  
  const session = client.session.save();
  fs.writeFileSync('./telegram.session', session);
  
  console.log('Session saqlandi: telegram.session');
  console.log('Endi serverni restart qiling: npm run start:dev');
  
  await client.disconnect();
  process.exit(0);
})();

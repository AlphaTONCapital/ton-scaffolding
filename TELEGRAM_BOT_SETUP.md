# Telegram Bot Setup Guide

This guide will help you set up and configure a Telegram bot for your TON dApp.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Creating a Telegram Bot](#creating-a-telegram-bot)
- [Configuration](#configuration)
- [Installation](#installation)
- [Running the Bot](#running-the-bot)
- [Features](#features)
- [Customization](#customization)
- [Deployment](#deployment)

## Prerequisites

- Node.js 16+ installed
- Telegram account
- TON wallet (for testing)
- Basic understanding of TypeScript

## Creating a Telegram Bot

### Step 1: Talk to BotFather

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a conversation with BotFather
3. Send the command `/newbot`
4. Choose a name for your bot (e.g., "TON Hackathon Bot")
5. Choose a username for your bot (must end with "bot", e.g., "ton_hackathon_bot")
6. BotFather will provide you with a **Bot Token** that looks like:
   ```
   5555555555:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
   ```
   **⚠️ Keep this token secret!**

### Step 2: Configure Bot Settings

Send these commands to BotFather to configure your bot:

```
/setdescription - Set bot description
/setabouttext - Set about text
/setuserpic - Upload bot avatar
/setcommands - Set command list
/setjoingroups - Allow/disallow adding to groups
/setprivacy - Set privacy mode
```

#### Recommended Commands List
Send `/setcommands` to BotFather and paste:
```
start - Start the bot
connect - Connect your TON wallet
balance - Check wallet balance
contract - Interact with smart contracts
help - Show help message
settings - Bot settings
```

### Step 3: Enable Inline Mode (Optional)

If you want your bot to work inline:
1. Send `/setinline` to BotFather
2. Provide a placeholder text
3. Send `/setinlinefeedback` to enable/disable feedback

### Step 4: Set Up Web App (Optional)

For TON Connect integration:
1. Send `/newapp` to BotFather
2. Select your bot
3. Provide the Web App URL (your dApp URL)
4. Upload an image for the Web App button
5. Set a short name for the Web App

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_BOT_USERNAME=your_bot_username

# Web App Configuration
WEBAPP_URL=http://localhost:5174
WEBAPP_DOMAIN=localhost

# TON Configuration
TON_NETWORK=testnet # or mainnet
TON_API_KEY=your_toncenter_api_key # Optional

# TON Connect Configuration
TONCONNECT_MANIFEST_URL=https://your-domain.com/tonconnect-manifest.json

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/bot_db
REDIS_URL=redis://localhost:6379

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Admin Settings
ADMIN_CHAT_IDS=123456789,987654321 # Comma-separated admin Telegram IDs
```

### TON Connect Manifest

Create `tonconnect-manifest.json` in your web app's public directory:

```json
{
  "url": "https://your-domain.com",
  "name": "Your DApp Name",
  "iconUrl": "https://your-domain.com/icon.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

## Installation

### Install Dependencies

```bash
# Navigate to telegram-bot directory
cd src/telegram-bot

# Install required packages
npm install grammy @grammyjs/menu @grammyjs/conversations @grammyjs/session
npm install @ton/ton @ton/core @ton/crypto
npm install @tonconnect/sdk @orbs-network/ton-access
npm install qrcode dotenv
npm install --save-dev @types/node @types/qrcode typescript ts-node nodemon
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "bot:dev": "nodemon --exec ts-node src/telegram-bot/index.ts",
    "bot:build": "tsc -p src/telegram-bot/tsconfig.json",
    "bot:start": "node dist/telegram-bot/index.js",
    "bot:debug": "node --inspect -r ts-node/register src/telegram-bot/index.ts"
  }
}
```

### TypeScript Configuration

Create `tsconfig.json` in the telegram-bot directory:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "../../dist/telegram-bot",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["./**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## Running the Bot

### Development Mode

```bash
npm run bot:dev
```

The bot will restart automatically when you make changes.

### Production Mode

```bash
npm run bot:build
npm run bot:start
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2
npm install -g pm2

# Start the bot
pm2 start dist/telegram-bot/index.js --name "telegram-bot"

# View logs
pm2 logs telegram-bot

# Monitor
pm2 monit
```

## Features

### Core Features Implemented

1. **Wallet Connection**
   - TON Connect integration
   - QR code generation
   - Deep linking support

2. **Contract Interaction**
   - Deploy contracts
   - Send transactions
   - Read contract data
   - Monitor events

3. **User Interface**
   - Interactive menus
   - Inline keyboards
   - Web App integration
   - Command handling

4. **Utilities**
   - Message formatting
   - Error handling
   - Session management
   - Multi-language support (ready for implementation)

## Customization

### Adding New Commands

```typescript
// In index.ts
bot.command('yourcommand', async (ctx) => {
  // Your command logic here
  await ctx.reply('Command response');
});
```

### Adding Contract Interactions

1. Import your contract wrapper:
```typescript
import { YourContract } from '../wrappers/YourContract';
```

2. Create handler methods in `contractHandler.ts`

3. Add menu items or commands to trigger the interactions

### Customizing Menus

Modify the menu structure in `index.ts`:

```typescript
const customMenu = new Menu('custom-menu')
  .text('Option 1', async (ctx) => { /* handler */ })
  .row()
  .text('Option 2', async (ctx) => { /* handler */ });
```

## Deployment

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/telegram-bot ./dist/telegram-bot

CMD ["node", "dist/telegram-bot/index.js"]
```

Build and run:
```bash
docker build -t telegram-bot .
docker run -d --env-file .env telegram-bot
```

### Using Cloud Services

#### Heroku
```bash
heroku create your-bot-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

#### AWS Lambda
Use the `grammy` serverless adapter for Lambda deployment.

#### Google Cloud Functions
Deploy using the Functions Framework.

## Security Best Practices

1. **Never commit sensitive data**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Validate user input**
   - Sanitize addresses
   - Validate amounts
   - Check permissions

3. **Rate limiting**
   - Implement per-user rate limits
   - Use flood control

4. **Error handling**
   - Don't expose internal errors to users
   - Log errors for debugging

5. **Access control**
   - Implement admin commands
   - User permission levels

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check bot token is correct
   - Ensure bot is not already running
   - Check network connectivity

2. **Wallet connection fails**
   - Verify manifest URL is accessible
   - Check CORS settings
   - Ensure wallet app is updated

3. **Transaction errors**
   - Check network (mainnet/testnet)
   - Verify contract addresses
   - Ensure sufficient balance

## Resources

- [GrammY Documentation](https://grammy.dev/)
- [TON Documentation](https://docs.ton.org/)
- [TON Connect SDK](https://github.com/ton-connect/sdk)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#botfather-commands)

## Support

For issues or questions:
1. Check the [FAQ section](#)
2. Open an issue on GitHub
3. Join our Telegram support group
4. Contact the development team

---

Made with ❤️ for the TON Hackathon
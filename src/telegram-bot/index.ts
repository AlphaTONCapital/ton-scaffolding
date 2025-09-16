import { Bot, Context, session, SessionFlavor } from 'grammy';
import { conversations, createConversation, ConversationFlavor } from '@grammyjs/conversations';
import { Menu } from '@grammyjs/menu';
import { TonConnect } from '@tonconnect/sdk';
import { Address, toNano } from '@ton/core';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';

// Import your contract wrappers here
// import { YourContract } from '../wrappers/YourContract';

// Bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5174';
const TON_NETWORK = process.env.TON_NETWORK || 'testnet';

// Session configuration
interface SessionData {
  walletAddress?: string;
  userId?: number;
  // Add more session data fields as needed
}

// Context type
type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor<Context>;

// Initialize bot with typed context
const bot = new Bot<MyContext>(BOT_TOKEN);

// Middleware setup
bot.use(session({
  initial: (): SessionData => ({})
}));
bot.use(conversations());

// TON Client initialization
let tonClient: TonClient;

async function initTonClient() {
  const endpoint = await getHttpEndpoint({
    network: TON_NETWORK as 'mainnet' | 'testnet'
  });
  tonClient = new TonClient({ endpoint });
}

// Main menu
const mainMenu = new Menu<MyContext>('main-menu')
  .text('💼 Connect Wallet', async (ctx) => {
    // TODO: Implement wallet connection via deep link
    await ctx.reply('Please use the web app to connect your wallet', {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Open Web App', web_app: { url: WEBAPP_URL } }
        ]]
      }
    });
  })
  .row()
  .text('📊 View Stats', async (ctx) => {
    // TODO: Implement stats viewing
    await ctx.reply('📊 Contract Statistics:\n\n[Statistics will be displayed here]');
  })
  .text('⚙️ Settings', async (ctx) => {
    // TODO: Implement settings menu
    await ctx.reply('⚙️ Settings menu coming soon...');
  })
  .row()
  .text('ℹ️ Help', async (ctx) => {
    await ctx.reply(
      '🤖 *Bot Commands:*\n\n' +
      '/start - Start the bot\n' +
      '/connect - Connect your wallet\n' +
      '/balance - Check your balance\n' +
      '/contract - Interact with smart contracts\n' +
      '/help - Show this help message\n\n' +
      '📱 Use the inline keyboard or web app for more features!',
      { parse_mode: 'Markdown' }
    );
  });

// Command handlers
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🚀 *Welcome to the TON Hackathon Bot!*

This bot helps you interact with TON smart contracts directly from Telegram.

🔧 *Features:*
• Connect your TON wallet
• Deploy and interact with contracts
• View transaction history
• Real-time notifications

Use the menu below to get started! 👇
  `;
  
  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: mainMenu
  });
});

bot.command('connect', async (ctx) => {
  // TODO: Implement TON Connect integration
  const connectUrl = `${WEBAPP_URL}?connect=true`;
  await ctx.reply('Click below to connect your wallet:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🔗 Connect Wallet', web_app: { url: connectUrl } }
      ]]
    }
  });
});

bot.command('balance', async (ctx) => {
  // TODO: Implement balance checking
  const walletAddress = ctx.session.walletAddress;
  
  if (!walletAddress) {
    await ctx.reply('❌ Please connect your wallet first using /connect');
    return;
  }
  
  try {
    const address = Address.parse(walletAddress);
    const balance = await tonClient.getBalance(address);
    
    await ctx.reply(
      `💰 *Wallet Balance:*\n\n` +
      `Address: \`${walletAddress}\`\n` +
      `Balance: ${balance.toString()} TON`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    await ctx.reply('❌ Error fetching balance. Please try again.');
  }
});

bot.command('contract', async (ctx) => {
  // TODO: Implement contract interaction menu
  const contractMenu = new Menu<MyContext>('contract-menu')
    .text('📝 Deploy Contract', async (ctx) => {
      await ctx.reply('Deploy contract functionality coming soon...');
    })
    .row()
    .text('📤 Send Transaction', async (ctx) => {
      await ctx.reply('Send transaction functionality coming soon...');
    })
    .row()
    .text('📥 Read Data', async (ctx) => {
      await ctx.reply('Read contract data functionality coming soon...');
    })
    .row()
    .text('🔙 Back', async (ctx) => {
      await ctx.editMessageReplyMarkup({ reply_markup: mainMenu });
    });
  
  bot.use(contractMenu);
  
  await ctx.reply('🔧 Contract Interaction Menu:', {
    reply_markup: contractMenu
  });
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    '📚 *Help & Documentation:*\n\n' +
    '• [TON Documentation](https://docs.ton.org)\n' +
    '• [Bot Commands Reference](/help)\n' +
    '• [Web App](' + WEBAPP_URL + ')\n\n' +
    'Need assistance? Contact @your_support_handle',
    { 
      parse_mode: 'Markdown',
      link_preview_options: { is_disabled: true }
    }
  );
});

// Handle inline queries (optional)
bot.on('inline_query', async (ctx) => {
  // TODO: Implement inline query handling
  const results = [
    {
      type: 'article' as const,
      id: '1',
      title: 'Share Contract Address',
      input_message_content: {
        message_text: 'Contract address will be shared here'
      }
    }
  ];
  
  await ctx.answerInlineQuery(results);
});

// Handle callback queries from inline keyboards
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  // Handle different callback actions
  switch(data) {
    case 'wallet_connect':
      // Handle wallet connection
      break;
    case 'view_transactions':
      // Handle transaction viewing
      break;
    default:
      await ctx.answerCallbackQuery('Unknown action');
  }
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
async function startBot() {
  await initTonClient();
  bot.use(mainMenu);
  
  console.log('🤖 Bot is starting...');
  bot.start({
    onStart: (info) => {
      console.log(`✅ Bot @${info.username} is running!`);
    }
  });
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

// Export for testing or external use
export { bot, startBot };

// Start if run directly
if (require.main === module) {
  startBot();
}
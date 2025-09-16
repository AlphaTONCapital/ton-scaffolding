# 📱 Telegram Mini App Development Guide

## 🚀 Alpha TON Capital Hackathon - Telegram Mini Apps

This scaffold is fully configured to build Telegram Mini Apps integrated with the TON blockchain. Follow this guide to create powerful decentralized applications that run directly within Telegram.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Bot Setup](#-bot-setup)
3. [Environment Configuration](#-environment-configuration)
4. [Development](#-development)
5. [Features & APIs](#-features--apis)
6. [Testing](#-testing)
7. [Deployment](#-deployment)
8. [Best Practices](#-best-practices)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Telegram account
- TON wallet (Tonkeeper recommended)
- Basic knowledge of React and TypeScript

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/AlphaTONCapital/ton-scaffolding
cd ton-scaffolding

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Alpha TON Hackathon Bot")
4. Choose a username (must end in 'bot', e.g., `alpha_ton_hackathon_bot`)
5. Copy the bot token you receive

### 3. Configure Mini App

```bash
# In @BotFather, configure your bot:
/mybots
# Select your bot
# Click "Bot Settings"
# Click "Menu Button"
# Click "Configure menu button"
# Enter your Mini App URL
```

### 4. Update .env File

```env
# Add your bot token
VITE_TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_TELEGRAM_WEB_APP_URL=https://your-app-url.com

# Enable Mini App mode
VITE_ENABLE_TELEGRAM_MINI_APP=true
```

---

## 🤖 Bot Setup

### Creating the Bot

1. **Bot Creation with BotFather**
   ```
   /newbot
   Bot Name: Alpha TON Hackathon App
   Username: alpha_ton_hackathon_bot
   ```

2. **Enable Inline Mode (Optional)**
   ```
   /setinline
   Choose your bot
   Enter placeholder text
   ```

3. **Configure Web App**
   ```
   /newapp
   Choose your bot
   Enter app title
   Enter description
   Upload 640x360px image
   Upload demo GIF (optional)
   Enter web app URL
   Enter short name
   ```

### Bot Commands Setup

Add useful commands for your bot:

```
/setcommands

start - Launch the Mini App
wallet - Connect TON wallet
balance - Check your balance
help - Get help
about - About this app
```

### Bot Profile Setup

```
/setdescription
Your bot description here

/setabouttext
Detailed information about your bot

/setuserpic
Upload bot avatar (512x512px recommended)
```

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Telegram Bot Configuration (REQUIRED)
VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmNOPqrstUVwxyz
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_TELEGRAM_WEB_APP_URL=https://your-webapp.com

# TON Network
VITE_TON_NETWORK=testnet # or mainnet
VITE_TON_API_KEY=your_toncenter_api_key

# Security
VITE_TELEGRAM_VALIDATE_INIT_DATA=true

# Features
VITE_TELEGRAM_ENABLE_BIOMETRICS=true
VITE_TELEGRAM_ENABLE_HAPTIC=true
VITE_TELEGRAM_ENABLE_CLOUD_STORAGE=true
VITE_TELEGRAM_ENABLE_QR_SCANNER=true
```

### Optional Variables

```env
# Analytics
VITE_TELEGRAM_ANALYTICS_TOKEN=your_analytics_token

# Theme
VITE_TELEGRAM_THEME_MODE=auto # auto, light, dark

# Debug
VITE_DEBUG_MODE=false
VITE_SHOW_TEST_BUTTONS=false
```

---

## 💻 Development

### Using TelegramProvider

Wrap your app with the TelegramProvider to access Telegram Web App APIs:

```tsx
import { TelegramProvider } from './providers/TelegramProvider';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TelegramProvider>
        <YourApp />
      </TelegramProvider>
    </TonConnectUIProvider>
  );
}
```

### Using Telegram Hooks

```tsx
import { useTelegram } from './providers/TelegramProvider';
import { useTelegramAuth } from './hooks/useTelegramAuth';

function MyComponent() {
  const { 
    user, 
    webApp, 
    showMainButton, 
    hapticFeedback 
  } = useTelegram();
  
  const { 
    isAuthenticated, 
    getDisplayName 
  } = useTelegramAuth();

  const handleClick = () => {
    hapticFeedback('impact', 'medium');
    showMainButton('Continue', () => {
      console.log('Main button clicked');
    });
  };

  return (
    <div>
      {isAuthenticated && (
        <p>Welcome, {getDisplayName()}!</p>
      )}
      <button onClick={handleClick}>
        Test Haptic Feedback
      </button>
    </div>
  );
}
```

### Using Telegram Utilities

```tsx
import { 
  vibrate, 
  shareToTelegram, 
  scanQRCode,
  copyToClipboard 
} from './utils/telegram';

// Vibrate on success
const handleSuccess = () => {
  vibrate('success');
  shareToTelegram('Check out my score!', window.location.href);
};

// Scan QR code
const handleScanQR = async () => {
  const result = await scanQRCode('Scan wallet address');
  if (result) {
    console.log('Scanned:', result);
  }
};

// Copy address
const handleCopy = async (address: string) => {
  const copied = await copyToClipboard(address);
  if (copied) {
    vibrate('light');
  }
};
```

---

## 🛠 Features & APIs

### Main Button

Control the main action button at the bottom:

```tsx
const { showMainButton, hideMainButton } = useTelegram();

// Show button
showMainButton('Send Transaction', async () => {
  await sendTransaction();
  hideMainButton();
});

// Show with loading
webApp.MainButton.showProgress();
await performAction();
webApp.MainButton.hideProgress();
```

### Back Button

```tsx
const { showBackButton, hideBackButton } = useTelegram();

showBackButton(() => {
  navigate(-1);
});
```

### Haptic Feedback

```tsx
const { hapticFeedback } = useTelegram();

// Impact feedback
hapticFeedback('impact', 'light'); // light, medium, heavy

// Notification feedback
hapticFeedback('notification', 'success'); // success, warning, error

// Selection changed
hapticFeedback('selection');
```

### Cloud Storage

Store data in Telegram cloud:

```tsx
const { cloudStorage } = useTelegram();

// Save data
await cloudStorage.setItem('user_preferences', JSON.stringify(prefs));

// Load data
const data = await cloudStorage.getItem('user_preferences');
const prefs = data ? JSON.parse(data) : {};

// Remove data
await cloudStorage.removeItem('user_preferences');
```

### Biometric Authentication

```tsx
import { useBiometrics } from './utils/telegram';

const biometrics = useBiometrics();

// Initialize biometrics
const available = await biometrics.init();

if (available) {
  // Request access
  const granted = await biometrics.requestAccess('Secure your wallet');
  
  if (granted) {
    // Authenticate user
    const authenticated = await biometrics.authenticate('Confirm transaction');
  }
}
```

### QR Scanner

```tsx
const { webApp } = useTelegram();

webApp.showScanQrPopup(
  { text: 'Scan TON address' },
  (result) => {
    if (result) {
      console.log('Scanned address:', result);
    }
    webApp.closeScanQrPopup();
  }
);
```

### Theme & Colors

```tsx
const { colorScheme, webApp } = useTelegram();

// Get current theme
console.log('Theme:', colorScheme); // 'light' or 'dark'

// Set header color
webApp.setHeaderColor('#007AFF');

// Set background color
webApp.setBackgroundColor('#FFFFFF');

// Access theme variables
const bgColor = webApp.themeParams.bg_color;
const textColor = webApp.themeParams.text_color;
```

---

## 🧪 Testing

### Local Testing

1. **Using ngrok for HTTPS tunnel:**
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start your dev server
   npm run dev
   
   # In another terminal, create tunnel
   ngrok http 5173
   ```

2. **Update bot with ngrok URL:**
   - Copy the HTTPS URL from ngrok
   - Update your bot's Mini App URL in BotFather
   - Test in Telegram

### Test in Telegram Desktop

1. Enable DevTools:
   - Settings → Advanced → Experimental settings
   - Enable webview inspection
2. Right-click in Mini App → Inspect Element

### Debug Mode

Enable debug mode in your app:

```tsx
// In your .env
VITE_DEBUG_MODE=true
VITE_SHOW_TEST_BUTTONS=true

// In your component
{import.meta.env.VITE_DEBUG_MODE === 'true' && (
  <DebugPanel webApp={webApp} />
)}
```

---

## 🚀 Deployment

### Build for Production

```bash
# Build the app
npm run build

# Preview locally
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Configure Domain & SSL

1. Point your domain to hosting provider
2. Enable HTTPS (required for Telegram Mini Apps)
3. Update bot configuration with production URL

### Update Bot for Production

```
# In BotFather
/mybots
Select your bot
Bot Settings → Menu Button → Edit menu button URL
Enter: https://your-domain.com
```

---

## 📚 Best Practices

### Security

1. **Always validate init data:**
   ```tsx
   VITE_TELEGRAM_VALIDATE_INIT_DATA=true
   ```

2. **Never expose sensitive data:**
   - Keep bot token server-side only
   - Use environment variables
   - Implement proper authentication

3. **Validate all user inputs**

### Performance

1. **Optimize bundle size:**
   - Use code splitting
   - Lazy load components
   - Minimize dependencies

2. **Cache data appropriately:**
   ```tsx
   // Use Telegram Cloud Storage for user data
   await cloudStorage.setItem('cache_key', data);
   ```

3. **Minimize network requests**

### User Experience

1. **Follow Telegram design guidelines:**
   - Use native components when possible
   - Match Telegram's color scheme
   - Respect user's theme preference

2. **Provide haptic feedback:**
   ```tsx
   // On button clicks
   hapticFeedback('impact', 'light');
   
   // On success/error
   hapticFeedback('notification', 'success');
   ```

3. **Handle offline state gracefully**

### TON Integration

1. **Use TON Connect for wallet:**
   ```tsx
   import { useTonConnect } from '@tonconnect/ui-react';
   ```

2. **Show transaction status:**
   ```tsx
   webApp.MainButton.showProgress();
   await sendTransaction();
   webApp.MainButton.hideProgress();
   ```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: "Bot not responding"**
- Solution: Ensure bot token is correct
- Check bot is not blocked
- Verify webhook/polling is configured

**Issue: "Mini App not loading"**
- Solution: URL must be HTTPS
- Check CORS headers
- Verify bot configuration in BotFather

**Issue: "Init data validation failing"**
- Solution: Check bot token matches
- Ensure timestamp is recent
- Verify hash calculation

**Issue: "Haptic feedback not working"**
- Solution: Only works on mobile devices
- Check user permissions
- Ensure Telegram app is updated

### Debug Checklist

- [ ] Bot token is correct in .env
- [ ] HTTPS URL is configured
- [ ] Telegram Web App SDK is loaded
- [ ] TelegramProvider wraps the app
- [ ] Init data validation is working
- [ ] User authentication is successful
- [ ] TON Connect manifest is accessible

---

## 📞 Support & Resources

### Documentation
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [TON Documentation](https://docs.ton.org)
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)

### Community
- [Alpha TON Capital Discord](https://discord.gg/alphatoncapital)
- [TON Dev Chat](https://t.me/tondev)
- [Telegram Bot Developers](https://t.me/BotDevelopers)

### Examples
- [Mini App Examples](https://github.com/telegram-mini-apps)
- [TON DApp Examples](https://github.com/ton-community)
- [This Scaffold](https://github.com/AlphaTONCapital/ton-scaffolding)

---

## 🏁 Next Steps

1. **Set up your bot** with BotFather
2. **Configure environment** variables
3. **Test locally** with ngrok
4. **Implement your features** using the provided hooks and utilities
5. **Deploy to production** when ready
6. **Submit to hackathon** 🎉

Good luck building on TON! 🚀
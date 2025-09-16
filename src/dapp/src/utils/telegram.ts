// Telegram Mini App Utilities

/**
 * Check if the app is running inside Telegram
 */
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && window.Telegram?.WebApp !== undefined;
};

/**
 * Get Telegram WebApp instance
 */
export const getTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    return window.Telegram!.WebApp;
  }
  return null;
};

/**
 * Parse Telegram init data
 */
export const parseTelegramInitData = (initData: string): Record<string, string> => {
  const params = new URLSearchParams(initData);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

/**
 * Format TON amount for display
 */
export const formatTONAmount = (amount: bigint | string | number): string => {
  const nanotons = BigInt(amount);
  const tons = Number(nanotons) / 1_000_000_000;
  
  if (tons < 0.001) {
    return '< 0.001 TON';
  }
  
  return `${tons.toFixed(3)} TON`;
};

/**
 * Open a link in Telegram or browser
 */
export const openLink = (url: string, inTelegram = false) => {
  const webApp = getTelegramWebApp();
  
  if (webApp && inTelegram) {
    webApp.openTelegramLink(url);
  } else if (webApp) {
    webApp.openLink(url);
  } else {
    window.open(url, '_blank');
  }
};

/**
 * Share content via Telegram
 */
export const shareToTelegram = (text: string, url?: string) => {
  const shareUrl = url || window.location.href;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  openLink(telegramUrl, true);
};

/**
 * Copy text to clipboard (with Telegram support)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  const webApp = getTelegramWebApp();
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Request phone number from Telegram user
 */
export const requestPhoneNumber = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webApp = getTelegramWebApp();
    
    if (!webApp) {
      resolve(false);
      return;
    }
    
    webApp.requestContact((sent) => {
      resolve(sent);
    });
  });
};

/**
 * Scan QR code using Telegram
 */
export const scanQRCode = (instructionText?: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const webApp = getTelegramWebApp();
    
    if (!webApp) {
      resolve(null);
      return;
    }
    
    webApp.showScanQrPopup(
      { text: instructionText || 'Scan QR code' },
      (text) => {
        webApp.closeScanQrPopup();
        resolve(text);
      }
    );
  });
};

/**
 * Show loading indicator in main button
 */
export const showMainButtonLoader = (show: boolean) => {
  const webApp = getTelegramWebApp();
  
  if (!webApp?.MainButton) return;
  
  if (show) {
    webApp.MainButton.showProgress();
  } else {
    webApp.MainButton.hideProgress();
  }
};

/**
 * Vibrate device (using Telegram Haptic Feedback)
 */
export const vibrate = (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' = 'medium') => {
  const webApp = getTelegramWebApp();
  
  if (!webApp?.HapticFeedback) return;
  
  switch (type) {
    case 'success':
    case 'warning':
    case 'error':
      webApp.HapticFeedback.notificationOccurred(type);
      break;
    case 'light':
    case 'medium':
    case 'heavy':
      webApp.HapticFeedback.impactOccurred(type);
      break;
  }
};

/**
 * Enable/disable closing confirmation
 */
export const setClosingConfirmation = (enabled: boolean) => {
  const webApp = getTelegramWebApp();
  
  if (!webApp) return;
  
  if (enabled) {
    webApp.enableClosingConfirmation();
  } else {
    webApp.disableClosingConfirmation();
  }
};

/**
 * Get platform info
 */
export const getPlatformInfo = () => {
  const webApp = getTelegramWebApp();
  
  if (!webApp) {
    return {
      platform: 'unknown',
      version: '0.0.0',
      isDesktop: false,
      isMobile: false,
    };
  }
  
  const platform = webApp.platform;
  const version = webApp.version;
  
  return {
    platform,
    version,
    isDesktop: ['macos', 'windows', 'web'].includes(platform),
    isMobile: ['ios', 'android'].includes(platform),
  };
};

/**
 * Biometric authentication helper
 */
export const useBiometrics = () => {
  const webApp = getTelegramWebApp();
  const biometricManager = webApp?.BiometricManager;
  
  const init = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!biometricManager) {
        resolve(false);
        return;
      }
      
      biometricManager.init(() => {
        resolve(biometricManager.isBiometricAvailable);
      });
    });
  };
  
  const requestAccess = (reason?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!biometricManager || !biometricManager.isBiometricAvailable) {
        resolve(false);
        return;
      }
      
      biometricManager.requestAccess(
        { reason: reason || 'Please authenticate to continue' },
        (granted) => resolve(granted)
      );
    });
  };
  
  const authenticate = (reason?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!biometricManager || !biometricManager.isAccessGranted) {
        resolve(false);
        return;
      }
      
      biometricManager.authenticate(
        { reason: reason || 'Please verify your identity' },
        (success) => resolve(success)
      );
    });
  };
  
  return {
    init,
    requestAccess,
    authenticate,
    isAvailable: biometricManager?.isBiometricAvailable || false,
    isAccessGranted: biometricManager?.isAccessGranted || false,
    biometricType: biometricManager?.biometricType || 'unknown',
  };
};
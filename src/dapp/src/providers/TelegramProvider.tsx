import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Telegram WebApp type definitions
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  
  CloudStorage: {
    setItem: (key: string, value: string, callback?: (error: Error | null) => void) => void;
    getItem: (key: string, callback: (error: Error | null, value?: string) => void) => void;
    getItems: (keys: string[], callback: (error: Error | null, values?: Record<string, string>) => void) => void;
    removeItem: (key: string, callback?: (error: Error | null) => void) => void;
    removeItems: (keys: string[], callback?: (error: Error | null) => void) => void;
    getKeys: (callback: (error: Error | null, keys?: string[]) => void) => void;
  };
  
  BiometricManager: {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: 'finger' | 'face' | 'unknown';
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    deviceId: string;
    init: (callback?: () => void) => void;
    requestAccess: (params: { reason?: string }, callback?: (granted: boolean) => void) => void;
    authenticate: (params: { reason?: string }, callback?: (success: boolean) => void) => void;
    updateBiometricToken: (token: string, callback?: (updated: boolean) => void) => void;
    openSettings: () => void;
  };
  
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: TelegramChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId?: string) => void) => void;
  
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  
  showScanQrPopup: (params?: { text?: string }, callback?: (text: string | null) => void) => void;
  closeScanQrPopup: () => void;
  
  readTextFromClipboard: (callback: (text: string | null) => void) => void;
  
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (sent: boolean) => void) => void;
  
  invokeCustomMethod: (method: string, params?: any, callback?: (result: any) => void) => void;
  
  sendData: (data: string) => void;
}

interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isInTelegram: boolean;
  isReady: boolean;
  startParam: string | null;
  colorScheme: 'light' | 'dark';
  hapticFeedback: (type: 'impact' | 'notification' | 'selection', style?: string) => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  showPopup: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  openLink: (url: string) => void;
  close: () => void;
  expand: () => void;
  cloudStorage: {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
  };
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    
    if (telegram) {
      telegram.ready();
      telegram.expand();
      
      setWebApp(telegram);
      setIsReady(true);
      setUser(telegram.initDataUnsafe.user || null);
      setColorScheme(telegram.colorScheme);
      
      // Apply Telegram theme
      if (telegram.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.themeParams.bg_color);
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.themeParams.button_color || '#3390ec');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', telegram.themeParams.button_text_color || '#ffffff');
      }
    }
  }, []);

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: string) => {
    if (!webApp?.HapticFeedback) return;
    
    switch (type) {
      case 'impact':
        webApp.HapticFeedback.impactOccurred((style as any) || 'medium');
        break;
      case 'notification':
        webApp.HapticFeedback.notificationOccurred((style as any) || 'success');
        break;
      case 'selection':
        webApp.HapticFeedback.selectionChanged();
        break;
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (!webApp?.MainButton) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  };

  const hideMainButton = () => {
    webApp?.MainButton?.hide();
  };

  const showBackButton = (onClick: () => void) => {
    if (!webApp?.BackButton) return;
    
    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();
  };

  const hideBackButton = () => {
    webApp?.BackButton?.hide();
  };

  const showPopup = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!webApp) {
        alert(message);
        resolve();
        return;
      }
      
      webApp.showAlert(message, () => resolve());
    });
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!webApp) {
        resolve(window.confirm(message));
        return;
      }
      
      webApp.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  };

  const openLink = (url: string) => {
    if (!webApp) {
      window.open(url, '_blank');
      return;
    }
    
    webApp.openLink(url);
  };

  const close = () => {
    webApp?.close();
  };

  const expand = () => {
    webApp?.expand();
  };

  const cloudStorage = {
    setItem: (key: string, value: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!webApp?.CloudStorage) {
          localStorage.setItem(key, value);
          resolve();
          return;
        }
        
        webApp.CloudStorage.setItem(key, value, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    },
    
    getItem: (key: string): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        if (!webApp?.CloudStorage) {
          resolve(localStorage.getItem(key));
          return;
        }
        
        webApp.CloudStorage.getItem(key, (error, value) => {
          if (error) reject(error);
          else resolve(value || null);
        });
      });
    },
    
    removeItem: (key: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!webApp?.CloudStorage) {
          localStorage.removeItem(key);
          resolve();
          return;
        }
        
        webApp.CloudStorage.removeItem(key, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    },
  };

  const value: TelegramContextType = {
    webApp,
    user,
    isInTelegram: !!webApp,
    isReady,
    startParam: webApp?.initDataUnsafe.start_param || null,
    colorScheme,
    hapticFeedback,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showPopup,
    showConfirm,
    openLink,
    close,
    expand,
    cloudStorage,
  };

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
};

export default TelegramProvider;
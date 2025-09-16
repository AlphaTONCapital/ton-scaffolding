import { useEffect, useState } from 'react';
import { useTelegram } from '../providers/TelegramProvider';
import crypto from 'crypto-js';

interface TelegramAuthData {
  isAuthenticated: boolean;
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  isPremium?: boolean;
  languageCode?: string;
  authDate?: number;
  hash?: string;
}

export const useTelegramAuth = () => {
  const { webApp, user, isInTelegram } = useTelegram();
  const [authData, setAuthData] = useState<TelegramAuthData>({
    isAuthenticated: false,
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isInTelegram && user) {
      validateAndSetAuthData();
    }
  }, [isInTelegram, user]);

  const validateAndSetAuthData = async () => {
    if (!webApp || !user) {
      setAuthData({ isAuthenticated: false });
      return;
    }

    setIsValidating(true);

    try {
      // Validate init data if enabled
      const shouldValidate = import.meta.env.VITE_TELEGRAM_VALIDATE_INIT_DATA === 'true';
      
      if (shouldValidate) {
        const isValid = await validateInitData(webApp.initData);
        if (!isValid) {
          console.error('Invalid Telegram init data');
          setAuthData({ isAuthenticated: false });
          setIsValidating(false);
          return;
        }
      }

      // Set authenticated user data
      setAuthData({
        isAuthenticated: true,
        userId: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        isPremium: user.is_premium,
        languageCode: user.language_code,
        authDate: webApp.initDataUnsafe.auth_date,
        hash: webApp.initDataUnsafe.hash,
      });
    } catch (error) {
      console.error('Error validating Telegram auth:', error);
      setAuthData({ isAuthenticated: false });
    } finally {
      setIsValidating(false);
    }
  };

  const validateInitData = async (initData: string): Promise<boolean> => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.warn('Bot token not configured, skipping validation');
      return true;
    }

    try {
      // Parse the init data
      const params = new URLSearchParams(initData);
      const hash = params.get('hash');
      params.delete('hash');

      // Sort parameters alphabetically
      const sortedParams = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Calculate the secret key
      const secretKey = crypto.HmacSHA256(botToken, 'WebAppData').toString();
      
      // Calculate the hash
      const calculatedHash = crypto.HmacSHA256(sortedParams, secretKey).toString();

      // Compare hashes
      return calculatedHash === hash;
    } catch (error) {
      console.error('Error validating init data:', error);
      return false;
    }
  };

  const login = async (): Promise<boolean> => {
    if (!isInTelegram) {
      console.error('Not in Telegram environment');
      return false;
    }

    if (authData.isAuthenticated) {
      return true;
    }

    // Re-validate auth data
    await validateAndSetAuthData();
    return authData.isAuthenticated;
  };

  const logout = () => {
    setAuthData({ isAuthenticated: false });
  };

  const getUserAvatar = (size: 'small' | 'medium' | 'large' = 'medium'): string | null => {
    if (!authData.photoUrl) return null;
    
    // Telegram provides photo URLs in different sizes
    // You can append size parameters if needed
    return authData.photoUrl;
  };

  const getDisplayName = (): string => {
    if (authData.username) return `@${authData.username}`;
    if (authData.firstName) {
      return authData.lastName 
        ? `${authData.firstName} ${authData.lastName}`
        : authData.firstName;
    }
    return 'Telegram User';
  };

  return {
    ...authData,
    isValidating,
    login,
    logout,
    getUserAvatar,
    getDisplayName,
    isInTelegram,
  };
};
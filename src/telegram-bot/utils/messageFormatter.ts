/**
 * Utility functions for formatting Telegram messages
 */

import { Address } from '@ton/core';

/**
 * Format wallet address for display
 */
export function formatAddress(address: string | Address, short = true): string {
  const addressStr = typeof address === 'string' ? address : address.toString();
  
  if (short) {
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  }
  
  return addressStr;
}

/**
 * Format TON amount for display
 */
export function formatTON(nanotons: bigint | string | number): string {
  const amount = BigInt(nanotons);
  const tons = Number(amount) / 1e9;
  
  if (tons < 0.001) {
    return `${(tons * 1e6).toFixed(2)} μTON`;
  } else if (tons < 1) {
    return `${(tons * 1000).toFixed(3)} mTON`;
  } else {
    return `${tons.toFixed(4)} TON`;
  }
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Format transaction status
 */
export function formatTransactionStatus(status: string): string {
  const statusEmoji: { [key: string]: string } = {
    pending: '⏳',
    success: '✅',
    failed: '❌',
    processing: '🔄'
  };
  
  return `${statusEmoji[status] || '❓'} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
}

/**
 * Create a progress bar
 */
export function createProgressBar(current: number, total: number, length = 10): string {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  return `${bar} ${percentage.toFixed(0)}%`;
}

/**
 * Format contract method name
 */
export function formatMethodName(method: string): string {
  // Convert snake_case or camelCase to readable format
  return method
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Create a transaction summary message
 */
export function createTransactionSummary(tx: {
  hash?: string;
  from?: string;
  to?: string;
  amount?: bigint;
  fee?: bigint;
  timestamp?: number;
  status?: string;
  message?: string;
}): string {
  const lines: string[] = [
    '📋 **Transaction Summary**',
    ''
  ];
  
  if (tx.hash) {
    lines.push(`🔗 Hash: \`${tx.hash.slice(0, 8)}...\``);
  }
  
  if (tx.from) {
    lines.push(`📤 From: \`${formatAddress(tx.from)}\``);
  }
  
  if (tx.to) {
    lines.push(`📥 To: \`${formatAddress(tx.to)}\``);
  }
  
  if (tx.amount !== undefined) {
    lines.push(`💰 Amount: ${formatTON(tx.amount)}`);
  }
  
  if (tx.fee !== undefined) {
    lines.push(`⛽ Fee: ${formatTON(tx.fee)}`);
  }
  
  if (tx.timestamp) {
    lines.push(`🕐 Time: ${formatTimestamp(tx.timestamp)}`);
  }
  
  if (tx.status) {
    lines.push(`📊 Status: ${formatTransactionStatus(tx.status)}`);
  }
  
  if (tx.message) {
    lines.push(`💬 Message: ${tx.message}`);
  }
  
  return lines.join('\\n');
}

/**
 * Create a wallet info message
 */
export function createWalletInfo(wallet: {
  address: string;
  balance: bigint;
  transactions?: number;
  lastActivity?: number;
}): string {
  const lines: string[] = [
    '👛 **Wallet Information**',
    '',
    `📍 Address: \`${wallet.address}\``,
    `💰 Balance: ${formatTON(wallet.balance)}`
  ];
  
  if (wallet.transactions !== undefined) {
    lines.push(`📊 Transactions: ${wallet.transactions}`);
  }
  
  if (wallet.lastActivity) {
    lines.push(`🕐 Last Activity: ${formatTimestamp(wallet.lastActivity)}`);
  }
  
  return lines.join('\\n');
}

/**
 * Create an error message
 */
export function createErrorMessage(error: string | Error, showDetails = false): string {
  const errorMessage = error instanceof Error ? error.message : error;
  
  const lines: string[] = [
    '❌ **Error Occurred**',
    '',
    `Message: ${errorMessage}`
  ];
  
  if (showDetails && error instanceof Error && error.stack) {
    lines.push('', '```');
    lines.push(error.stack.slice(0, 200) + '...');
    lines.push('```');
  }
  
  lines.push('', '💡 Please try again or contact support if the issue persists.');
  
  return lines.join('\\n');
}

/**
 * Create a success message
 */
export function createSuccessMessage(title: string, details?: string): string {
  const lines: string[] = [
    `✅ **${title}**`
  ];
  
  if (details) {
    lines.push('', details);
  }
  
  return lines.join('\\n');
}

/**
 * Escape markdown special characters
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}
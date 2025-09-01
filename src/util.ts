export function ping(roleId: string): string {
  if (!roleId) return '';
  return `<@&${roleId}>`;
}

/**
 * Adds zero-width spaces to break up links and prevent them from embedding in Discord.
 */
export function breakLinks(message: string): string {
  return message.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return url.split('').join('\u200B');
  });
}

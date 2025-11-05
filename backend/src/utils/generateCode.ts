export function generateReferralCode(nameOrEmail: string) {
    const base = (nameOrEmail.split('@')[0] || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${base.slice(0,6)}-${rand}`;
  }
  
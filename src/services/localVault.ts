export interface PrivacyReport {
  isLocalSafe: boolean;
  scrubbedCount: number;
  scrubbedItems: string[];
  bytesEgress: number;
  vaultStatus: '100% On-Device' | 'Shielded';
}

class LocalVaultService {
  private piiPatterns = [
    { type: 'API Key', regex: /(?:AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36})/g },
    { type: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { type: 'IP Address', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
    { type: 'Private Key', regex: /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]+?-----END [A-Z ]+ PRIVATE KEY-----/g },
    { type: 'Password token', regex: /(?:password|secret|token)\s*[:=]\s*["']?([^"' \n]+)["']?/gi },
  ];

  public scrubPII(text: string): { sanitized: string; report: PrivacyReport } {
    let sanitized = text;
    let scrubbedCount = 0;
    const scrubbedItems: string[] = [];

    for (const pattern of this.piiPatterns) {
      const matches = text.match(pattern.regex);
      if (matches) {
        scrubbedCount += matches.length;
        scrubbedItems.push(...matches.map(m => `[REDACTED ${pattern.type}]`));
        sanitized = sanitized.replace(pattern.regex, `[REDACTED ${pattern.type}]`);
      }
    }

    return {
      sanitized,
      report: {
        isLocalSafe: true,
        scrubbedCount,
        scrubbedItems,
        bytesEgress: 0,
        vaultStatus: '100% On-Device',
      },
    };
  }

  // Load from LocalStorage with fallback
  public getStoredData<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`elfaclaw_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public setStoredData<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`elfaclaw_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
}

export const localVault = new LocalVaultService();

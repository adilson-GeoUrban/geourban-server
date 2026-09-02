/**
 * CONTROL PLANE v1.0.0
 * Gerencia permissões e políticas para Luiza Bridge
 */

class ControlPlane {
  constructor() {
    this.name = 'ControlPlane';
    this.version = '1.0.0';
    this.policies = {
      'geourban': { allowed: true, maxRequests: 1000, timeout: 30000, allowedActions: ['execute_luiza'] },
      'dashboard': { allowed: true, maxRequests: 500, timeout: 30000, allowedActions: ['execute_luiza'] },
      'default': { allowed: true, maxRequests: 100, timeout: 30000, allowedActions: ['execute_luiza'] }
    };
    this.rateLimits = new Map();
  }

  async authorize(request) {
    const { userId, context, action } = request;
    if (!userId || !action) {
      return { allowed: false, reason: 'invalid_request' };
    }

    const ctx = context || 'default';
    const policy = this.policies[ctx] || this.policies['default'];

    if (!policy.allowed) {
      return { allowed: false, reason: `context_not_allowed` };
    }

    if (!policy.allowedActions.includes(action)) {
      return { allowed: false, reason: `action_not_allowed` };
    }

    const rateLimitKey = `${userId}:${ctx}`;
    const current = this.rateLimits.get(rateLimitKey) || 0;

    if (current >= policy.maxRequests) {
      return { allowed: false, reason: 'rate_limit_exceeded' };
    }

    this.rateLimits.set(rateLimitKey, current + 1);
    setTimeout(() => {
      const val = this.rateLimits.get(rateLimitKey) || 0;
      if (val <= 1) this.rateLimits.delete(rateLimitKey);
      else this.rateLimits.set(rateLimitKey, val - 1);
    }, 3600000);

    return { allowed: true };
  }

  getPolicy(context) {
    return this.policies[context] || this.policies['default'];
  }

  getStats() {
    return { name: this.name, version: this.version, policies: Object.keys(this.policies).length, activeLimits: this.rateLimits.size };
  }
}

module.exports = new ControlPlane();


/**
 * MISSION CONTRACT — GEOURBAN
 * Arquitetura-Mãe v1.1
 *
 * Contrato estrutural da missão.
 * Não executa ações.
 * Não concede autorização por si só.
 * Define identidade, propósito, contexto, escopo,
 * ações pretendidas e evidências necessárias.
 */

class MissionContract {
  constructor({
    missionId,
    actorId,
    purpose,
    context = {},
    scope = {},
    authorizedActions = [],
    evidenceRequired = []
  }) {
    this.missionId = missionId;
    this.actorId = actorId;
    this.purpose = purpose;

    this.context = context;
    this.scope = scope;

    this.authorizedActions = authorizedActions;
    this.evidenceRequired = evidenceRequired;

    this.status = 'created';
    this.createdAt = new Date().toISOString();
  }

  validate() {
    const errors = [];

    if (!this.missionId) errors.push('missionId_required');
    if (!this.actorId) errors.push('actorId_required');
    if (!this.purpose) errors.push('purpose_required');

    if (!Array.isArray(this.authorizedActions)) {
      errors.push('authorizedActions_must_be_array');
    }

    if (!Array.isArray(this.evidenceRequired)) {
      errors.push('evidenceRequired_must_be_array');
    }

    if (this.status !== 'created') {
      errors.push('invalid_initial_status');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  isActionDeclared(action) {
    return this.authorizedActions.includes(action);
  }

  requiresEvidence(evidenceType) {
    return this.evidenceRequired.includes(evidenceType);
  }

  getSummary() {
    return {
      missionId: this.missionId,
      actorId: this.actorId,
      purpose: this.purpose,
      context: this.context,
      scope: this.scope,
      authorizedActions: this.authorizedActions,
      evidenceRequired: this.evidenceRequired,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

module.exports = MissionContract;

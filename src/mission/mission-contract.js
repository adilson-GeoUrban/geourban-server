/**
 * MISSION CONTRACT — GEOURBAN
 * Arquitetura-Mãe v1.0
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
}

module.exports = MissionContract;

const MissionContract = require('./mission-contract');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// 1. Missão válida
const mission = new MissionContract({
  missionId: 'MISSION-TEST-001',
  actorId: 'human:test',
  purpose: 'Teste estrutural da Arquitetura-Mãe',
  context: {
    system: 'geourban',
    environment: 'lab'
  },
  scope: {
    resources: ['test']
  },
  authorizedActions: ['test_action'],
  evidenceRequired: ['audit']
});

const validation = mission.validate();

assert(validation.valid === true, 'Missão válida foi rejeitada');
assert(validation.errors.length === 0, 'Missão válida possui erros');

// 2. Ação declarada
assert(
  mission.isActionDeclared('test_action') === true,
  'Ação declarada não foi reconhecida'
);

// 3. Ação não declarada
assert(
  mission.isActionDeclared('execute_luiza') === false,
  'Ação não declarada foi aceita'
);

// 4. Evidência obrigatória
assert(
  mission.requiresEvidence('audit') === true,
  'Evidência obrigatória não foi reconhecida'
);

// 5. Missão inválida
const invalidMission = new MissionContract({
  purpose: 'Teste inválido'
});

const invalidValidation = invalidMission.validate();

assert(
  invalidValidation.valid === false,
  'Missão inválida foi aceita'
);

assert(
  invalidValidation.errors.includes('missionId_required'),
  'missionId_required não foi detectado'
);

assert(
  invalidValidation.errors.includes('actorId_required'),
  'actorId_required não foi detectado'
);

console.log('MISSION CONTRACT TEST: PASS');

/**
 * LUIZA BRIDGE v1.0.0
 * Adaptador controlado entre GeoUrban e Luiza Evolutiva
 * Interface REAL: POST /api/luiza { input: string }
 */

const http = require('http');
const AuditBridge = require('./audit-bridge');
const ControlPlane = require('../control-plane/control-plane');

class LuizaBridge {
  constructor(config = {}) {
    this.name = 'LuizaBridge';
    this.version = '1.0.0';
    this.config = {
      luizaHost: config.luizaHost || process.env.LUIZA_HOST || 'luiza-lab-production-8cf5.up.railway.app',
      luizaPort: config.luizaPort || process.env.LUIZA_PORT || 80,
      useHttps: config.useHttps || process.env.LUIZA_HTTPS === 'true' || false,
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      auditEnabled: config.auditEnabled !== false,
      ...config
    };
    this.audit = AuditBridge;
    this.controlPlane = ControlPlane;
    this.requestCounter = 0;
  }

  async process(request) {
    this.requestCounter++;
    const requestId = `REQ-${Date.now()}-${this.requestCounter}`;
    const startTime = Date.now();

    if (!request || !request.input) {
      this.audit.log('bridge.request.invalid', {
        requestId,
        reason: 'missing_input'
      });
      return { ok: false, message: 'Input obrigatório', requestId, duration: Date.now() - startTime };
    }

    this.audit.log('bridge.request.received', {
      requestId,
      input: request.input.substring(0, 100),
      context: request.context || 'default',
      userId: request.userId || 'anonymous'
    });

    const permission = await this.controlPlane.authorize({
      userId: request.userId || 'anonymous',
      context: request.context || 'default',
      action: 'execute_luiza'
    });

    if (!permission.allowed) {
      this.audit.log('bridge.authorization.denied', {
        requestId,
        reason: permission.reason
      });
      return {
        ok: false,
        message: `Autorização negada: ${permission.reason}`,
        requestId,
        blocked: true,
        duration: Date.now() - startTime
      };
    }

    this.audit.log('bridge.authorization.granted', { requestId });

    let luizaResponse;
    try {
      luizaResponse = await this.callLuiza({ input: request.input }, this.config.timeout);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.audit.log('bridge.luiza.error', {
        requestId,
        error: error.message,
        duration
      });
      return {
        ok: false,
        message: `Erro ao chamar Luiza: ${error.message}`,
        requestId,
        duration
      };
    }

    const response = this.processResponse(luizaResponse, request);
    const duration = Date.now() - startTime;
    this.audit.log('bridge.request.completed', {
      requestId,
      success: response.ok,
      duration
    });

    return { ...response, requestId, duration };
  }

  callLuiza(payload, timeout) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      const protocol = this.config.useHttps ? require('https') : http;

      const options = {
        hostname: this.config.luizaHost,
        port: this.config.luizaPort,
        path: '/api/luiza',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout
      };

      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Resposta inválida de Luiza`));
          }
        });
      });

      req.on('error', error => {
        reject(new Error(`Conexão com Luiza falhou: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Timeout ao chamar Luiza`));
      });

      req.write(postData);
      req.end();
    });
  }

  processResponse(luizaResponse, originalRequest) {
    if (!luizaResponse.ok) {
      return {
        ok: false,
        message: luizaResponse.message || 'Erro desconhecido',
        blocked: luizaResponse.blocked || false
      };
    }

    return {
      ok: true,
      message: luizaResponse.message,
      input: luizaResponse.input,
      perception: luizaResponse.perception || null,
      reasoning: luizaResponse.reasoning || null,
      interpretation: luizaResponse.interpretation || null,
      execution: luizaResponse.execution || null,
      executed: luizaResponse.executed || false,
      context: originalRequest.context || 'default'
    };
  }

  getAuditLog(filter = {}) {
    return this.audit.getLog(filter);
  }

  getStatus() {
    return {
      ok: true,
      name: this.name,
      version: this.version,
      requestCount: this.requestCounter,
      luizaConfig: {
        host: this.config.luizaHost,
        port: this.config.luizaPort
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new LuizaBridge();


/**
 * AUDIT LOGGER - BRIDGE
 * Rastreia integração GeoUrban ↔ Luiza
 */

class AuditBridgeLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 5000;
  }

  log(eventType, data = {}) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, eventType, data, sequence: this.logs.length + 1 };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();
    console.log(`[BRIDGE-AUDIT ${timestamp}] ${eventType}:`, JSON.stringify(data));
    return entry;
  }

  getLog(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return this.logs;
    return this.logs.filter(entry => {
      for (const key in filter) {
        if (entry.data[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  getByRequestId(requestId) {
    return this.logs.filter(entry => entry.data.requestId === requestId);
  }

  getStats() {
    const stats = { totalEntries: this.logs.length, byEventType: {} };
    this.logs.forEach(entry => {
      stats.byEventType[entry.eventType] = (stats.byEventType[entry.eventType] || 0) + 1;
    });
    return stats;
  }

  clear() {
    this.logs = [];
  }
}

module.exports = new AuditBridgeLogger();


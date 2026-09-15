/**
 * @typedef {object} TerminalLog
 * @property {string} id
 * @property {string} text
 * @property {'normal'|'warning'|'error'|'success'|'highlight'} [type]
 * @property {string} [timestamp]
 */
export const TerminalLog = {};

/**
 * @typedef {object} SystemTelemetry
 * @property {number} integrity
 * @property {string} daemon
 * @property {string} packetLoss
 * @property {string} memConsumption
 * @property {string} enclaveStatus
 * @property {string} location
 * @property {string} errorCode
 * @property {string} requiredRank
 */
export const SystemTelemetry = {};

export interface TerminalLog {
  id: string;
  text: string;
  type?: 'normal' | 'warning' | 'error' | 'success' | 'highlight';
  timestamp?: string;
}

export interface SystemTelemetry {
  integrity: number;
  daemon: string;
  packetLoss: string;
  memConsumption: string;
  enclaveStatus: string;
  location: string;
  errorCode: string;
  requiredRank: string;
}

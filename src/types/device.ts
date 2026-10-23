export interface ColorTank {
  id: string;
  name: string;
  label: string;
  chemicalName: string;
  colorHex: string;
  currentVolumeMl: number;
  maxCapacityMl: number;
  isPumping?: boolean;
  lowThresholdMl: number;
}

export interface DeviceTelemetry {
  firmwareVersion: string;
  pumpPressurePsi: number;
  glassTempCelsius: number;
  sensorFps: number;
  criIndex: number;
  deviceStatus: 'STANDBY' | 'AUTONOMOUS_SCAN' | 'MIXING_DISPENSE' | 'QUALITY_AUDIT';
}

export interface RealityScanResponse {
  patterns: string[];
  beliefs: string[];
  distortions: string[];
  identityNarratives: string[];
  reframes: string[];
  newAssumptions: string[];
}

export interface IdentityDesignerResponse {
  reframedAssumption: string;
  identityShift: string;
  anchors: string[];
  narrativeUpgrade: string;
}

export interface SimulationPath {
  summary: string;
  steps: string[];
}

export interface SimulationDelta {
  behaviorChanges: string[];
  outcomeDifferences: string[];
  identityImpact: string[];
}

export interface SimulationResponse {
  pathA: SimulationPath;
  pathB: SimulationPath;
  delta: SimulationDelta;
}

export interface DailyCalibrationResponse {
  identityStatement: string;
  recommendedAction: string;
}


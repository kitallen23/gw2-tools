export type EncounterData = {
    durationMS: number;
    fightIcon: string;
    fightName: string;
    isCM: boolean;
    isLegendaryCM: boolean;
    phases: PhaseObject[];
    players: PlayerObject[];
    success: boolean;
};

export type PlayerObject = {
    name: string;
    account: string;
    healthPercents: [number, number][];
    profession: string;
    group: number;
    hasCommanderTag: boolean;
};
export type PhaseObject = {
    name: string;
    start: number;
    end: number;
    breakbarPhase: boolean;
};
export type HealthData = {
    players: PlayerObject[];
    phases: PhaseObject[];
    durationMS: number;
};

export type ParsedPlayerObject = {
    name: string;
    account: string;
    profession: string;
    group: number;
    hasCommanderTag: boolean;
};
export type ParsedHealthDataPoint = {
    label: string;
    isPlayer: boolean;
    healthPercents: [number, number][];
    msAboveThreshold: number;
    percentAboveThreshold: number;
};
export type ParsedPhaseObject = {
    name: string;
    start: number;
    end: number;
    breakbarPhase: boolean;
    healthData: ParsedHealthDataPoint[];
};
export type ParsedHealthData = {
    players: ParsedPlayerObject[];
    phases: ParsedPhaseObject[];
    duration: number;
};

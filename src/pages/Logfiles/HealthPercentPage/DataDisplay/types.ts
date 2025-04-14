export type TabItem = {
    value: string;
    name: string;
    profession: string | null;
    group: number | null;
    hasCommanderTag: boolean | null;
    percentAboveThreshold: number;
    msAboveThreshold: number;
    isPlayer: boolean;
};

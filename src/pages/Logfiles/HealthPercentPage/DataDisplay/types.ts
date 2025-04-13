export type TabItem = {
    account: string;
    name: string;
    profession: string | null;
    group: number | null;
    hasCommanderTag: boolean | null;
    percentAboveThreshold: number;
    msAboveThreshold: number;
    isPlayer: boolean;
};

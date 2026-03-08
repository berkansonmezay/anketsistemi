export interface Period {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const DEFAULT_PERIODS: Period[] = [
    { id: 1, name: '2023-2024 Güz', startDate: '2023-09-01', endDate: '2024-01-30', isActive: false },
    { id: 2, name: '2023-2024 Bahar', startDate: '2024-02-01', endDate: '2024-06-30', isActive: true },
];

const STORAGE_KEY = 'survey_system_periods';

export const periodService = {
    getPeriods(): Period[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return DEFAULT_PERIODS;
            }
        }
        return DEFAULT_PERIODS;
    },

    savePeriods(periods: Period[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
        // Dispatch custom event to notify other components in same tab
        window.dispatchEvent(new Event('periodsUpdated'));
    },

    getActivePeriod(): Period | undefined {
        return this.getPeriods().find(p => p.isActive);
    }
};

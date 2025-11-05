import { Driver, TestResult } from '@/types';

const DRIVERS_KEY = 'driver_testing_drivers';
const RESULTS_KEY = 'driver_testing_results';

export const storage = {
  // Drivers
  getDrivers: (): Driver[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(DRIVERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveDriver: (driver: Driver): void => {
    if (typeof window === 'undefined') return;
    const drivers = storage.getDrivers();
    drivers.push(driver);
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
  },

  getDriver: (id: string): Driver | undefined => {
    return storage.getDrivers().find(d => d.id === id);
  },

  // Test Results
  getResults: (): TestResult[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveResult: (result: TestResult): void => {
    if (typeof window === 'undefined') return;
    const results = storage.getResults();
    results.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  },

  getResultsByDriver: (driverId: string): TestResult[] => {
    return storage.getResults().filter(r => r.driverId === driverId);
  },

  // Export/Import
  exportData: (): string => {
    return JSON.stringify({
      drivers: storage.getDrivers(),
      results: storage.getResults(),
      exportDate: new Date().toISOString()
    }, null, 2);
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.drivers && data.results) {
        localStorage.setItem(DRIVERS_KEY, JSON.stringify(data.drivers));
        localStorage.setItem(RESULTS_KEY, JSON.stringify(data.results));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DRIVERS_KEY);
    localStorage.removeItem(RESULTS_KEY);
  }
};

'use client';

import { useState, useEffect } from 'react';
import { Driver, TestResult } from '@/types';
import { storage } from '@/lib/storage';
import DriverRegistration from '@/components/DriverRegistration';
import TestScreen from '@/components/TestScreen';
import ResultsScreen from '@/components/ResultsScreen';
import HistoryScreen from '@/components/HistoryScreen';

type Screen = 'home' | 'register' | 'test' | 'results' | 'history';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [allResults, setAllResults] = useState<TestResult[]>([]);

  useEffect(() => {
    setAllResults(storage.getResults());
  }, []);

  const handleDriverRegistered = (driver: Driver) => {
    setCurrentDriver(driver);
    setCurrentScreen('test');
  };

  const handleTestCompleted = (result: TestResult) => {
    setTestResult(result);
    setAllResults(storage.getResults());
    setCurrentScreen('results');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setCurrentDriver(null);
    setTestResult(null);
  };

  const handleExportData = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `driver-tests-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (storage.importData(content)) {
            setAllResults(storage.getResults());
            alert('Данные успешно импортированы!');
          } else {
            alert('Ошибка импорта данных!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentScreen === 'home' && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Система тестирования водителей
              </h1>
              <p className="text-xl text-gray-600">
                Проверьте свои знания правил дорожного движения
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setCurrentScreen('register')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">🚗</div>
                <h2 className="text-2xl font-bold mb-2">Начать тест</h2>
                <p className="text-blue-100">Пройдите тестирование по ПДД</p>
              </button>

              <button
                onClick={() => setCurrentScreen('history')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2">История тестов</h2>
                <p className="text-purple-100">
                  Просмотрите результаты ({allResults.length})
                </p>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Управление данными
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExportData}
                  className="flex-1 min-w-[200px] bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  📥 Экспортировать данные
                </button>
                <button
                  onClick={handleImportData}
                  className="flex-1 min-w-[200px] bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📤 Импортировать данные
                </button>
                <button
                  onClick={() => {
                    if (confirm('Вы уверены? Все данные будут удалены!')) {
                      storage.clearAll();
                      setAllResults([]);
                      alert('Все данные удалены!');
                    }
                  }}
                  className="flex-1 min-w-[200px] bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Очистить все данные
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'register' && (
        <DriverRegistration
          onDriverRegistered={handleDriverRegistered}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'test' && currentDriver && (
        <TestScreen
          driver={currentDriver}
          onTestCompleted={handleTestCompleted}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'results' && testResult && (
        <ResultsScreen result={testResult} onBack={handleBackToHome} />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen results={allResults} onBack={handleBackToHome} />
      )}
    </div>
  );
}

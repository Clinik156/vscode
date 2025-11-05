'use client';

import { TestResult } from '@/types';

interface Props {
  results: TestResult[];
  onBack: () => void;
}

export default function HistoryScreen({ results, onBack }: Props) {
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) /
            results.length
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          ← Назад
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              История тестирования
            </h2>
            <p className="text-gray-600">
              Все результаты пройденных тестов
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {totalTests}
              </div>
              <div className="text-gray-600">Всего тестов</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {passedTests}
              </div>
              <div className="text-gray-600">Успешно пройдено</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {averageScore}%
              </div>
              <div className="text-gray-600">Средний балл</div>
            </div>
          </div>
        </div>

        {/* Results list */}
        {sortedResults.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Нет результатов
            </h3>
            <p className="text-gray-600">
              Пройдите первый тест, чтобы увидеть результаты здесь
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResults.map((result) => {
              const percentage = Math.round(
                (result.score / result.totalQuestions) * 100
              );

              return (
                <div
                  key={result.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Status icon */}
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        result.passed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {result.passed ? '✓' : '✗'}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.driverName}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            result.passed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {result.passed ? 'Пройден' : 'Не пройден'}
                        </span>
                      </div>

                      <div className="text-gray-600 text-sm mb-3">
                        {new Date(result.date).toLocaleString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>
                              {result.score} из {result.totalQuestions} правильных
                            </span>
                            <span>{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                result.passed
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-red-500 to-orange-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

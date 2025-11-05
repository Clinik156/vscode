'use client';

import { TestResult } from '@/types';
import { questions } from '@/data/questions';

interface Props {
  result: TestResult;
  onBack: () => void;
}

export default function ResultsScreen({ result, onBack }: Props) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Result Header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">
              {result.passed ? '🎉' : '😔'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Тест пройден!' : 'Тест не пройден'}
            </h2>
            <p className="text-xl text-gray-600">{result.driverName}</p>
          </div>

          {/* Score */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result.score}
              </div>
              <div className="text-gray-600">Правильных ответов</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {percentage}%
              </div>
              <div className="text-gray-600">Процент успеха</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {result.totalQuestions}
              </div>
              <div className="text-gray-600">Всего вопросов</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Результат</span>
              <span>Минимум для прохождения: 80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  result.passed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Date */}
          <div className="text-center text-gray-600 mb-6">
            Дата прохождения: {new Date(result.date).toLocaleString('ru-RU')}
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Вернуться на главную
          </button>
        </div>

        {/* Detailed answers */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Детальные результаты
          </h3>

          <div className="space-y-6">
            {result.answers.map((answer, index) => {
              const question = questions.find(q => q.id === answer.questionId);
              if (!question) return null;

              return (
                <div
                  key={answer.questionId}
                  className={`border-2 rounded-xl p-6 ${
                    answer.correct
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`text-2xl flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        answer.correct
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {answer.correct ? '✓' : '✗'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-700">
                          Вопрос {index + 1}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                          {question.category === 'traffic-rules' && 'Правила'}
                          {question.category === 'signs' && 'Знаки'}
                          {question.category === 'situations' && 'Ситуации'}
                        </span>
                      </div>

                      <p className="text-gray-900 font-medium mb-3">
                        {question.question}
                      </p>

                      <div className="space-y-2">
                        {answer.selectedAnswer !== -1 && (
                          <div
                            className={`p-3 rounded-lg ${
                              answer.correct
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-red-100 border border-red-300'
                            }`}
                          >
                            <div className="text-sm text-gray-600 mb-1">
                              Ваш ответ:
                            </div>
                            <div className="font-medium">
                              {question.options[answer.selectedAnswer]}
                            </div>
                          </div>
                        )}

                        {!answer.correct && (
                          <div className="p-3 rounded-lg bg-green-100 border border-green-300">
                            <div className="text-sm text-gray-600 mb-1">
                              Правильный ответ:
                            </div>
                            <div className="font-medium">
                              {question.options[question.correctAnswer]}
                            </div>
                          </div>
                        )}

                        {answer.selectedAnswer === -1 && (
                          <div className="p-3 rounded-lg bg-gray-100 border border-gray-300">
                            <div className="text-gray-600">
                              Вопрос не был отвечен
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Driver, TestResult } from '@/types';
import { questions } from '@/data/questions';
import { storage } from '@/lib/storage';

interface Props {
  driver: Driver;
  onTestCompleted: (result: TestResult) => void;
  onBack: () => void;
}

export default function TestScreen({ driver, onTestCompleted, onBack }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishTest = () => {
    let correctCount = 0;
    const answers = questions.map((q, index) => {
      const correct = selectedAnswers[index] === q.correctAnswer;
      if (correct) correctCount++;
      return {
        questionId: q.id,
        selectedAnswer: selectedAnswers[index],
        correct
      };
    });

    const result: TestResult = {
      id: Date.now().toString(),
      driverId: driver.id,
      driverName: driver.fullName,
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: questions.length,
      passed: correctCount >= questions.length * 0.8, // 80% для прохождения
      answers
    };

    storage.saveResult(result);
    onTestCompleted(result);
  };

  const answeredCount = selectedAnswers.filter(a => a !== -1).length;

  if (showConfirmation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Завершить тестирование?
              </h2>
              <p className="text-gray-600 mb-2">
                Вы ответили на {answeredCount} из {questions.length} вопросов
              </p>
              {answeredCount < questions.length && (
                <p className="text-orange-600 mb-6">
                  Внимание: не все вопросы отвечены!
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Продолжить тест
                </button>
                <button
                  onClick={handleFinishTest}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          ← Выйти из теста
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {driver.fullName}
                </h2>
                <p className="text-gray-600">
                  Вопрос {currentQuestionIndex + 1} из {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Прогресс</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              {currentQuestion.category === 'traffic-rules' && '📋 Правила движения'}
              {currentQuestion.category === 'signs' && '🚦 Дорожные знаки'}
              {currentQuestion.category === 'situations' && '🚗 Ситуации'}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Назад
            </button>

            <div className="text-sm text-gray-600">
              Отвечено: {answeredCount} / {questions.length}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentQuestionIndex === questions.length - 1
                ? 'Завершить →'
                : 'Далее →'}
            </button>
          </div>
        </div>

        {/* Question navigator */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Навигация по вопросам
          </h4>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : selectedAnswers[index] !== -1
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Driver } from '@/types';
import { storage } from '@/lib/storage';

interface Props {
  onDriverRegistered: (driver: Driver) => void;
  onBack: () => void;
}

export default function DriverRegistration({ onDriverRegistered, onBack }: Props) {
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Введите ФИО');
      return;
    }

    if (!licenseNumber.trim()) {
      setError('Введите номер водительского удостоверения');
      return;
    }

    const driver: Driver = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      licenseNumber: licenseNumber.trim(),
      dateRegistered: new Date().toISOString()
    };

    storage.saveDriver(driver);
    onDriverRegistered(driver);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          ← Назад
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Регистрация водителя
            </h2>
            <p className="text-gray-600">
              Введите ваши данные для начала тестирования
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ФИО
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Номер водительского удостоверения
              </label>
              <input
                type="text"
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="1234 567890"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Начать тестирование
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

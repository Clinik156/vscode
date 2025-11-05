export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'traffic-rules' | 'signs' | 'situations';
}

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  dateRegistered: string;
}

export interface TestResult {
  id: string;
  driverId: string;
  driverName: string;
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: {
    questionId: number;
    selectedAnswer: number;
    correct: boolean;
  }[];
}

export interface TestSession {
  driver: Driver;
  currentQuestionIndex: number;
  answers: number[];
  startTime: string;
}

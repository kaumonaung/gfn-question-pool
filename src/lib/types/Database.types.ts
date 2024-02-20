export interface CategoryType {
  id: string;
  title: string;
  history: Array<{
    id: number;
    percentage: number;
  }>;
}

export interface QuestionType {
  id: string;
  category: string;
  question: string;
  correctAnswerCount: number;
  answers:
    | {
        id: number;
        answerText: string;
        isCorrect: boolean;
      }[]
    | null;
  meta: {
    timesAnswered: number;
    timesCorrect: number;
    timesIncorrect: number;
  };
}

export interface ProgressType {
  id: string;
  meta: {
    timesAnswered: number;
    timesCorrect: number;
    timesIncorrect: number;
  };
}

export interface CategoryProgressType {
  id: string;
  history: Array<{
    id: number;
    percentage: number;
  }>;
}

export interface AnswerType {
  questionId: string;
  question: string;
  category: string;
  answers: Array<{
    answerId: number;
    isCorrect: boolean;
  }>;
}

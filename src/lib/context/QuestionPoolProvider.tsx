'use client';

import questions from '@/lib/data/questions.json';

import { compress, decompress } from 'lz-string';

export const categories: Array<Category> = [
  {
    id: 'javascript-basics-part1',
    title: 'JavaScript Grundlagen (Teil 1)',
    history: [],
  },
  {
    id: 'javascript-basics-part2',
    title: 'JavaScript Grundlagen (Teil 2)',
    history: [],
  },
  {
    id: 'javascript-dom',
    title: 'JavaScript und das Dynamic Object Model: HTML mühelos manipuliert',
    history: [],
  },
  {
    id: 'object-oriented-programming',
    title: 'Objektorientierte Programmierung mit JavaScript',
    history: [],
  },
  {
    id: 'backend-javascript',
    title: 'Backend-Programmierung mit JavaScript',
    history: [],
  },
  {
    id: 'phaser-game-development',
    title: 'Phaser: Spieleentwicklung mit JavaScript',
    history: [],
  },
];

import {
  CategoryType as Category,
  CategoryProgressType as CategoryProgress,
  QuestionType as Question,
  ProgressType as Progress,
} from '@/lib/types/Database.types';
import { createContext, useContext, useEffect, useState } from 'react';

const QuestionPoolContext = createContext({
  questionPool: null as Question[] | null,
  categories: null as Category[] | null,
  updateQuestionPool: (updatedQuestions: Question[]) => {},
  updateCategoryHistory: (updatedCategories: Category[]) => {},
});

const QuestionPoolProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionPool, setQuestionPool] = useState<Question[] | null>(null);
  const [updatedCategories, setUpdatedCategories] = useState<Category[] | null>(
    null
  );
  const [progressHistory, setProgressHistory] = useState<Progress[] | null>(
    null
  );
  const [categoryHistory, setCategoryHistory] = useState<
    CategoryProgress[] | null
  >(null);

  useEffect(() => {
    const progress = localStorage.getItem('progress');
    const history = localStorage.getItem('categoryHistory');

    if (progress) {
      const decompressed = decompress(progress);
      setProgressHistory(JSON.parse(decompressed));
    }

    if (history) {
      const decompressed = decompress(history);
      setCategoryHistory(JSON.parse(decompressed));
    }
  }, []);

  // Map through the questions and adjust the meta data
  useEffect(() => {
    const updatedQuestions: Question[] = questions.map((question: Question) => {
      const progressItem = progressHistory?.find(
        (item: Progress) => item.id === question.id
      );

      return {
        ...question,
        meta: {
          timesAnswered: progressItem?.meta.timesAnswered || 0,
          timesCorrect: progressItem?.meta.timesCorrect || 0,
          timesIncorrect: progressItem?.meta.timesIncorrect || 0,
        },
      };
    });

    setQuestionPool(updatedQuestions);
  }, [progressHistory]);

  // Map through the categories and adjust the history
  useEffect(() => {
    const updatedCategories: Category[] = categories.map(
      (category: Category) => {
        const categoryHistoryItem = categoryHistory?.find(
          (item: CategoryProgress) => item.id === category.id
        );

        return {
          ...category,
          history: categoryHistoryItem?.history || [],
        };
      }
    );

    setUpdatedCategories(updatedCategories);
  }, [categoryHistory]);

  const updateQuestionPool = (updatedQuestions: Question[]) => {
    setQuestionPool(updatedQuestions);
    const compressed = compress(JSON.stringify(updatedQuestions));
    localStorage.setItem('progress', compressed);
  };

  const updateCategoryHistory = (updatedCategories: Category[]) => {
    setUpdatedCategories(updatedCategories);
    const compressed = compress(JSON.stringify(updatedCategories));
    localStorage.setItem('categoryHistory', compressed);
  };

  return (
    <QuestionPoolContext.Provider
      value={{
        questionPool,
        categories: updatedCategories,
        updateQuestionPool,
        updateCategoryHistory,
      }}
    >
      {children}
    </QuestionPoolContext.Provider>
  );
};

export const useQuestionPool = () => {
  return useContext(QuestionPoolContext);
};

export default QuestionPoolProvider;

'use client';

import { Card } from '@tremor/react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

import { CategoryType as Category } from '@/lib/types/Database.types';

type QuizCreatorProps = {
  maxQuestions: number;
  category: Category;
  amount: number;
  setAmount: (amount: number) => void;
  createQuiz: () => void;
  quizStarted: boolean;
};

const QuizCreator = ({
  maxQuestions,
  category,
  amount,
  setAmount,
  createQuiz,
  quizStarted,
}: QuizCreatorProps) => {
  if (quizStarted) {
    return null;
  }

  return (
    <Card
      className="mx-auto max-w-3xl py-10 h-full flex flex-col justify-between"
      decoration="top"
      decorationColor="blue"
    >
      <div>
        <h1 className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-2">
          {category.title}
        </h1>

        <div className="my-6">
          <div className="flex justify-between mb-4">
            <p className="text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Fragen: {amount}
            </p>

            <p className="flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              von {maxQuestions} Fragen
            </p>
          </div>

          <Slider
            max={maxQuestions}
            step={1}
            defaultValue={[amount]}
            onValueChange={(value: number[]) => setAmount(value[0])}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={createQuiz}>Quiz erstellen</Button>
        </div>
      </div>
    </Card>
  );
};

export default QuizCreator;

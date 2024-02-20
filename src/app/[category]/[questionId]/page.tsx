'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@tremor/react';
import PageContainer from '@/components/PageContainer';
import Navbar from '@/components/Navbar';

import { useState } from 'react';
import { useQuestionPool } from '@/lib/context/QuestionPoolProvider';

type QuestionPageParams = {
  params: {
    category: string;
    questionId: string;
  };
};

export default function QuestionPage({ params }: QuestionPageParams) {
  const { questionPool, categories } = useQuestionPool();
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questionPool || !categories) {
    return <PageContainer>Loading...</PageContainer>;
  }

  const category = categories.find(
    (category) => category.id === params.category
  );

  const question = questionPool.find(
    (question) => question.id === params.questionId
  );

  if (!category || !question) {
    return <PageContainer>Not found</PageContainer>;
  }

  const { question: questionTitle, answers } = question;
  const { timesCorrect, timesIncorrect } = question.meta;

  return (
    <>
      <Navbar />
      <PageContainer>
        <Card>
          <div className="flex justify-between">
            <h2 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              {category.title}
            </h2>

            <div className="flex space-x-4 text-center">
              <p className="text-emerald-600 dark:text-emerald-500 font-medium">
                {timesCorrect} richtig
              </p>
              <p className="text-rose-600 dark:text-rose-500 font-medium">
                {timesIncorrect} falsch
              </p>
            </div>
          </div>

          <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-2">
            {questionTitle}
          </h1>

          <div className="mt-6 flex flex-col gap-4">
            {answers?.map((answer) => {
              const { id, answerText } = answer;
              const isCorrect = showAnswer && answer.isCorrect;

              return (
                <Card
                  key={id}
                  decoration="left"
                  decorationColor={isCorrect ? 'emerald' : 'gray'}
                  className={`${
                    isCorrect && 'bg-emerald-50/80 dark:bg-emerald-900'
                  }`}
                >
                  <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong whitespace-pre-wrap font-medium">
                    {answerText}
                  </p>
                </Card>
              );
            })}
          </div>
        </Card>

        <div className="mt-10 flex justify-end">
          <Button onClick={() => setShowAnswer(!showAnswer)}>
            Antwort anzeigen
          </Button>
        </div>
      </PageContainer>
    </>
  );
}

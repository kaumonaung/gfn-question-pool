'use client';

import { useState, useEffect } from 'react';

import {
  AnswerType as Answer,
  QuestionType as Question,
} from '@/lib/types/Database.types';

import { Card, DonutChart, type Color } from '@tremor/react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import {
  getCardClassName,
  getTextClassName,
  getTextContent,
} from '@/lib/utils';

import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

type QuizResults = {
  answers: Answer[];
  questions: Question[];
};

const QuizResults = ({ answers, questions }: QuizResults) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  let wrongAnswerScore = 0;
  let correctAnswersScore = 0;
  let emptyAnswersScore = 0;

  let correctAnswersIds: string[] = [];
  let wrongAnswersIds: string[] = [];

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    const correctAnswers = answer.answers.filter((a) => a.isCorrect);
    const wrongAnswers = answer.answers.filter((a) => !a.isCorrect);

    if (answer.answers.length === question?.answers?.length) {
      wrongAnswerScore += 1;
      return wrongAnswersIds.push(answer.questionId);
    }

    if (wrongAnswers.length > 0) {
      wrongAnswerScore += 1;
      return wrongAnswersIds.push(answer.questionId);
    }

    if (correctAnswers.length === question?.correctAnswerCount) {
      correctAnswersScore += 1;
      return correctAnswersIds.push(answer.questionId);
    }
  });

  const percentage = (correctAnswersScore / questions.length) * 100;

  // Check if there are any empty answers
  emptyAnswersScore =
    questions.length - (correctAnswersScore + wrongAnswerScore);

  const emptyAnswers = questions.filter(
    (question) => !answers.some((a) => a.questionId === question.id)
  );

  const data = [
    {
      name: 'Richtige Antworten',
      value: correctAnswersScore,
    },
    {
      name: 'Falsche Antworten',
      value: wrongAnswerScore,
    },
    {
      name: 'Nicht beantwortet',
      value: emptyAnswersScore,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="mx-auto space-y-12">
        <div className="space-y-3">
          <span className="text-center block font-mono text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Glückwunsch!
          </span>

          <div className="flex justify-center">
            <DonutChart
              data={data}
              variant="donut"
              label={`${percentage.toFixed(0)}% richtig`}
              onValueChange={(v) => console.log(v)}
              colors={['emerald', 'rose', 'gray'] as Color[]}
            />
          </div>
        </div>
      </div>

      <Table>
        <TableCaption>
          {correctAnswersScore} / {questions.length} richtig beantwortet
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Frage</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers.map((answer) => (
            <TableRow key={answer.questionId}>
              <TableCell
                dangerouslySetInnerHTML={{ __html: answer.question }}
              />
              <TableCell>
                {correctAnswersIds.includes(answer.questionId) ? (
                  <p className="text-emerald-600 dark:text-emerald-500 font-medium">
                    Richtig
                  </p>
                ) : (
                  <p className="text-rose-600 dark:text-rose-500 font-medium">
                    Falsch
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}

          {emptyAnswers.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.question}</TableCell>
              <TableCell>
                <p className="text-gray-600 dark:text-gray-500 font-medium">
                  Nicht beantwortet
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="my-14 flex flex-col gap-10">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            questionId={question.id}
            question={question}
            correctAnswers={correctAnswersIds}
            answers={answers}
          />
        ))}
      </div>

      <Confetti
        width={width}
        height={height}
        numberOfPieces={showConfetti ? 250 : 0}
      />

      <div className="flex justify-center">
        <Button onClick={() => window.location.reload()}>
          Zur&uuml;ck zur &Uuml;bersicht
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;

type QuestionCardProps = {
  question: Question;
  questionId: string;
  correctAnswers: string[];
  answers: Answer[];
};

function QuestionCard({
  question,
  questionId,
  correctAnswers,
  answers,
}: QuestionCardProps) {
  if (!question || !answers) {
    return null;
  }

  const isAnswerCorrect = (answerId: string) =>
    correctAnswers.includes(answerId);

  const isUserCorrect = isAnswerCorrect(questionId);
  const userAnswer = answers.find((a) => a.questionId === questionId)?.answers;

  return (
    <Card
      decoration="top"
      decorationColor={isUserCorrect ? 'emerald' : 'rose'}
      className={`
      ${isUserCorrect ? 'bg-emerald-50/50' : 'bg-rose-50/50'}
      `}
    >
      <h1
        className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-2"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      <div className="mt-6 flex flex-col gap-4">
        {question.answers?.map((answer) => {
          const { id, answerText, isCorrect } = answer;
          const isCorrectAnswer = answer.isCorrect;
          const isSelectedAnswer = userAnswer?.some(
            (userAnswer) => userAnswer.answerId === id
          );

          return (
            <Card
              key={id}
              decoration="left"
              decorationColor={isCorrectAnswer ? 'emerald' : 'gray'}
              className={getCardClassName(
                isSelectedAnswer,
                isUserCorrect,
                isCorrect
              )}
            >
              <p
                className="text-tremor-content-strong dark:text-dark-tremor-content-strong whitespace-pre-wrap font-medium"
                dangerouslySetInnerHTML={{ __html: answerText }}
              />

              <div className="mt-1 text-right">
                <span
                  className={getTextClassName(
                    isSelectedAnswer,
                    isUserCorrect,
                    isCorrect
                  )}
                >
                  {getTextContent(isSelectedAnswer, isUserCorrect, isCorrect)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

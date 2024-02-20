'use client';

import QuizSubmitForm from '@/components/quiz/QuizSubmitForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@tremor/react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/Pagination';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useState } from 'react';
import { useQuestionPool } from '@/lib/context/QuestionPoolProvider';
import { useParams } from 'next/navigation';

import {
  QuestionType as Question,
  AnswerType as Answer,
} from '@/lib/types/Database.types';

type QuizGameFormProps = {
  questions: Question[];
};

const QuizGameForm = ({ questions }: QuizGameFormProps) => {
  const {
    questionPool,
    categories,
    updateQuestionPool,
    updateCategoryHistory,
  } = useQuestionPool();
  const { category } = useParams();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [submitQuiz, setSubmitQuiz] = useState(false);

  const maxQuestions = questions.length;

  const { question: questionTitle, answers: questionAnswers } =
    questions[questionIndex];

  const handleAnswerClick = (answerId: number, isCorrect: boolean) => {
    const questionId = questions[questionIndex].id;

    // Check if the answerId already exists for the current question
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      // If the answerId is already present for the current question
      const selectedQuestionAnswers = answers[existingAnswerIndex].answers;

      // Check if the answerId is already selected
      const existingAnswer = selectedQuestionAnswers.find(
        (a) => a.answerId === answerId
      );

      if (existingAnswer) {
        // If the answer is already selected, deselect it
        const newAnswers = [...answers];
        const updatedQuestionAnswers = selectedQuestionAnswers.filter(
          (a) => a.answerId !== answerId
        );

        // If there are no more answers for this question, remove it from answers array
        if (updatedQuestionAnswers.length === 0) {
          newAnswers.splice(existingAnswerIndex, 1);
        } else {
          newAnswers[existingAnswerIndex].answers = updatedQuestionAnswers;
        }

        setAnswers(newAnswers);
      } else {
        // If the answer is not selected, add it to the existing answers
        const newAnswers = [...answers];
        newAnswers[existingAnswerIndex].answers.push({
          answerId,
          isCorrect,
        });
        setAnswers(newAnswers);
      }
    } else {
      // If there are no existing answers for the current question, add a new answer
      const answer: Answer = {
        questionId,
        question: questions[questionIndex].question,
        category: questions[questionIndex].category,
        answers: [
          {
            answerId,
            isCorrect,
          },
        ],
      };
      setAnswers((prev) => [...prev, answer]);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate the score
    let score = 0;

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      const correctAnswers = answer.answers.filter((a) => a.isCorrect);

      if (correctAnswers.length === question?.correctAnswerCount) {
        score += 1;
      }
    });

    const currentCategory = category;

    // Update category history with the new scores
    if (categories) {
      const updatedCategories = categories.map((category) => {
        if (category.id === currentCategory) {
          return {
            ...category,
            history: [
              ...category.history,
              {
                id: Date.now(),
                percentage: Math.round((score / maxQuestions) * 100),
              },
            ],
          };
        } else {
          return category;
        }
      });

      updateCategoryHistory(updatedCategories);
    }

    // Update question pool with the new scores
    if (questionPool && answers.length > 0) {
      const questionIdsInAnswers = answers.map((a) => a.questionId);

      const updatedQuestions = questionPool.map((question) => {
        if (questionIdsInAnswers.includes(question.id)) {
          const questionAnswers = answers.filter(
            (a) => a.questionId === question.id
          );

          const timesAnswered = question.meta.timesAnswered + 1;
          const timesCorrect = questionAnswers.filter((a) => {
            const correctAnswers = a.answers.filter((a) => a.isCorrect);
            return correctAnswers.length === question.correctAnswerCount;
          }).length;
          const timesIncorrect = timesAnswered - timesCorrect;

          return {
            ...question,
            meta: {
              timesAnswered,
              timesCorrect,
              timesIncorrect,
            },
          };
        } else {
          return question; // No need to update if not present in answers
        }
      });

      updateQuestionPool(updatedQuestions);
    }
  };

  return (
    <>
      {showSummary ? (
        <QuizSubmitForm
          answers={answers}
          submit={submitQuiz}
          setSubmit={setSubmitQuiz}
          setShowSummary={setShowSummary}
          handleSubmit={handleSubmitQuiz}
          maxQuestions={maxQuestions}
          questions={questions}
        />
      ) : (
        <>
          <Card>
            <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-2">
              {questionTitle}
            </h1>

            <div className="mt-6 flex flex-col gap-4">
              {questionAnswers?.map((answer) => {
                const { id, answerText } = answer;

                const questionId = questions[questionIndex].id;

                const existingAnswerIndex = answers.findIndex((answer) => {
                  const selectedAnswer = answers.filter(
                    (a) => a.questionId === questionId
                  );

                  return selectedAnswer.some((a) =>
                    a.answers.some((a) => a.answerId === id)
                  );
                });

                return (
                  <Card
                    key={id}
                    decoration="left"
                    decorationColor={
                      existingAnswerIndex !== -1 ? 'blue' : 'gray'
                    }
                    className={`${
                      existingAnswerIndex !== -1
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                    }
     
              } cursor-pointer`}
                    onClick={() => {
                      handleAnswerClick(id, answer.isCorrect);
                    }}
                  >
                    <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong whitespace-pre-wrap font-medium">
                      {answerText}
                    </p>
                  </Card>
                );
              })}
            </div>
          </Card>

          <Pagination className="my-10">
            <PaginationContent>
              {questionIndex > 0 && (
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setQuestionIndex((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Vorher
                  </Button>
                </PaginationItem>
              )}

              {questionIndex > 0 && (
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuestionIndex((prev) => prev - 1);
                    }}
                  >
                    {questionIndex}
                  </Button>
                </PaginationItem>
              )}

              {questions.length > 1 && (
                <PaginationItem>
                  <Button variant="outline">{questionIndex + 1}</Button>
                </PaginationItem>
              )}

              {questionIndex < maxQuestions &&
                questionIndex !== maxQuestions - 1 && (
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setQuestionIndex((prev) => prev + 1);
                      }}
                    >
                      {questionIndex + 2}
                    </Button>
                  </PaginationItem>
                )}

              {questionIndex !== maxQuestions - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (questionIndex < maxQuestions - 1) {
                      return setQuestionIndex((prev) => prev + 1);
                    }

                    if (answers.length === 0) {
                      return;
                    }

                    return setShowSummary(true);
                  }}
                >
                  Weiter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </>
  );
};

export default QuizGameForm;

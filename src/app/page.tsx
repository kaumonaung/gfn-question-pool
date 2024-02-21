'use client';

import ChapterCard from '@/components/ChapterCard';
import ExamCreator from '@/components/exam/ExamCreator';
import ExamGameForm from '@/components/exam/ExamGameForm';
import PageContainer from '@/components/PageContainer';
import Navbar from '@/components/Navbar';
import QuizNavbar from '@/components/QuizNavbar';
import { Toaster } from '@/components/ui/Toaster';
import { ToastAction } from '@/components/ui/Toast';

import { useQuestionPool } from '@/lib/context/QuestionPoolProvider';
import { QuestionType as Question } from '@/lib/types/Database.types';

import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

import { shuffleArray } from '@/lib/utils';

export default function Home() {
  const { questionPool, categories } = useQuestionPool();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<Question[]>([]);
  const [questionAmount, setQuestionAmount] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);

  if (!questionPool || !categories) {
    return <PageContainer>Loading...</PageContainer>;
  }

  const maxQuestions = questionPool.length;

  const createQuiz = () => {
    const allQuestions = questionPool;

    if (questionAmount < 1) {
      return toast({
        variant: 'destructive',
        title: 'Etwas ist schiefgelaufen',
        description: 'Du musst mindestens eine Frage auswählen',
        action: <ToastAction altText="Try again">Verstanden</ToastAction>,
      });
    }

    const shuffledQuestions = shuffleArray(allQuestions);
    const shuffledQuestionsWithRandomAnswers = shuffledQuestions
      .slice(0, questionAmount)
      .map((question) => ({
        ...question,
        answers: shuffleArray(question.answers),
      }));

    setQuiz(shuffledQuestionsWithRandomAnswers);
    setQuizStarted(true);
  };

  return (
    <>
      {!quizStarted && <Navbar />}
      {quizStarted && <QuizNavbar />}

      <PageContainer>
        <ExamCreator
          maxQuestions={maxQuestions}
          amount={questionAmount}
          setAmount={setQuestionAmount}
          createQuiz={createQuiz}
          quizStarted={quizStarted}
        />

        {quizStarted ? (
          <ExamGameForm questions={quiz} />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const questionAmount = questionPool.filter(
                (question) => question.category === category.id
              ).length;

              return (
                <ChapterCard
                  key={category.id}
                  props={{
                    id: category.id,
                    index: index + 1,
                    title: category.title,
                    history: category.history,
                    questionAmount: questionAmount,
                  }}
                />
              );
            })}
          </div>
        )}

        <Toaster />
      </PageContainer>
    </>
  );
}

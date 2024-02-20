'use client';

import PageContainer from '@/components/PageContainer';
import QuestionsTable from '@/components/QuestionsTable';
import QuizCreator from '@/components/quiz/QuizCreator';
import QuizGameForm from '@/components/quiz/QuizGameForm';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';
import { ToastAction } from '@/components/ui/Toast';

import { useQuestionPool } from '@/lib/context/QuestionPoolProvider';
import { useState } from 'react';

import { QuestionType as Question } from '@/lib/types/Database.types';
import { useToast } from '@/components/ui/use-toast';

type CategoryPageParams = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: CategoryPageParams) {
  const { questionPool, categories } = useQuestionPool();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<Question[]>([]);
  const [questionAmount, setQuestionAmount] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);

  if (!questionPool || !categories) {
    return <PageContainer>Loading...</PageContainer>;
  }

  const maxQuestions =
    questionPool?.filter((question) => question.category === params.category)
      .length || 0;

  const category = categories.find(
    (category) => category.id === params.category
  );

  if (!category) {
    return <PageContainer>Category not found</PageContainer>;
  }

  const filteredQuestions = questionPool.filter(
    (question) => question.category === params.category
  );

  const createQuiz = () => {
    if (questionAmount < 1) {
      return toast({
        variant: 'destructive',
        title: 'Etwas ist schiefgelaufen',
        description: 'Du musst mindestens eine Frage auswählen',
        action: <ToastAction altText="Try again">Verstanden</ToastAction>,
      });
    }

    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const quiz = shuffled.slice(0, questionAmount);

    setQuiz(quiz);
    setQuizStarted(true);
  };

  return (
    <>
      {!quizStarted && <Navbar />}

      <PageContainer>
        <QuizCreator
          maxQuestions={maxQuestions}
          category={category}
          amount={questionAmount}
          setAmount={setQuestionAmount}
          createQuiz={createQuiz}
          quizStarted={quizStarted}
        />

        <div className="mt-10">
          {quizStarted ? (
            <QuizGameForm questions={quiz} />
          ) : (
            <QuestionsTable questions={filteredQuestions} params={params} />
          )}
        </div>
      </PageContainer>

      <Toaster />
    </>
  );
}

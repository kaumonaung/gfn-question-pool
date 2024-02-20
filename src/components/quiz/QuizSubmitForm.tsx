import {
  AnswerType as Answer,
  QuestionType as Question,
} from '@/lib/types/Database.types';

import { Button } from '@/components/ui/Button';
import SummaryTable from '@/components/quiz/SummaryTable';
import QuizResults from '@/components/quiz/QuizResults';

type AnswerSummaryProps = {
  answers: Answer[];
  submit: boolean;
  setSubmit: (submit: boolean) => void;
  setShowSummary: (showSummary: boolean) => void;
  maxQuestions: number;
  handleSubmit: () => void;
  questions: Question[];
};

const QuizSubmitForm = ({
  answers,
  submit,
  setSubmit,
  setShowSummary,
  maxQuestions,
  handleSubmit,
  questions,
}: AnswerSummaryProps) => {
  return (
    <>
      {submit ? (
        <QuizResults answers={answers} questions={questions} />
      ) : (
        <>
          <SummaryTable answers={answers} maxQuestions={maxQuestions} />

          <div className="flex justify-center space-x-6 mt-10">
            <Button variant="outline" onClick={() => setShowSummary(false)}>
              Z&uuml;ruck zu Fragen
            </Button>

            <Button
              onClick={() => {
                setSubmit(true);
                handleSubmit();
              }}
            >
              Quiz abschicken
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default QuizSubmitForm;

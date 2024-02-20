import {
  AnswerType as Answer,
  QuestionType as Question,
} from '@/lib/types/Database.types';

import { Button } from '@/components/ui/Button';
import ExamSummaryTable from '@/components/exam/ExamSummaryTable';
import ExamResults from '@/components/exam/ExamResults';

type AnswerSummaryProps = {
  answers: Answer[];
  submit: boolean;
  setSubmit: (submit: boolean) => void;
  setShowSummary: (showSummary: boolean) => void;
  maxQuestions: number;
  handleSubmit: () => void;
  questions: Question[];
};

const ExamSubmitForm = ({
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
        <ExamResults answers={answers} questions={questions} />
      ) : (
        <>
          <ExamSummaryTable answers={answers} maxQuestions={maxQuestions} />
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

export default ExamSubmitForm;

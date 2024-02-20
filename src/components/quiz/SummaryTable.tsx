'use client';

import { AnswerType as Answer } from '@/lib/types/Database.types';
import { useQuestionPool } from '@/lib/context/QuestionPoolProvider';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

const SummaryTable = ({
  answers,
  maxQuestions,
}: {
  answers: Answer[];
  maxQuestions: number;
}) => {
  const { categories } = useQuestionPool();

  const category = categories?.find(
    (category) => category.id === answers[0].category
  );

  return (
    <>
      <h3 className="mb-2 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {category?.title}
      </h3>

      <Table>
        <TableCaption>
          {answers.length} / {maxQuestions} beantwortet
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
              <TableCell>{answer.question}</TableCell>
              <TableCell>
                {answer.answers.length > 0 ? <p>Beantwortet</p> : <p>Leer</p>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default SummaryTable;

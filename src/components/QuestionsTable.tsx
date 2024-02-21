import Link from 'next/link';
import { QuestionType as Question } from '@/lib/types/Database.types';

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

const QuestionsTable = ({
  questions,
  params,
}: {
  questions: Question[];
  params: { category: string };
}) => {
  return (
    <Table>
      <TableCaption>Alle Fragen in dieser Kategorie.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Frage</TableHead>
          <TableHead className="w-[125px] text-center"># Richtig</TableHead>
          <TableHead className="w-[125px] text-center"># Falsch</TableHead>
          <TableHead className="w-[125px] text-center"># Befragt</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell
              className="font-medium"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            <TableCell className="text-center text-emerald-800 dark:text-emerald-500">
              {question.meta.timesCorrect}
            </TableCell>
            <TableCell className="text-center text-rose-800 dark:text-rose-500">
              {question.meta.timesIncorrect}
            </TableCell>
            <TableCell className="text-center">
              {question.meta.timesAnswered}
            </TableCell>
            <TableCell className="text-center">
              <Button asChild>
                <Link href={`/${params.category}/${question.id}`}>Ansehen</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsTable;

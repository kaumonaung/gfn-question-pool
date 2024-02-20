import Link from 'next/link';
import { Card, Tracker, type Color } from '@tremor/react';

type ChapterCardProps = {
  props: {
    id: string;
    index: number;
    title: string;
    history: Array<{
      id: number;
      percentage: number;
    }>;
    questionAmount: number | undefined;
  };
};

interface Tracker {
  color: Color;
  percentage: number;
  tooltip: string;
}

const ChapterCard = ({ props }: ChapterCardProps) => {
  const { id, index, title, history, questionAmount } = props;

  const average =
    history.reduce((acc, item) => acc + item.percentage, 0) / history.length;

  const data: Tracker[] = history.map((item) => {
    return {
      color:
        item.percentage >= 85
          ? 'emerald'
          : item.percentage >= 70
          ? 'yellow'
          : 'rose',
      percentage: item.percentage,
      tooltip: `${item.percentage}%`,
    };
  });

  return (
    <Link href={id}>
      <Card
        className="mx-auto max-w-md py-10 h-full flex flex-col justify-between"
        decoration="top"
        decorationColor="blue"
      >
        <div>
          <h4 className="flex justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            <span>Buch {index} </span>

            <span>{questionAmount} Fragen</span>
          </h4>
          <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-2">
            {title}
          </h3>
        </div>

        {history.length !== 0 && (
          <div className="mt-4">
            <p className="text-tremor-default flex items-center justify-between">
              <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                &empty; von {history.length} Tests
              </span>
              <span className="text-tremor-content dark:text-dark-tremor-content">
                {average.toFixed(2)}%
              </span>
            </p>
            <Tracker data={data} className="mt-2" />
          </div>
        )}
      </Card>
    </Link>
  );
};

export default ChapterCard;

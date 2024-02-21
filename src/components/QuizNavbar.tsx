import { Button } from '@/components/ui/Button';

const QuizNavbar = () => {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <nav className="flex justify-center">
        <Button variant="link" onClick={() => window.location.reload()}>
          Quiz Abbrechen
        </Button>
      </nav>
    </header>
  );
};

export default QuizNavbar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[450px] flex items-center justify-center p-4 sm:p-8">
      <Card
        role="region"
        aria-label="404 Page Not Found"
        className="w-full max-w-lg p-6 sm:p-8 flex flex-col items-center text-center gap-4 border-stroke-subtle bg-surface shadow-xl"
      >
        <div className="w-14 h-14 rounded-full bg-surface-raised text-content-accent flex items-center justify-center shrink-0">
          <FileQuestion className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1.5 items-center">
          <Badge variant="primary" className="mb-1">
            404 — Route Not Found
          </Badge>
          <h1 className="text-xl font-bold text-content-primary tracking-tight">
            Page Does Not Exist
          </h1>
          <p className="text-xs text-content-secondary leading-relaxed max-w-md">
            The route you navigated to does not exist or may have been moved.
            Verify the URL or return to the application.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;

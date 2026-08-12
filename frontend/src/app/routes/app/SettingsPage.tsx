import React from 'react';
import { PageHeader } from '../../../components/shell';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/overlay/Toast/useToast';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform Services"
        title="System Settings"
        description="Configuration foundation for application navigation, shell persistence, and theme modes."
      />

      <Card className="p-6 flex flex-col gap-4 max-w-xl">
        <h3 className="text-base font-semibold text-content-primary">
          Navigation Configuration
        </h3>
        <p className="text-xs text-content-secondary leading-relaxed">
          Application shell state derives sidebar collapse persistence from
          namespaced localStorage key.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            toast({
              title: 'Settings Saved',
              description: 'Routing preferences applied cleanly.',
              variant: 'success',
            })
          }
        >
          Test Notification Trigger
        </Button>
      </Card>
    </div>
  );
};

export default SettingsPage;

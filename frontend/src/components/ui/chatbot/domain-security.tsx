import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlobeLock, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface SecuritySettingsProps {
  allowedDomains: string[]; // Changed from string to string[]
  setAllowedDomains: (domains: string[]) => void; // Changed return type
}

const DomainSecurity = ({
  allowedDomains,
  setAllowedDomains,
}: SecuritySettingsProps) => {
  // No need to maintain separate local state
  const MAX_DOMAINS = 5;

  const handleDomainChange = (index: number, value: string) => {
    const newDomains = [...allowedDomains];
    newDomains[index] = value;
    setAllowedDomains(newDomains);
  };

  const addDomain = () => {
    if (allowedDomains.length >= MAX_DOMAINS) {
      toast.error(`Maximum of ${MAX_DOMAINS} domains allowed`);
      return;
    }
    setAllowedDomains([...allowedDomains, '']);
  };

  const removeDomain = (index: number) => {
    const newDomains = [...allowedDomains];
    newDomains.splice(index, 1);
    setAllowedDomains(newDomains);
  };

  return (
    <div className="space-y-2">
      <div className="space-y-3">
        {allowedDomains.map((domain, index) => (
          <div key={index} className="group flex items-center space-x-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                <GlobeLock className="h-4 w-4" />
              </div>
              <Input
                value={domain}
                onChange={(e) => handleDomainChange(index, e.target.value)}
                placeholder="example.com"
                className={`pl-10`}
              />
            </div>

            <div className="flex space-x-1">
              {allowedDomains.length > 1 && (
                <Button
                  type="button" // Add this line to prevent form submission
                  variant="outline"
                  size="icon"
                  onClick={() => removeDomain(index)}
                  aria-label="Remove domain"
                  className="border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
              {index === allowedDomains.length - 1 &&
                allowedDomains.length < MAX_DOMAINS && (
                  <Button
                    type="button" // Add this line to prevent form submission
                    variant="outline"
                    size="icon"
                    onClick={addDomain}
                    aria-label="Add domain"
                    className="border-primary/20 bg-primary/10 hover:bg-primary/20 dark:hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs italic text-muted-foreground">
        {allowedDomains.length}/{MAX_DOMAINS} domains used
      </div>
    </div>
  );
};

export default DomainSecurity;

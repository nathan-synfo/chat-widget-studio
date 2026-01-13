import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SizeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  variableName: string;
}

export function SizeInput({ label, value, onChange, variableName }: SizeInputProps) {
  return (
    <div className="animate-fade-in">
      <Label className="text-xs text-muted-foreground mb-1.5 block">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-mono bg-secondary border-border"
        placeholder={variableName}
      />
    </div>
  );
}

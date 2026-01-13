import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  variableName: string;
}

export function ColorInput({ label, value, onChange, variableName }: ColorInputProps) {
  // Handle color values that might be CSS variables or rgba
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);
  const displayColor = isValidHex ? value : '#000000';

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <input
        type="color"
        value={displayColor}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-md cursor-pointer shrink-0 bg-muted"
      />
      <div className="flex-1 min-w-0">
        <Label className="text-xs text-muted-foreground mb-1 block truncate">
          {label}
        </Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs font-mono bg-secondary border-border"
          placeholder={variableName}
        />
      </div>
    </div>
  );
}

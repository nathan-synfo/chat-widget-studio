import { cssVariables, categoryLabels } from '@/lib/cssVariables';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function VariableReference() {
  const categories = [...new Set(cssVariables.map((v) => v.category))];

  const copyVariable = (varName: string) => {
    navigator.clipboard.writeText(`var(${varName})`);
    toast.success(`Copied: var(${varName})`);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Click any variable to copy its reference for use in custom CSS.
      </p>
      
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">
            {categoryLabels[category]}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {cssVariables
              .filter((v) => v.category === category)
              .map((variable) => (
                <TooltipProvider key={variable.name}>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyVariable(variable.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-muted/50 hover:bg-muted rounded border border-border transition-colors"
                      >
                        <span className="truncate max-w-[120px]">{variable.name}</span>
                        <Copy className="w-2.5 h-2.5 opacity-50" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[280px]">
                      <div className="space-y-1">
                        <p className="font-medium text-xs">{variable.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Use in CSS: <code className="bg-muted px-1 rounded">var({variable.name})</code>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Default: <code className="bg-muted px-1 rounded">{variable.defaultValue}</code>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

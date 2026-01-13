import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LogoUploadProps {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  tooltip: string;
}

export function LogoUpload({ label, value, onChange, tooltip }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlValue, setUrlValue] = useState('');

  // Determine initial mode based on value
  useEffect(() => {
    if (value && !value.startsWith('data:')) {
      setMode('url');
      setUrlValue(value);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlValue(newUrl);
    if (newUrl) {
      onChange(newUrl);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help underline decoration-dotted underline-offset-2">
                {label}
              </label>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[200px]">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1 text-xs text-destructive hover:text-destructive"
            onClick={() => {
              onChange(null);
              setUrlValue('');
            }}
          >
            <X className="w-3 h-3 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as 'upload' | 'url')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
          <TabsTrigger value="url" className="text-xs">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-3 mt-3">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-600 dark:text-yellow-400">
              Uploaded files are for preview only and won't appear in the final code export. Please use a URL for permanent images.
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {value && mode === 'upload' ? (
            <div
              className="relative w-full h-24 rounded border border-border bg-muted/50 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => inputRef.current?.click()}
            >
              <img
                src={value}
                alt={label}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">Change Image</p>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-24 border-dashed text-xs flex flex-col gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Click to upload image</span>
            </Button>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label htmlFor={`url-${label}`} className="text-xs text-muted-foreground">Image URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id={`url-${label}`}
                  value={urlValue}
                  onChange={handleUrlChange}
                  className="h-9 text-xs pl-8"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          {value && mode === 'url' && (
            <div className="w-full h-24 rounded border border-border bg-muted/50 flex items-center justify-center overflow-hidden">
              <img
                src={value}
                alt={label}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

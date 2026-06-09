import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Copy,
  Folder,
  MessageCircle,
  Plus,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
  Upload,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStudio } from './studio-context';
import { designAccent } from '@/lib/design';
import { parseCSS, getDefaultValues } from '@/lib/cssVariables';
import { GetCodeDialog } from './GetCodeDialog';

function DesignSwitcher() {
  const { designs, active, update, switchTo, newDesign, duplicateActive, deleteDesign } = useStudio();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(active.name);

  useEffect(() => setName(active.name), [active.name]);

  const commitRename = () => {
    const trimmed = name.trim();
    update({ name: trimmed || 'Untitled' });
    setEditing(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-7 items-center gap-2 rounded-md border border-border bg-secondary px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="max-w-[180px] truncate">{active.name}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-1.5" align="start">
        {/* CURRENT */}
        <div className="border-b border-border px-2 pb-2 pt-1">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Current
          </div>
          {editing ? (
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setName(active.name);
                  setEditing(false);
                }
              }}
              className="h-7 text-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="cursor-text text-left text-sm font-medium text-foreground"
            >
              {active.name}
            </button>
          )}
        </div>

        {/* SAVED DESIGNS */}
        <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Saved designs
        </div>
        <div className="max-h-[280px] overflow-y-auto">
          {designs.map((d) => (
            <div
              key={d.id}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted',
                d.id === active.id && 'bg-muted/50',
              )}
              onClick={() => {
                switchTo(d.id);
                setOpen(false);
              }}
            >
              <span
                className="h-4 w-4 shrink-0 rounded"
                style={{ background: designAccent(d), boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-foreground">{d.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(d.updatedAt, { addSuffix: true })}
                </div>
              </div>
              <button
                type="button"
                title="Delete design"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDesign(d.id);
                }}
                className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-1 flex gap-1 border-t border-border pt-1.5">
          <button
            type="button"
            onClick={() => {
              newDesign();
              setOpen(false);
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
          <button
            type="button"
            onClick={() => {
              duplicateActive();
              setOpen(false);
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = useStudio();
  return (
    <div className="flex overflow-hidden rounded-md border border-border bg-secondary">
      <button
        type="button"
        title="Undo (Ctrl+Z)"
        onClick={undo}
        disabled={!canUndo}
        className={cn(
          'flex h-7 w-7 items-center justify-center transition-colors',
          canUndo ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'cursor-not-allowed text-muted-foreground/40',
        )}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <div className="w-px bg-border" />
      <button
        type="button"
        title="Redo (Ctrl+Shift+Z)"
        onClick={redo}
        disabled={!canRedo}
        className={cn(
          'flex h-7 w-7 items-center justify-center transition-colors',
          canRedo ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'cursor-not-allowed text-muted-foreground/40',
        )}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ThemeActions() {
  const { update, resetActive } = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const css = ev.target?.result as string;
      const parsed = parseCSS(css);
      update({ cssValues: { ...getDefaultValues(), ...parsed } });
      toast.success(`Loaded ${Object.keys(parsed).length} CSS variables`);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleReset = () => {
    resetActive();
    toast.success('Reset to default values');
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".css" onChange={handleImport} className="hidden" />
      <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => fileRef.current?.click()}>
        <Upload className="mr-1.5 h-3.5 w-3.5" />
        Import CSS
      </Button>
      <Button variant="secondary" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleReset}>
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </>
  );
}

export function TopBar() {
  return (
    <div className="relative z-50 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
      {/* Brand */}
      <div className="mr-1 flex h-full items-center gap-2 border-r border-border pr-3">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e5fd1 100%)' }}
        >
          <MessageCircle className="h-3.5 w-3.5 text-white" fill="white" strokeWidth={0} />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-foreground">n8n Chat Studio</span>
      </div>

      <DesignSwitcher />
      <HistoryControls />

      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="text-[11px] text-muted-foreground">Saved</span>
      </div>

      <div className="flex-1" />

      <ThemeActions />
      <GetCodeDialog />
    </div>
  );
}

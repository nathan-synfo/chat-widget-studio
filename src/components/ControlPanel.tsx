import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColorInput } from './ColorInput';
import { SizeInput } from './SizeInput';
import { LogoUpload } from './LogoUpload';
import { cssVariables, categoryLabels, generateCSS, parseCSS, getDefaultValues } from '@/lib/cssVariables';
import { generateShades } from '@/lib/colorUtils';
import { themes } from '@/lib/themes';
import { generateEmbedCode } from '@/lib/codeGenerator';
import { Settings, Download, RotateCcw, MessageSquare, Palette, Code, Upload, FileText, Info, Ruler, MousePointerClick, Move, Copy, Check, Type, Sparkles, PanelBottom, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { LogoValues, HeaderContent, WelcomeConfig, ChatConfig } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";



interface ControlPanelProps {
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onReset: () => void;
  onImport: (values: Record<string, string>) => void;
  logos: LogoValues;
  onLogoChange: (key: keyof LogoValues, value: string | null) => void;
  headerContent: HeaderContent;
  onHeaderChange: (key: keyof HeaderContent, value: string) => void;
  welcomeConfig: WelcomeConfig;
  onWelcomeChange: (config: WelcomeConfig) => void;
  chatConfig: ChatConfig;
  onChatConfigChange: (config: ChatConfig) => void;
}

export function ControlPanel({
  values,
  onChange,
  onReset,
  onImport,
  logos,
  onLogoChange,
  headerContent,
  onHeaderChange,
  welcomeConfig,
  onWelcomeChange,
  chatConfig,
  onChatConfigChange
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const orderedSections = [
    'config',
    'colors',
    'typography',
    'layout',
    'welcome',
    'quick-actions',
    'header',
    'messages',
    'footer',
    'toggle',
    'animation'
  ];

  /* Remove dynamic categories derivation in favor of orderedSections */

  const FONT_PRESETS: Record<string, string> = {
    'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap',
    'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'colors': return <Palette className="h-4 w-4" />;
      case 'dimensions': return <Ruler className="h-4 w-4" />;
      case 'header': return <FileText className="h-4 w-4" />;
      case 'messages': return <MessageSquare className="h-4 w-4" />;
      case 'toggle': return <MousePointerClick className="h-4 w-4" />;
      case 'spacing': return <Move className="h-4 w-4" />;
      case 'typography': return <Type className="h-4 w-4" />;
      case 'layout': return <Ruler className="h-4 w-4" />;
      case 'animation': return <Sparkles className="h-4 w-4" />;
      case 'footer': return <PanelBottom className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };


  const getEmbedCode = () => {
    return generateEmbedCode({
      cssValues: values,
      headerContent,
      welcomeConfig,
      logos,
      chatConfig
    });
  };

  const handleCopyCode = () => {
    const code = getEmbedCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const css = event.target?.result as string;
      const parsed = parseCSS(css);
      const defaults = getDefaultValues();
      onImport({ ...defaults, ...parsed });
      toast.success(`Loaded ${Object.keys(parsed).length} CSS variables`);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleExportCSS = () => {
    const css = generateCSS(values);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'n8n-chat-theme.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSS exported successfully');
  };

  const handleReset = () => {
    onReset();
    toast.success('Reset to default values');
  };

  const handleThemeChange = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    // Start with defaults to ensure we cover all bases, then apply theme
    const newValues = { ...getDefaultValues(), ...theme.values };

    // Auto-generate shades for the new theme colors if they exist
    const primary = newValues['--chat--color--primary'];
    if (primary) {
      const shades = generateShades(primary);
      newValues['--chat--color--primary-shade-50'] = shades.shade50;
      newValues['--chat--color--primary--shade-100'] = shades.shade100;
      // Also update toggle hover states if not explicitly set in theme
      if (!theme.values['--chat--toggle--hover--background']) {
        newValues['--chat--toggle--hover--background'] = shades.shade50;
      }
      if (!theme.values['--chat--toggle--active--background']) {
        newValues['--chat--toggle--active--background'] = shades.shade100;
      }
    }

    const secondary = newValues['--chat--color--secondary'];
    if (secondary) {
      const shades = generateShades(secondary);
      newValues['--chat--color-secondary-shade-50'] = shades.shade50;
    }

    // Assume light/dark shades might need adjustment based on light color, but simple for now.

    onImport(newValues);
    toast.success(`Theme "${theme.name}" applied`);
  };

  const handleValueChange = (name: string, newValue: string) => {
    onChange(name, newValue);

    // Dynamic updates
    if (name === '--chat--color--primary') {
      const shades = generateShades(newValue);
      onChange('--chat--color--primary-shade-50', shades.shade50);
      onChange('--chat--color--primary--shade-100', shades.shade100);
      onChange('--chat--toggle--hover--background', shades.shade50);
      onChange('--chat--toggle--active--background', shades.shade100);
    }

    if (name === '--chat--color--secondary') {
      const shades = generateShades(newValue);
      onChange('--chat--color-secondary-shade-50', shades.shade50);
    }

    // If Toggle Background is not manually unlinked, we could sync it? 
    // Usually toggle background = primary. Let's keep them separate but initial theme links them.
  };

  const handlePillChange = (id: string, key: 'label' | 'message', value: string) => {
    const newPills = welcomeConfig.pills.map(pill =>
      pill.id === id ? { ...pill, [key]: value } : pill
    );
    onWelcomeChange({ ...welcomeConfig, pills: newPills });
  };

  const handleAddPill = () => {
    if (welcomeConfig.pills.length >= 4) {
      toast.error('Maximum 4 pills allowed');
      return;
    }
    const newPills = [...welcomeConfig.pills, { id: crypto.randomUUID(), label: 'New Action', message: 'Hello' }];
    onWelcomeChange({ ...welcomeConfig, pills: newPills });
  };

  const handleRemovePill = (id: string) => {
    const newPills = welcomeConfig.pills.filter(pill => pill.id !== id);
    onWelcomeChange({ ...welcomeConfig, pills: newPills });
  };


  return (
    <div className="h-full flex flex-col bg-card">
      <div className="px-4 pt-3.5 pb-3 border-b border-border bg-panel-header relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">n8n Chat Studio</span>
        </div>
        <p className="text-xs text-muted-foreground pl-8">Customize and export your chat widget</p>
      </div>

      <div className="p-3 border-b border-border space-y-3 bg-muted/20">
        {/* Theme Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Theme Preset</Label>
          <Select onValueChange={handleThemeChange}>
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue placeholder="Select a theme..." />
            </SelectTrigger>
            <SelectContent>
              {themes.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".css"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Import CSS
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleExportCSS}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSS
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Configuration?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all colors, typography, and settings to their default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex-1 text-xs font-medium shadow-sm shadow-primary/20"
              >
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Get Embed Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] max-h-[85vh] overflow-y-auto p-6 pr-12 md:p-8 md:pr-16">
              <DialogHeader className="pb-4">
                <DialogTitle>Install Chat Widget</DialogTitle>
                <DialogDescription>
                  Follow these steps to add the chat widget to your website.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                    <h4 className="font-medium text-sm">Configure Webhook</h4>
                  </div>
                  <div className="pl-8 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ensure you have entered your correct <strong>n8n Webhook URL</strong> in the Configuration section.
                    </p>
                    <div className="relative group w-full overflow-hidden rounded-md border border-zinc-200">
                      <pre className="p-3 bg-zinc-100 text-zinc-900 text-xs font-mono overflow-x-auto">
                        {chatConfig.webhookUrl || 'Not set'}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                    <h4 className="font-medium text-sm">Copy Code</h4>
                  </div>
                  <div className="pl-8 w-full max-w-full grid grid-cols-1">
                    <div className="relative group w-full max-w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                      <pre className="p-4 text-zinc-50 text-xs overflow-x-auto font-mono max-h-[300px] w-full">
                        {getEmbedCode()}
                      </pre>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 h-8 w-8 transition-opacity z-10"
                        onClick={handleCopyCode}
                      >
                        {copiedCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                    <h4 className="font-medium text-sm">Paste into Website</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Paste the copied code immediately before the closing <code className="bg-muted px-1 py-0.5 rounded text-xs text-red-500">&lt;/body&gt;</code> tag in your website's HTML source.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full" defaultValue="config">







          {orderedSections.map((sectionId) => {
            // 1. CONFIGURATION (Special Case)
            if (sectionId === 'config') {
              return (
                <AccordionItem key="config" value="config" className="border-border">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary text-muted-foreground shrink-0">
                        <Settings className="h-3.5 w-3.5" />
                      </div>
                      <span>Configuration</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pb-2">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url" className="text-xs text-muted-foreground">n8n Webhook URL</Label>
                        <Input
                          id="webhook-url"
                          value={chatConfig.webhookUrl}
                          onChange={(e) => onChatConfigChange({ ...chatConfig, webhookUrl: e.target.value })}
                          placeholder="https://your-n8n-instance.com/webhook/..."
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Paste your n8n Chat Webhook URL here.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }

            // 2. WELCOME SCREEN (Special Case)
            if (sectionId === 'welcome') {
              return (
                <AccordionItem key="welcome" value="welcome" className="border-border">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary text-muted-foreground shrink-0">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </div>
                      <span>Welcome Screen</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pb-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="welcome-enabled" className="text-xs text-muted-foreground">Enable Welcome Screen</Label>
                        <Switch
                          id="welcome-enabled"
                          checked={welcomeConfig.enabled}
                          onCheckedChange={(c) => onWelcomeChange({ ...welcomeConfig, enabled: c })}
                        />
                      </div>

                      {welcomeConfig.enabled && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="welcome-title" className="text-xs text-muted-foreground">Title</Label>
                            <Input
                              id="welcome-title"
                              value={welcomeConfig.title}
                              onChange={(e) => onWelcomeChange({ ...welcomeConfig, title: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="welcome-subtitle" className="text-xs text-muted-foreground">Subtitle</Label>
                            <Input
                              id="welcome-subtitle"
                              value={welcomeConfig.subtitle}
                              onChange={(e) => onWelcomeChange({ ...welcomeConfig, subtitle: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <ColorInput
                              label="Title Color"
                              value={values['--chat--welcome--title-color'] || '#101330'}
                              onChange={(v) => handleValueChange('--chat--welcome--title-color', v)}
                              variableName="--chat--welcome--title-color"
                            />
                          </div>
                          <div className="space-y-2">
                            <ColorInput
                              label="Subtitle Color"
                              value={values['--chat--welcome--subtitle-color'] || '#101330'}
                              onChange={(v) => handleValueChange('--chat--welcome--subtitle-color', v)}
                              variableName="--chat--welcome--subtitle-color"
                            />
                          </div>

                          {/* Welcome Font Sliders */}
                          <div className="space-y-4 pt-2 border-t border-border/50">
                            {cssVariables
                              .filter((v) => v.category === 'welcome' && v.type === 'size')
                              .map((variable) => {
                                const currentValue = values[variable.name] || variable.defaultValue;
                                const numericValue = parseInt(currentValue, 10) || 0;

                                return (
                                  <div key={variable.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                      <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                        {currentValue}
                                      </span>
                                    </div>
                                    <Slider
                                      value={[numericValue]}
                                      max={32}
                                      min={10}
                                      step={1}
                                      onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                      className="py-1"
                                    />
                                  </div>
                                );
                              })}
                          </div>

                          {/* Welcome Colors (Generic loop for any welcome colors) */}
                          <div className="space-y-2 pt-2 border-t border-border/50">
                            {cssVariables
                              .filter((v) => v.category === 'welcome' && v.type === 'color' && !v.excludeFromUI)
                              .map((variable) => (
                                <div key={variable.name} className="relative group">
                                  <ColorInput
                                    label={variable.label}
                                    value={values[variable.name] || variable.defaultValue}
                                    onChange={(value) => handleValueChange(variable.name, value)}
                                    variableName={variable.name}
                                  />
                                </div>
                              ))}
                          </div>

                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }

            // 3. QUICK ACTIONS (Special Case)
            if (sectionId === 'quick-actions') {
              return (
                <AccordionItem key="quick-actions" value="quick-actions" className="border-border">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary text-muted-foreground shrink-0">
                        <Zap className="h-3.5 w-3.5" />
                      </div>
                      <span>Quick Actions</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3 pb-2">
                      {!welcomeConfig.enabled && (
                        <p className="text-xs text-muted-foreground/70 bg-muted/40 rounded px-2.5 py-2 mb-1">
                          Enable the Welcome Screen to show these buttons to visitors.
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Pills (max 4)</Label>
                        <Button variant="ghost" size="sm" onClick={handleAddPill} className="h-6 w-6 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {welcomeConfig.pills.map((pill) => (
                          <div key={pill.id} className="bg-secondary/60 border border-border p-2.5 rounded-md space-y-2 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePill(pill.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Label</Label>
                              <Input
                                value={pill.label}
                                onChange={(e) => handlePillChange(pill.id, 'label', e.target.value)}
                                className="h-7 text-xs"
                                placeholder="Button Text"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Message Payload</Label>
                              <Input
                                value={pill.message}
                                onChange={(e) => handlePillChange(pill.id, 'message', e.target.value)}
                                className="h-7 text-xs"
                                placeholder="Message sent to bot"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 pt-3 border-t border-border/50">
                        {cssVariables
                          .filter((v) => v.category === 'quick-actions' && v.type === 'color')
                          .map((variable) => (
                            <div key={variable.name}>
                              <ColorInput
                                label={variable.label}
                                value={values[variable.name] || variable.defaultValue}
                                onChange={(value) => handleValueChange(variable.name, value)}
                                variableName={variable.name}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }

            // 4. STANDARD CATEGORIES
            // Treat 'sectionId' as 'category'
            const category = sectionId;

            return (
              <AccordionItem key={category} value={category} className="border-border">
                <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary text-muted-foreground shrink-0">
                      {getCategoryIcon(category)}
                    </div>
                    <span>{categoryLabels[category]}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 pb-2">
                    {/* Special Handling for Toggle Button: Logo Upload */}
                    {category === 'toggle' && (
                      <div className="pb-4 mb-4 border-b border-border/50">
                        <LogoUpload
                          label="Toggle Button Icon"
                          value={logos.toggleIcon}
                          onChange={(v) => onLogoChange('toggleIcon', v)}
                          tooltip="Replaces the default chat bubble icon."
                        />
                      </div>
                    )}
                    {/* Special Handling for Messages: Bot Avatar & Sliders */}
                    {category === 'messages' && (
                      <div className="space-y-4 mb-4">
                        <div className="pb-4 border-b border-border/50">
                          <LogoUpload
                            label="Bot Avatar"
                            value={logos.botAvatar}
                            onChange={(v) => onLogoChange('botAvatar', v)}
                            tooltip="Shown next to bot messages."
                          />
                        </div>

                        {/* Messages Sliders (Font Size, Padding, Radius, Line Height) */}
                        {cssVariables
                          .filter((v) => v.category === 'messages' && (v.name.includes('font-size') || v.name.includes('padding') || v.name.includes('border-radius') || v.name.includes('line-height')))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const isPx = variable.name.includes('font-size'); // font-size is px
                            const isLineHeight = variable.name.includes('line-height'); // unitless float

                            let displayValue = currentValue;
                            let numericValue = 0;

                            // Default limits
                            let max = 3.0;
                            let min = 0.1;
                            let step = 0.1;

                            if (isLineHeight) {
                              // Float, no unit
                              const floatVal = parseFloat(currentValue) || (variable.min || 1.0);
                              numericValue = floatVal;
                              displayValue = floatVal.toFixed(2);
                              max = variable.max || 3.0;
                              min = variable.min || 1.0;
                              step = 0.1;
                            } else if (isPx) {
                              numericValue = parseInt(currentValue, 10) || (variable.min || 10);
                              displayValue = currentValue;
                              max = variable.max || 32;
                              min = variable.min || 10;
                              step = 1;
                            } else {
                              // rem logic for padding/radius
                              const floatVal = parseFloat(currentValue) || (variable.min || 0);
                              numericValue = floatVal;
                              displayValue = `${floatVal.toFixed(2)}rem`;
                              max = variable.max || 3.0;
                              min = variable.min || 0;
                              step = 0.1;
                            }

                            return (
                              <div key={variable.name} className="space-y-2 pb-4 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {displayValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={max}
                                  min={min}
                                  step={step}
                                  onValueChange={(vals) => {
                                    let finalVal = `${vals[0]}`;
                                    if (isLineHeight) {
                                      finalVal = `${vals[0]}`;
                                    } else if (isPx) {
                                      finalVal = `${vals[0]}px`;
                                    } else {
                                      finalVal = `${vals[0]}rem`;
                                    }
                                    handleValueChange(variable.name, finalVal);
                                  }}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                    {/* Special Handling for Header: Sliders and Content Inputs */}
                    {category === 'header' && (
                      <div className="space-y-4 mb-4">
                        {/* Header Content Inputs (Moved from separate accordion) */}
                        <div className="space-y-4 pb-4 border-b border-border/50">
                          <div className="space-y-2">
                            <Label htmlFor="header-title-input" className="text-xs text-muted-foreground">Header Title</Label>
                            <Input
                              id="header-title-input"
                              value={headerContent.title}
                              onChange={(e) => onHeaderChange('title', e.target.value)}
                              placeholder="Hi there! 👋"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="header-subtitle-input" className="text-xs text-muted-foreground">Header Subtitle</Label>
                            <Textarea
                              id="header-subtitle-input"
                              value={headerContent.subtitle}
                              onChange={(e) => onHeaderChange('subtitle', e.target.value)}
                              placeholder="Start a chat..."
                              className="text-sm resize-none"
                              rows={2}
                            />
                          </div>
                        </div>

                        {/* Header Logo Height Slider */}
                        {cssVariables
                          .filter((v) => v.category === 'header' && v.name.includes('logo-height'))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const numericValue = parseInt(currentValue, 10) || 0;

                            return (
                              <div key={variable.name} className="space-y-2 pb-4 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {currentValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={128}
                                  min={16}
                                  step={1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                  className="py-1"
                                />
                              </div>
                            );
                          })}

                        {/* Header Dimensions Sliders (Height, Padding, Line Height) using custom logic */}
                        {cssVariables
                          .filter((v) => v.category === 'header' && (v.name.includes('height') || v.name.includes('padding') || v.name.includes('line-height')) && !v.name.includes('logo'))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const isPx = variable.name.includes('height') && !variable.name.includes('line'); // purely existing height check
                            // New check for line-height
                            const isLineHeight = variable.name.includes('line-height');

                            let displayValue = currentValue;
                            let numericValue = 0;

                            // Default limits
                            let max = 200;
                            let min = 0;
                            let step = 1;

                            if (isLineHeight) {
                              // Float, no unit
                              const floatVal = parseFloat(currentValue) || (variable.min || 1.2);
                              numericValue = floatVal;
                              displayValue = floatVal.toFixed(2);
                              max = variable.max || 3.0;
                              min = variable.min || 0.1;
                              step = 0.1;
                            } else if (isPx) {
                              numericValue = parseInt(currentValue, 10) || (variable.min || 0);
                              displayValue = currentValue;
                              max = variable.max || 200;
                              min = variable.min || 48;
                              step = 1;
                            } else {
                              // rem logic for padding
                              const floatVal = parseFloat(currentValue) || (variable.min || 0);
                              numericValue = floatVal;
                              displayValue = `${floatVal.toFixed(2)}rem`;
                              max = variable.max || 3.0;
                              min = variable.min || 0.1;
                              step = 0.1;
                            }

                            return (
                              <div key={variable.name} className="space-y-2 pb-4 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {displayValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={max}
                                  min={min}
                                  step={step}
                                  onValueChange={(vals) => {
                                    let finalVal = `${vals[0]}`;
                                    if (isLineHeight) {
                                      // No unit for line-height
                                      finalVal = `${vals[0]}`;
                                    } else {
                                      finalVal = `${vals[0]}${isPx ? 'px' : 'rem'}`;
                                    }
                                    handleValueChange(variable.name, finalVal);
                                  }}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}

                        {/* Header Logo Upload */}
                        <div className="pb-4 border-b border-border/50">
                          <LogoUpload
                            label="Header Logo"
                            value={logos.headerLogo}
                            onChange={(v) => onLogoChange('headerLogo', v)}
                            tooltip="Displayed in the chat header."
                          />
                        </div>

                        {/* Font Size Sliders */}
                        {cssVariables
                          .filter((v) => v.category === 'header' && v.name.includes('font-size'))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const numericValue = parseInt(currentValue, 10) || 0;

                            return (
                              <div key={variable.name} className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {currentValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={48}
                                  min={12}
                                  step={1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Special Handling for Typography */}
                    {category === 'typography' && (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Font Family</Label>
                          <Select
                            value={['inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'].includes(values['--chat--font-family']) ? values['--chat--font-family'] : 'Custom'}
                            onValueChange={(val) => {
                              if (val === 'Custom') {
                                handleValueChange('--chat--font-family', '');
                              } else {
                                handleValueChange('--chat--font-family', val);
                                if (val === 'inherit') {
                                  handleValueChange('--chat--font-family-url', '');
                                } else {
                                  handleValueChange('--chat--font-family-url', FONT_PRESETS[val] || '');
                                }
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs w-full bg-secondary border-border">
                              <SelectValue placeholder="Select Font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inherit">System Default</SelectItem>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Custom">Custom...</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Show custom inputs if Custom is selected OR if the current value is not one of the presets */}
                        {(!['inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'].includes(values['--chat--font-family'])) && (
                          <div className="space-y-3 animate-fade-in pl-2 border-l-2 border-primary/20">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">Custom Font Name</Label>
                              <Input
                                value={values['--chat--font-family']}
                                onChange={(e) => handleValueChange('--chat--font-family', e.target.value)}
                                className="h-8 text-xs font-mono bg-secondary border-border"
                                placeholder="e.g. 'Dancing Script', monospace"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">Font URL (Optional)</Label>
                              <Input
                                value={values['--chat--font-family-url'] || ''}
                                onChange={(e) => handleValueChange('--chat--font-family-url', e.target.value)}
                                className="h-8 text-xs font-mono bg-secondary border-border"
                                placeholder="https://fonts.googleapis.com/css2?family=..."
                              />
                              <p className="text-[10px] text-muted-foreground">
                                Paste the full URL from Google Fonts or other providers.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Special Handling for Layout: Mix of Inputs and Sliders */}
                    {category === 'layout' && (
                      <div className="space-y-4">
                        {/* 1. Standard Inputs (Dimensions, Spacing) - Exclude Position & Window Size & Spacing/Radius vars */}
                        {cssVariables
                          .filter((v) => v.category === 'layout' && !v.excludeFromUI && !v.name.includes('position') && !v.name.includes('window--bottom') && !v.name.includes('window--right') && !v.name.includes('window--width') && !v.name.includes('window--height') && !v.name.includes('spacing') && !v.name.includes('border-radius'))
                          .map((variable) => (
                            <div key={variable.name} className="relative group">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-muted-foreground">{variable.label}</span>
                                  {variable.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-3 h-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-[200px] text-xs">
                                          {variable.description}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>
                              <SizeInput
                                label=""
                                value={values[variable.name] || variable.defaultValue}
                                onChange={(value) => handleValueChange(variable.name, value)}
                                variableName={variable.name}
                              />
                            </div>
                          ))}

                        {/* 2. Window Dimensions Sliders (px) */}
                        {cssVariables
                          .filter((v) => v.category === 'layout' && (v.name.includes('window--width') || v.name.includes('window--height')))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const numericValue = parseInt(currentValue, 10) || (variable.min || 0);

                            return (
                              <div key={variable.name} className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {currentValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={variable.max || 800}
                                  min={variable.min || 100}
                                  step={10}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}

                        {/* 3. Radius Sliders (rem) - Spacing moved to Footer */}
                        {cssVariables
                          .filter((v) => v.category === 'layout' && v.name.includes('border-radius'))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            // Parse '1.5rem' -> 1.5. If fails, fallback to min or 0.
                            const floatValue = parseFloat(currentValue) || (variable.min || 0);

                            return (
                              <div key={variable.name} className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {floatValue.toFixed(2)}rem
                                  </span>
                                </div>
                                <Slider
                                  value={[floatValue]}
                                  max={variable.max || 3.0}
                                  min={variable.min || 0.1}
                                  step={0.1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}rem`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}

                        {/* 2. Position Sliders */}
                        {cssVariables
                          .filter((v) => v.category === 'layout' && (v.name.includes('position') || v.name.includes('window--bottom') || v.name.includes('window--right'))) // Identify by name now
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const numericValue = parseInt(currentValue, 10) || 0;

                            return (
                              <div key={variable.name} className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {currentValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={200}
                                  step={1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Special Handling for Animation */}
                    {category === 'animation' && (
                      <div className="space-y-4">
                        {/* 1. Animation Style Dropdown */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Entry/Exit Animation</Label>
                          <Select
                            value={values['--chat--animation-style'] || 'scale'}
                            onValueChange={(val) => handleValueChange('--chat--animation-style', val)}
                          >
                            <SelectTrigger className="h-8 text-xs w-full bg-secondary border-border">
                              <SelectValue placeholder="Select Animation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scale">Pop (Scale)</SelectItem>
                              <SelectItem value="fade">Fade In/Out</SelectItem>
                              <SelectItem value="slide-up">Slide Up</SelectItem>
                              <SelectItem value="slide-side">Slide Side</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground">
                            Choose how the chat window appears when opened.
                          </p>
                        </div>

                        {/* 2. Animation Speed Slider */}
                        {cssVariables
                          .filter((v) => v.category === 'animation' && v.name === '--chat--transition-duration')
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            // Parse logic: '0.3s' -> 300, '300ms' -> 300
                            let numericValue = 150;
                            if (currentValue.endsWith('ms')) {
                              numericValue = parseInt(currentValue, 10);
                            } else if (currentValue.endsWith('s')) {
                              numericValue = parseFloat(currentValue) * 1000;
                            }

                            return (
                              <div key={variable.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {numericValue}ms
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={2000}
                                  step={50}
                                  onValueChange={(vals) => {
                                    const ms = vals[0];
                                    const sec = ms / 1000;
                                    handleValueChange(variable.name, `${sec}s`);
                                  }}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Special Handling for Footer: Sliders for Sizes, Color for Border */}
                    {category === 'footer' && (
                      <div className="space-y-4">
                        {/* Sliders for Radius, Font, Icon */}
                        {cssVariables
                          .filter((v) => v.category === 'footer' && v.type === 'size' && !v.name.includes('spacing') && !v.name.includes('input--font-size'))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            const numericValue = parseInt(currentValue, 10) || 0;
                            const max = variable.name.includes('radius') ? 24 : variable.name.includes('font') ? 24 : 32;
                            const min = variable.name.includes('radius') ? 0 : 10;

                            return (
                              <div key={variable.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {currentValue}
                                  </span>
                                </div>
                                <Slider
                                  value={[numericValue]}
                                  max={max}
                                  min={min}
                                  step={1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}px`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}

                        {/* Spacing & Input Font Size (rem) */}
                        {cssVariables
                          .filter((v) => v.category === 'footer' && (v.name.includes('spacing') || v.name.includes('input--font-size')))
                          .map((variable) => {
                            const currentValue = values[variable.name] || variable.defaultValue;
                            // Parse '1.0rem' -> 1.0. 
                            const floatValue = parseFloat(currentValue) || (variable.min || 0);

                            return (
                              <div key={variable.name} className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs text-muted-foreground">{variable.label}</Label>
                                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                    {floatValue.toFixed(2)}rem
                                  </span>
                                </div>
                                <Slider
                                  value={[floatValue]}
                                  max={variable.max || 3.0}
                                  min={variable.min || 0.1}
                                  step={0.1}
                                  onValueChange={(vals) => handleValueChange(variable.name, `${vals[0]}rem`)}
                                  className="py-1"
                                />
                                {variable.description && (
                                  <p className="text-[10px] text-muted-foreground/70">{variable.description}</p>
                                )}
                              </div>
                            );
                          })}

                        {/* Color Pickers */}
                        {cssVariables
                          .filter((v) => v.category === 'footer' && v.type === 'color')
                          .map((variable) => (
                            <div key={variable.name} className="relative group pt-2 border-t border-border/50">
                              <ColorInput
                                label={variable.label}
                                value={values[variable.name] || variable.defaultValue}
                                onChange={(value) => handleValueChange(variable.name, value)}
                                variableName={variable.name}
                              />
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Standard rendering for non-excluded, non-special items */}
                    {cssVariables
                      .filter((v) =>
                        v.category === category &&
                        !v.excludeFromUI &&
                        category !== 'layout' &&
                        category !== 'animation' &&
                        category !== 'footer' &&
                        (category !== 'typography' || (v.name !== '--chat--font-family' && !v.name.includes('font-size') && !v.name.includes('line-height'))) &&
                        (category !== 'header' || (!v.name.includes('font-size') && !v.name.includes('line-height') && !v.name.includes('logo-height') && !v.name.includes('header-height') && !v.name.includes('header--padding'))) &&
                        (category !== 'messages' || (!v.name.includes('font-size') && !v.name.includes('padding') && !v.name.includes('border-radius') && !v.name.includes('line-height')))
                      )
                      .map((variable) => (
                        <div key={variable.name} className="relative group">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-muted-foreground">{variable.label}</span>
                              {variable.description && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-3 h-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[200px] text-xs">
                                      {variable.description}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                          {variable.type === 'color' ? (
                            <ColorInput
                              label="" // Label handled above
                              value={values[variable.name] || variable.defaultValue}
                              onChange={(value) => handleValueChange(variable.name, value)}
                              variableName={variable.name}
                            />
                          ) : (
                            <SizeInput
                              label="" // Label handled above
                              value={values[variable.name] || variable.defaultValue}
                              onChange={(value) => handleValueChange(variable.name, value)}
                              variableName={variable.name}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}


        </Accordion>
      </ScrollArea>
    </div>
  );
}

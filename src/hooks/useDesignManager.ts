import { useCallback, useEffect, useRef, useState } from 'react';
import { getDefaultValues } from '@/lib/cssVariables';
import {
  createDefaultDesign,
  createDefaultWelcomeConfig,
  DEFAULT_CHAT_CONFIG,
  DEFAULT_HEADER_CONTENT,
  DEFAULT_LOGOS,
  type WidgetDesign,
} from '@/lib/design';

const DESIGNS_KEY = 'n8n-chat-designs';
const ACTIVE_KEY = 'n8n-chat-active-id';
const LEGACY_KEY = 'n8n-chat-widget-config';
const HISTORY_CAP = 80;
// Rapid successive edits (slider drags, typing) within this window collapse into a
// single undoable step, so one undo reverts a whole gesture rather than one tick.
const COALESCE_MS = 400;

interface InitialState {
  designs: WidgetDesign[];
  activeId: string;
}

function loadInitialState(): InitialState {
  // 1. Preferred: the multi-design store.
  try {
    const rawDesigns = localStorage.getItem(DESIGNS_KEY);
    if (rawDesigns) {
      const designs = JSON.parse(rawDesigns) as WidgetDesign[];
      if (Array.isArray(designs) && designs.length > 0) {
        const activeId = localStorage.getItem(ACTIVE_KEY) || designs[0].id;
        const exists = designs.some((d) => d.id === activeId);
        return { designs, activeId: exists ? activeId : designs[0].id };
      }
    }
  } catch {
    // fall through
  }

  // 2. Migration: the legacy single-config blob.
  try {
    const rawLegacy = localStorage.getItem(LEGACY_KEY);
    if (rawLegacy) {
      const legacy = JSON.parse(rawLegacy);
      const migrated = createDefaultDesign('My widget');
      migrated.cssValues = { ...getDefaultValues(), ...(legacy.cssValues || {}) };
      migrated.logos = { ...DEFAULT_LOGOS, ...(legacy.logos || {}) };
      migrated.headerContent = { ...DEFAULT_HEADER_CONTENT, ...(legacy.headerContent || {}) };
      migrated.welcomeConfig = { ...createDefaultWelcomeConfig(), ...(legacy.welcomeConfig || {}) };
      migrated.chatConfig = { ...DEFAULT_CHAT_CONFIG, ...(legacy.chatConfig || {}) };
      // Note: we intentionally keep the legacy key so users can roll back.
      return { designs: [migrated], activeId: migrated.id };
    }
  } catch {
    // fall through
  }

  // 3. Fresh start.
  const fresh = createDefaultDesign('My widget');
  return { designs: [fresh], activeId: fresh.id };
}

export interface DesignManager {
  designs: WidgetDesign[];
  active: WidgetDesign;
  refreshKey: number;
  canUndo: boolean;
  canRedo: boolean;
  update: (patch: Partial<WidgetDesign>) => void;
  undo: () => void;
  redo: () => void;
  switchTo: (id: string) => void;
  newDesign: (name?: string) => void;
  duplicateActive: () => void;
  deleteDesign: (id: string) => void;
  resetActive: () => void;
}

export function useDesignManager(): DesignManager {
  const [{ designs: initialDesigns, activeId: initialActiveId }] = useState(loadInitialState);
  const [designs, setDesigns] = useState<WidgetDesign[]>(initialDesigns);
  const [activeId, setActiveId] = useState<string>(initialActiveId);
  const [refreshKey, setRefreshKey] = useState(0);

  // History stacks — snapshots of the *active* design only.
  const [past, setPast] = useState<WidgetDesign[]>([]);
  const [future, setFuture] = useState<WidgetDesign[]>([]);
  // Timestamp of the last edit, for coalescing rapid edits into one history entry.
  const lastEditAt = useRef(0);

  const active = designs.find((d) => d.id === activeId) ?? designs[0];

  // Persist on any change.
  useEffect(() => {
    try {
      localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
      localStorage.setItem(ACTIVE_KEY, activeId);
    } catch {
      // QuotaExceeded etc. — surfaced by callers when relevant; nothing to do here.
    }
  }, [designs, activeId]);

  const replaceActive = useCallback(
    (next: WidgetDesign) => {
      setDesigns((ds) => ds.map((d) => (d.id === next.id ? next : d)));
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<WidgetDesign>) => {
      const prev = active;
      if (!prev) return;
      const now = Date.now();
      // Start a new undoable group only when enough time has passed since the last
      // edit; within a gesture (drag/typing burst) we update in place so a single
      // undo reverts the whole gesture.
      const startNewGroup = now - lastEditAt.current > COALESCE_MS;
      lastEditAt.current = now;
      const next: WidgetDesign = { ...prev, ...patch, updatedAt: now };
      if (startNewGroup) {
        setPast((p) => [...p, prev].slice(-HISTORY_CAP));
        setFuture([]);
      }
      replaceActive(next);
    },
    [active, replaceActive],
  );

  const undo = useCallback(() => {
    if (past.length === 0 || !active) return;
    lastEditAt.current = 0; // force the next edit to start a fresh group
    const snapshot = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([active, ...future].slice(0, HISTORY_CAP));
    replaceActive(snapshot);
  }, [past, future, active, replaceActive]);

  const redo = useCallback(() => {
    if (future.length === 0 || !active) return;
    lastEditAt.current = 0;
    const snapshot = future[0];
    setPast([...past, active].slice(-HISTORY_CAP));
    setFuture(future.slice(1));
    replaceActive(snapshot);
  }, [past, future, active, replaceActive]);

  const clearHistory = useCallback(() => {
    lastEditAt.current = 0;
    setPast([]);
    setFuture([]);
  }, []);

  const switchTo = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setActiveId(id);
      clearHistory();
      setRefreshKey((k) => k + 1);
    },
    [activeId, clearHistory],
  );

  const newDesign = useCallback(
    (name?: string) => {
      const fresh = createDefaultDesign(name || 'Untitled');
      setDesigns((ds) => [...ds, fresh]);
      setActiveId(fresh.id);
      clearHistory();
      setRefreshKey((k) => k + 1);
    },
    [clearHistory],
  );

  const duplicateActive = useCallback(() => {
    if (!active) return;
    const copy: WidgetDesign = {
      ...active,
      id: crypto.randomUUID(),
      name: `${active.name} copy`,
      updatedAt: Date.now(),
      logos: { ...active.logos },
      headerContent: { ...active.headerContent },
      welcomeConfig: {
        ...active.welcomeConfig,
        pills: active.welcomeConfig.pills.map((p) => ({ ...p })),
      },
      chatConfig: { ...active.chatConfig },
      cssValues: { ...active.cssValues },
    };
    setDesigns((ds) => [...ds, copy]);
    setActiveId(copy.id);
    clearHistory();
    setRefreshKey((k) => k + 1);
  }, [active, clearHistory]);

  const deleteDesign = useCallback(
    (id: string) => {
      const remaining = designs.filter((d) => d.id !== id);
      // Never let the list reach zero.
      const nextList = remaining.length > 0 ? remaining : [createDefaultDesign('Untitled')];
      setDesigns(nextList);
      if (id === activeId) {
        setActiveId(nextList[0].id);
        clearHistory();
        setRefreshKey((k) => k + 1);
      }
    },
    [designs, activeId, clearHistory],
  );

  const resetActive = useCallback(() => {
    if (!active) return;
    const reset: WidgetDesign = {
      ...active,
      updatedAt: Date.now(),
      cssValues: getDefaultValues(),
      logos: { ...DEFAULT_LOGOS },
      headerContent: { ...DEFAULT_HEADER_CONTENT },
      welcomeConfig: createDefaultWelcomeConfig(),
      chatConfig: { ...DEFAULT_CHAT_CONFIG },
    };
    setPast((p) => [...p, active].slice(-HISTORY_CAP));
    setFuture([]);
    replaceActive(reset);
    setRefreshKey((k) => k + 1);
  }, [active, replaceActive]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return {
    designs,
    active,
    refreshKey,
    canUndo,
    canRedo,
    update,
    undo,
    redo,
    switchTo,
    newDesign,
    duplicateActive,
    deleteDesign,
    resetActive,
  };
}

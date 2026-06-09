import { createContext, useCallback, useContext, type ReactNode } from 'react';
import type { DesignManager } from '@/hooks/useDesignManager';
import { setCssVar } from '@/lib/applyDesign';

const StudioContext = createContext<DesignManager | null>(null);

export function StudioProvider({
  manager,
  children,
}: {
  manager: DesignManager;
  children: ReactNode;
}) {
  return <StudioContext.Provider value={manager}>{children}</StudioContext.Provider>;
}

export function useStudio(): DesignManager {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudio must be used within a <StudioProvider>');
  }
  return ctx;
}

/**
 * Convenience for sections: the active design's cssValues plus a setter that runs
 * the shade cascade and commits through the manager.
 */
export function useVars() {
  const { active, update } = useStudio();
  const values = active.cssValues;
  const setVar = useCallback(
    (name: string, value: string) => {
      update({ cssValues: setCssVar(active.cssValues, name, value) });
    },
    [active.cssValues, update],
  );
  return { values, setVar };
}

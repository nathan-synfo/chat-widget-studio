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
  // Apply several variable edits in ONE commit. Calling setVar twice in a row
  // would clobber the first edit, because both reads see the same render's
  // cssValues — use this when a single action changes more than one variable.
  const setVars = useCallback(
    (patch: Record<string, string>) => {
      let next = active.cssValues;
      for (const [name, value] of Object.entries(patch)) {
        next = setCssVar(next, name, value);
      }
      update({ cssValues: next });
    },
    [active.cssValues, update],
  );
  return { values, setVar, setVars };
}

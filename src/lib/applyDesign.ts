import { getDefaultValues } from './cssVariables';
import { generateShades } from './colorUtils';
import { themes } from './themes';

/**
 * Apply a single CSS-variable edit, running the shade cascade so hover/active
 * shades stay consistent — mirrors the app's existing `handleValueChange`.
 */
export function setCssVar(
  current: Record<string, string>,
  name: string,
  value: string,
): Record<string, string> {
  const next = { ...current, [name]: value };

  if (name === '--chat--color--primary') {
    const s = generateShades(value);
    next['--chat--color--primary-shade-50'] = s.shade50;
    next['--chat--color--primary--shade-100'] = s.shade100;
    // Primary is the master brand colour: it recolours the brand surfaces directly.
    // Each of these can still be fine-tuned afterwards in its own tab (until primary
    // is changed again).
    next['--chat--toggle--background'] = value;
    next['--chat--toggle--hover--background'] = s.shade50;
    next['--chat--toggle--active--background'] = s.shade100;
    next['--chat--input--send--background'] = value;
    next['--chat--header--background'] = value;
    next['--chat--message--user--background'] = value;
  }

  return next;
}

/**
 * Build the full cssValues map for a theme preset (defaults first, theme on top),
 * then run the shade cascade — mirrors the app's existing `handleThemeChange` (§9.3).
 */
export function applyTheme(themeId: string): Record<string, string> | null {
  const t = themes.find((x) => x.id === themeId);
  if (!t) return null;

  const next = { ...getDefaultValues(), ...t.values };
  const primary = next['--chat--color--primary'];
  if (primary) {
    const s = generateShades(primary);
    next['--chat--color--primary-shade-50'] = s.shade50;
    next['--chat--color--primary--shade-100'] = s.shade100;
    if (!t.values['--chat--toggle--hover--background']) {
      next['--chat--toggle--hover--background'] = s.shade50;
    }
    if (!t.values['--chat--toggle--active--background']) {
      next['--chat--toggle--active--background'] = s.shade100;
    }
  }

  return next;
}

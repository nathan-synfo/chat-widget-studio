export function adjustColor(hex: string, percent: number): string {
    // Remove hash if present
    let color = hex.replace(/^#/, '');

    // Parse r, g, b
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Adjust by percent (-100 to 100)
    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));

    // Clamp to 0-255
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    // Convert back to hex
    const rr = r.toString(16).padStart(2, '0');
    const gg = g.toString(16).padStart(2, '0');
    const bb = b.toString(16).padStart(2, '0');

    return `#${rr}${gg}${bb}`;
}

export function generateShades(baseColor: string) {
    // Logic: 
    // shade50 = slightly lighter/darker depending on request, but user asked for dynamic.
    // Usually shade50 might be hover, shade100 active?
    // Let's assume:
    // shade-50 = lighter (tint)
    // shade-100 = darker (shade) -> Wait, usually 50/100/200 are steps.
    // The existing CSS vars are: primary, primary-shade-50, primary-shade-100.
    // Let's implement generic adjustment.

    return {
        shade50: adjustColor(baseColor, -10), // Darken by 10%
        shade100: adjustColor(baseColor, -20) // Darken by 20%
    };
}

export function generateTint(baseColor: string) {
    return adjustColor(baseColor, 20); // Lighten by 20% (e.g. for hovers on dark backgrounds if needed)
}

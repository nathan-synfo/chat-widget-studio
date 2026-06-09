export type MockTheme = 'dark' | 'light';

/**
 * A calm mock website that fills the 1440×900 stage so the chat widget has
 * believable context. Switchable between a dark and light canvas. It must not
 * compete with the widget.
 */
export function MockSite({ theme = 'dark' }: { theme?: MockTheme }) {
  const dark = theme === 'dark';
  const bg = dark ? '#0c0c10' : '#fafaf9';
  const text = dark ? '#ededf2' : '#1a1a1f';
  const muted = dark ? '#7a7a85' : '#6b6b75';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        color: text,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Minimal top nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px 56px', gap: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: '#3b82f6' }} />
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>Acme</span>
        </div>
        <div style={{ display: 'flex', gap: 28, marginLeft: 12 }}>
          {['Product', 'Pricing', 'Docs'].map((l) => (
            <span key={l} style={{ color: muted, fontSize: 15 }}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ color: muted, fontSize: 15 }}>Sign in</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '120px 56px 0', maxWidth: 900 }}>
        <h1
          style={{
            fontSize: 60,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            margin: '0 0 24px',
          }}
        >
          Customer support,
          <br />
          <span style={{ color: muted }}>without the chaos.</span>
        </h1>
        <p style={{ fontSize: 18, color: muted, lineHeight: 1.55, margin: '0 0 36px', maxWidth: 560 }}>
          Every conversation in one place. Smart routing, ready-to-send replies, and a chat widget
          your customers actually use.
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '13px 22px',
            background: text,
            color: bg,
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Start free trial →
        </div>
      </div>
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function Tooltip() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [useLayout, setUseLayout] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useEffect version: tooltip can flash at (0,0) before repositioning.
  useEffect(() => {
    if (useLayout) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  // useLayoutEffect version: position is computed before paint.
  useLayoutEffect(() => {
    if (!useLayout) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [useLayout]);

  return (
    <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => {
          setPosition({ top: 0, left: 0 });
          setUseLayout((prev) => !prev);
        }}
      >
        Basculer : {useLayout ? 'useLayoutEffect' : 'useEffect'}
      </button>

      <br />
      <br />
      <button ref={buttonRef}>Survolez-moi</button>

      <div
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          background: position.top === 0 ? 'red' : '#333',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          transition: 'none',
        }}
      >
        {position.top === 0 ? 'FLASH (0,0)' : 'Info-bulle positionnee !'}
      </div>
    </div>
  );
}

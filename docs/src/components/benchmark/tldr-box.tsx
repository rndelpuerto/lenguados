/**
 * Highlighted summary box using assertion format:
 * number + comparison anchor + relevance statement.
 */

import React from 'react';

interface TldrBoxProps {
 children: React.ReactNode;
}

export default function TldrBox({ children }: TldrBoxProps): React.ReactElement {
 return (
  <div
   style={{
    padding: '1rem 1.5rem',
    margin: '1rem 0',
    borderLeft: '4px solid var(--ifm-color-primary)',
    backgroundColor: 'var(--ifm-background-surface-color, #f6f8fa)',
    borderRadius: '0 4px 4px 0',
    fontSize: '1.1rem',
    lineHeight: 1.6,
   }}
  >
   {children}
  </div>
 );
}

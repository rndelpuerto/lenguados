/**
 * Fallback component displayed when benchmark data is unavailable.
 */

import React from 'react';
import { Zap } from 'lucide-react';
import Link from '@docusaurus/Link';

export default function NoDataFallback(): React.ReactElement {
 return (
  <div
   style={{
    padding: '2rem',
    textAlign: 'center',
    border: '1px dashed var(--ifm-color-emphasis-300)',
    borderRadius: '8px',
    margin: '1rem 0',
   }}
  >
   {/* Vocabulary icon for the performance concept, Large tier (32px), decorative. */}
   <Zap
    size={32}
    strokeWidth={1.75}
    aria-hidden="true"
    style={{ color: 'var(--ifm-color-emphasis-500)', marginBottom: '1rem' }}
   />
   <h3>Performance data unavailable</h3>
   <p>Run the benchmark suite and generate documentation data:</p>
   <pre style={{ display: 'inline-block', textAlign: 'left', padding: '0.5rem 1rem' }}>
    <code>npm run tools:bench:all && npm run tools:bench:summarize</code>
   </pre>
   <p style={{ marginTop: '1rem' }}>
    <Link to="/docs/performance/methodology">Learn about our benchmark methodology</Link>
   </p>
  </div>
 );
}

/**
 * Warning banner shown when a page renders benchmark data that was generated
 * from a filtered (forced) run. The summarize tool stamps `partial: true`
 * into every summary of such a run so pages can label the data.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type { BenchmarkSummaryBase } from '../../types/benchmark-summaries';

interface PartialDataNoticeProps {
 /** The summaries the page renders; the banner shows if any is partial. */
 summaries: Array<BenchmarkSummaryBase | null | undefined>;
}

export default function PartialDataNotice({
 summaries,
}: PartialDataNoticeProps): React.ReactElement | null {
 const hasPartial = summaries.some((summary) => summary?.partial === true);
 if (!hasPartial) return null;

 return (
  <div className="alert alert--warning" role="alert" style={{ margin: '1rem 0' }}>
   <strong>Partial benchmark data.</strong> Some results on this page come from a filtered benchmark
   run and do not cover the full operation set. Regenerate with{' '}
   <code>npm run tools:bench:all && npm run tools:bench:summarize</code>. See the{' '}
   <Link to="/docs/performance/methodology">benchmark methodology</Link> for details.
  </div>
 );
}

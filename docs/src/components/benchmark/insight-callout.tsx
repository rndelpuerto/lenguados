/**
 * "Key Takeaway" box using Docusaurus Admonition.
 * Bold assertion + mechanism (why) + relevance (when it matters).
 */

import React from 'react';
import Admonition from '@theme/Admonition';

interface InsightCalloutProps {
 title?: string;
 children: React.ReactNode;
}

export default function InsightCallout({
 title = 'Key Takeaway',
 children,
}: InsightCalloutProps): React.ReactElement {
 return (
  <Admonition type="info" title={title}>
   {children}
  </Admonition>
 );
}

/**
 * Collapsible section using Docusaurus Details component.
 */

import React from 'react';
import Details from '@theme/Details';

interface MethodologyNoteProps {
 summary?: string;
 children: React.ReactNode;
}

export default function MethodologyNote({
 summary = 'Methodology details',
 children,
}: MethodologyNoteProps): React.ReactElement {
 return <Details summary={<summary>{summary}</summary>}>{children}</Details>;
}

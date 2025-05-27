// TODO: Switch to shadcn/ui Card when available. Currently using a div for the card container.
// ClauseCard: Displays a contract clause with color-coded risk badge
// Uses shadcn/ui Card and Badge
// Props: clauseText (string), riskScore (number), explanation (string), suggestion (string)
// Accessible and responsive

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ClauseAccordion } from './ClauseAccordion';
import { CopyButton } from './CopyButton';

/**
 * Props for ClauseCard
 */
export interface ClauseCardProps {
  clauseText: string;
  riskScore: number; // 1-10, 10 = highest risk
  explanation: string;
  suggestion: string;
}

/**
 * Returns a color and label for the risk badge based on riskScore
 */
function getRiskBadge(riskScore: number): { color: string; label: string } {
  if (riskScore <= 3) return { color: 'bg-green-500', label: 'Low Risk' };
  if (riskScore <= 6) return { color: 'bg-yellow-500', label: 'Medium Risk' };
  return { color: 'bg-red-500', label: 'High Risk' };
}

/**
 * ClauseCard component
 * Renders the clause text, a color-coded risk badge, and an accordion for explanation/suggestion
 */
export const ClauseCard: React.FC<ClauseCardProps> = ({
  clauseText,
  riskScore,
  explanation,
  suggestion,
}) => {
  const { color, label } = getRiskBadge(riskScore);
  return (
    <Card className="p-4 mb-4 w-full" tabIndex={0} aria-label="Contract clause card">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-base">Clause</span>
        <Badge className={`${color} text-white`} aria-label={label} title={label}>
          {label}
        </Badge>
      </div>
      <div className="mb-2 text-sm whitespace-pre-line">{clauseText}</div>
      {/* Accordion for explanation and suggestion, with CopyButton for suggestion */}
      <ClauseAccordion explanation={explanation} suggestion={suggestion}>
        <div className="flex items-center gap-2 mt-2">
          <CopyButton text={suggestion} />
        </div>
      </ClauseAccordion>
    </Card>
  );
};

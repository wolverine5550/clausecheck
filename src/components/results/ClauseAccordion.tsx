// ClauseAccordion: Shows AI explanation and suggestion in an accordion
// Uses shadcn/ui Accordion
// Props: explanation (string), suggestion (string), children (ReactNode)
// Accessible and minimal logic

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';

/**
 * Props for ClauseAccordion
 */
export interface ClauseAccordionProps {
  explanation: string;
  suggestion: string;
  children?: React.ReactNode;
}

/**
 * ClauseAccordion component
 * Renders an accessible accordion for AI explanation and suggestion
 */
export const ClauseAccordion: React.FC<ClauseAccordionProps> = ({
  explanation,
  suggestion,
  children,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full mt-2">
      <AccordionItem value="ai-analysis">
        <AccordionTrigger className="font-medium text-sm mb-1">
          AI Analysis & Suggestion
        </AccordionTrigger>
        <AccordionContent>
          <div className="mb-2">
            <span className="font-semibold">Explanation:</span>
            <span className="ml-1">{explanation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Suggestion:</span>
            <span className="ml-1">{suggestion}</span>
          </div>
          {children && <div className="mt-2">{children}</div>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

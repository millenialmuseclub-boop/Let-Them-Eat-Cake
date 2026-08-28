/* Workshop lab architecture — reuses Ramen's strongest transferable pattern: ONE shared
   LabExplorer component serves N labs via data, each lab option shows a qualitative 0-5 "bars"
   visualization rather than a calculator (explicitly not a numeric input/output tool). */

export interface LabVariableOption {
  id: string;
  label: string;
  description: string;
  bars: { label: string; value: number }[]; // value 0-5
}

export interface LabVariable {
  id: string;
  label: string;
  options: LabVariableOption[];
}

export interface Lab {
  slug: string;
  title: string;
  group: 'understand' | 'foundations' | 'form' | 'bowl';
  summary: string;
  variables: LabVariable[];
  relatedNoodleTypeIds?: string[];
  relatedDishIds?: string[];
}

export interface TroubleshooterCause {
  cause: string;
  correction: string;
  flavorTags?: string[];
  relatedComponentCategory?: string;
}

export interface TroubleshooterProblem {
  id: string;
  problem: string;
  diagnosticQuestions: string[];
  causes: TroubleshooterCause[];
  relatedLessonSlug?: string;
}

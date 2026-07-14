import { STAGE_INFO } from './catalog.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

// Presentation-only derivation. The backend remains the sole owner of stage
// selection; this helper receives the authoritative stage and existing
// goalProgress values and only explains the next milestone to the customer.
export function buildEvolutionPresentation({
  stage,
  goalProgress,
  savedAmount,
  goalAmount,
  stages = STAGE_INFO,
}) {
  const currentIndex = clamp(Number.isInteger(stage) ? stage : 0, 0, stages.length - 1);
  const progress = clamp(Number.isFinite(goalProgress) ? goalProgress : 0, 0, 100);
  const currentStage = stages[currentIndex];
  const nextStage = stages[currentIndex + 1] || null;
  const nextThresholdAmount = nextStage && goalAmount > 0
    ? Math.ceil((goalAmount * nextStage.at) / 100)
    : null;

  return {
    currentIndex,
    currentStage,
    nextStage,
    progress,
    remainingPercentage: nextStage ? Math.max(0, nextStage.at - progress) : 0,
    remainingAmount: nextThresholdAmount === null
      ? 0
      : Math.max(0, Math.ceil(nextThresholdAmount - savedAmount)),
    milestones: stages.map((milestone, index) => ({
      ...milestone,
      state: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'future',
    })),
  };
}

import type { Echo, Grade } from "@/types";

// Simplified FSRS constants
const W = [0.4, 0.6, 2.4, 5.8]; // Initial stability for grades 1-4

export const calculateNextReview = (
  echo: Echo,
  grade: Grade,
): Partial<Echo> => {
  let { stability, difficulty } = echo;
  const now = Date.now();

  if (echo.reps === 0) {
    // Initializing the Echo
    stability = W[grade - 1];
    difficulty = 10 - grade * 2;
  } else {
    // Adjusting based on performance
    const retrievability = Math.exp(
      (Math.log(0.9) * (now - echo.lastReview)) / (stability * 86400000),
    );

    // Update Difficulty (Clamp between 1 and 10)
    difficulty = Math.max(
      1,
      Math.min(10, difficulty + (grade === 1 ? 2 : grade === 3 ? 0 : -1)),
    );

    // Update Stability
    if (grade === 1) {
      stability = stability * 0.5; // Forget: cut stability
    } else {
      // Success: Increase stability based on difficulty and current retrievability
      stability =
        stability *
        (1 +
          Math.exp(W[0]) *
            (11 - difficulty) *
            Math.pow(stability, -0.1) *
            (Math.exp(1 - retrievability) - 1));
    }
  }

  const intervalDays = Math.max(1, Math.round(stability));

  return {
    stability,
    difficulty,
    reps: echo.reps + 1,
    lastReview: now,
    nextReview: now + intervalDays * 86400000,
  };
};

export const promptTemplates = {
  reflection: (content: string) =>
    `Based on this journal entry, suggest a thoughtful reflection question: ${content}`,

  moodAnalysis: (content: string) =>
    `Analyze the mood and emotions in this journal entry: ${content}`,

  summary: (content: string) =>
    `Provide a brief summary of this journal entry: ${content}`,
};

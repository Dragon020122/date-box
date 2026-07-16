export function setQuizAnswer(
  answers: string[],
  questionIndex: number,
  answerId: string,
  questionCount = 5,
): string[] {
  const nextAnswers = Array.from(
    { length: questionCount },
    (_, index) => answers[index] ?? "",
  );

  if (questionIndex >= 0 && questionIndex < questionCount) {
    nextAnswers[questionIndex] = answerId;
  }

  return nextAnswers;
}

export function hasCompleteQuizAnswers(
  answers: string[],
  questionCount = 5,
): boolean {
  return (
    answers.length >= questionCount &&
    answers.slice(0, questionCount).every((answer) => answer.length > 0)
  );
}

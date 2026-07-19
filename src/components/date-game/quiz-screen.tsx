"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { quizQuestions } from "@/data/quiz-questions";
import { cn } from "@/lib/cn";

type QuizPlayer = "playerA" | "playerB";

interface QuizScreenProps {
  player: QuizPlayer;
  answers: string[];
  initialQuestionIndex?: number;
  questionIndex?: number;
  onQuestionIndexChange?: (questionIndex: number) => void;
  onAnswer: (questionIndex: number, answerId: string) => void;
  onExit: () => void;
  onComplete: (questionIndex: number, answerId: string) => boolean | void;
  disableBackAtFirstQuestion?: boolean;
  copy?: Partial<{
    label: string;
    title: string;
    description: string;
    exitLabel: string;
    completeLabel: string;
  }>;
}

const playerCopy: Record<
  QuizPlayer,
  { label: string; title: string; description: string; exitLabel: string }
> = {
  playerA: {
    label: "玩家 A · 你",
    title: "先由你来偷偷做选择",
    description: "暂时不会让 TA 看到答案。",
    exitLabel: "返回条件设置",
  },
  playerB: {
    label: "玩家 B · TA",
    title: "现在轮到你做选择",
    description: "不要猜对方的答案，只选你真正期待的。",
    exitLabel: "返回交接页面",
  },
};

export function QuizScreen({
  player,
  answers,
  initialQuestionIndex = 0,
  questionIndex: controlledQuestionIndex,
  onQuestionIndexChange,
  onAnswer,
  onExit,
  onComplete,
  disableBackAtFirstQuestion = false,
  copy: copyOverrides,
}: QuizScreenProps) {
  const [internalQuestionIndex, setInternalQuestionIndex] = useState(() =>
    Math.min(
      quizQuestions.length - 1,
      Math.max(0, initialQuestionIndex),
    ),
  );
  const questionIndex = controlledQuestionIndex ?? internalQuestionIndex;
  const navigationLockedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const copy = { ...playerCopy[player], ...copyOverrides };
  const question = quizQuestions[questionIndex];
  const selectedAnswer = answers[questionIndex] ?? "";
  const isLastQuestion = questionIndex === quizQuestions.length - 1;
  const progress = (questionIndex + 1) / quizQuestions.length;

  useEffect(() => {
    navigationLockedRef.current = false;
  }, [questionIndex]);

  function moveToQuestion(nextQuestionIndex: number) {
    if (controlledQuestionIndex === undefined) {
      setInternalQuestionIndex(nextQuestionIndex);
    }
    onQuestionIndexChange?.(nextQuestionIndex);
  }

  function handleBack() {
    if (navigationLockedRef.current) {
      return;
    }
    navigationLockedRef.current = true;

    if (questionIndex === 0) {
      if (disableBackAtFirstQuestion) {
        navigationLockedRef.current = false;
        return;
      }
      onExit();
      return;
    }

    moveToQuestion(questionIndex - 1);
  }

  function handleContinue() {
    if (!selectedAnswer || navigationLockedRef.current) {
      return;
    }
    navigationLockedRef.current = true;

    if (isLastQuestion) {
      const didComplete = onComplete(questionIndex, selectedAnswer);
      if (didComplete === false) {
        navigationLockedRef.current = false;
      }
      return;
    }

    moveToQuestion(questionIndex + 1);
  }

  const playerAccent = player === "playerA" ? "text-pink-600" : "text-purple-500";

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-8.5rem-var(--safe-top)-var(--safe-bottom))] w-full max-w-[720px] flex-col" aria-labelledby="quiz-title">
      <div className="flex items-start justify-between gap-4 sm:items-end">
        <div>
          <p className={cn("inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] sm:text-sm", playerAccent)}>
            <ShieldCheck aria-hidden="true" className="size-4" />
            {copy.label}
          </p>
          <h1
            id="quiz-title"
            className="sr-only sm:not-sr-only sm:mt-4 sm:text-[clamp(2rem,8vw,3rem)] sm:font-semibold sm:leading-[1.14] sm:tracking-[-0.035em] sm:text-text-primary"
          >
            {copy.title}
          </h1>
          <p id="quiz-description" className="mt-1 text-xs leading-5 text-text-muted sm:mt-3 sm:text-base sm:leading-7 sm:text-text-secondary">
            {copy.description}
          </p>
        </div>

        <p className="shrink-0 font-mono text-sm font-semibold tracking-[0.12em] text-text-primary">
          {String(questionIndex + 1).padStart(2, "0")} / {String(quizQuestions.length).padStart(2, "0")}
        </p>
      </div>

      <div
        className="mt-3 sm:mt-7"
        role="progressbar"
        aria-label={`${copy.label}答题进度`}
        aria-valuemin={1}
        aria-valuemax={quizQuestions.length}
        aria-valuenow={questionIndex + 1}
      >
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/55 shadow-inner">
          <motion.div
            className="absolute inset-0 origin-left rounded-full [background:var(--gradient-primary)]"
            animate={{ scaleX: progress }}
            initial={false}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-1.5 flex justify-between px-0.5 sm:mt-2" aria-hidden="true">
          {quizQuestions.map((progressQuestion, index) => (
            <span
              key={progressQuestion.id}
              className={cn(
                "size-2.5 rounded-full border border-white bg-white/75 transition-[transform,background-color] duration-200",
                index <= questionIndex && (player === "playerA" ? "scale-110 bg-pink-400" : "scale-110 bg-purple-400"),
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 items-start sm:mt-6 sm:min-h-[330px] sm:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={question.id}
            aria-describedby="quiz-description"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 18, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -14, y: -4 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-[1.6rem] border border-white/85 bg-surface p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:rounded-[2rem] sm:p-7"
          >
            <legend className="sr-only">{question.question}</legend>
            <p className={cn("text-[11px] font-semibold tracking-[0.14em] sm:text-xs", playerAccent)}>
              今晚的小问题
            </p>
            <h2 className="mt-1.5 text-xl font-semibold leading-7 tracking-[-0.02em] text-text-primary sm:mt-2 sm:text-2xl sm:leading-9">
              {question.question}
            </h2>

            <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              {question.options.map((option) => {
                const selected = selectedAnswer === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onAnswer(questionIndex, option.id)}
                    aria-pressed={selected}
                    className={cn(
                      "relative flex min-h-14 items-center rounded-2xl border px-4 py-2.5 pr-12 text-left text-[15px] font-medium leading-6 sm:min-h-[68px] sm:py-3",
                      "border-white/80 bg-white/42 text-text-secondary transition-[transform,border-color,background-color,color,box-shadow] duration-200",
                      "hover:border-pink-200 hover:bg-white/65 active:scale-[0.99] active:bg-pink-50/70",
                      selected &&
                        (player === "playerA"
                          ? "border-pink-400 bg-pink-50/90 text-text-primary shadow-[0_14px_36px_rgba(105,62,84,0.12)]"
                          : "border-purple-400 bg-purple-100/75 text-text-primary shadow-[0_14px_36px_rgba(105,62,84,0.1)]"),
                    )}
                  >
                    {option.label}
                    {selected ? (
                      <span
                        className={cn("absolute right-3.5 grid size-6 place-items-center rounded-full text-white", player === "playerA" ? "bg-pink-600" : "bg-purple-500")}
                        aria-hidden="true"
                      >
                        <Check className="size-3.5" strokeWidth={2.6} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.fieldset>
        </AnimatePresence>
      </div>

      <MobileActionBar>
        <SecondaryButton
          onClick={handleBack}
          disabled={disableBackAtFirstQuestion && questionIndex === 0}
          className="pointer-events-auto w-full sm:w-auto"
        >
          <ArrowLeft aria-hidden="true" className="size-4.5" />
          {questionIndex === 0 && !disableBackAtFirstQuestion ? copy.exitLabel : "上一题"}
        </SecondaryButton>
        <PrimaryButton
          onClick={handleContinue}
          disabled={!selectedAnswer}
          className="pointer-events-auto w-full sm:w-auto"
        >
          {isLastQuestion ? copy.completeLabel ?? "藏好我的答案" : "下一题"}
          <ArrowRight aria-hidden="true" className="size-4.5" />
        </PrimaryButton>
      </MobileActionBar>
    </section>
  );
}

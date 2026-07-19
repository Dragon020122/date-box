import { ActiveDateScreen } from "@/components/date-game/active-date-screen";
import { CompatibilityScreen } from "@/components/date-game/compatibility-screen";
import { DatePlanScreen } from "@/components/date-game/date-plan-screen";
import { HandoffScreen } from "@/components/date-game/handoff-screen";
import { MemoryCardScreen } from "@/components/date-game/memory-card-screen";
import { MoodScreen } from "@/components/date-game/mood-screen";
import { MysteryBoxScreen } from "@/components/date-game/mystery-box-screen";
import { PreferencesScreen } from "@/components/date-game/preferences-screen";
import { QuizScreen } from "@/components/date-game/quiz-screen";
import { WelcomeScreen } from "@/components/date-game/welcome-screen";
import { datePlans } from "@/data/date-plans";
import { quizQuestions } from "@/data/quiz-questions";
import type { StepResolution } from "@/lib/active-date-state";
import type {
  DateGameState,
  DatePreferences,
  GameStep,
  MoodId,
} from "@/types/date-game";

interface DateGameScreenProps {
  gameState: DateGameState;
  playerBInitialQuestion: number;
  planNotice: string | null;
  onStepChange: (step: GameStep) => void;
  onPreferencesChange: (patch: Partial<DatePreferences>) => void;
  onMoodChange: (mood: MoodId) => void;
  onMoodContinue: () => void;
  onPreferencesContinue: () => void;
  onPlayerAAnswer: (questionIndex: number, answerId: string) => void;
  onPlayerBAnswer: (questionIndex: number, answerId: string) => void;
  onPlayerAComplete: () => void;
  onPlayerBComplete: () => void;
  onHandoffContinue: () => void;
  onCompatibilityBack: () => void;
  onMysteryBoxOpen: () => void;
  onChangePlan: () => void;
  onSavePlan: () => void;
  onResolveDateStep: (stepId: string, resolution: StepResolution) => void;
  onActiveDateFinish: () => void;
  onFavoriteMomentChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSaveMemory: () => void;
  onCopyResult: (success: boolean) => void;
  onRequestReset: () => void;
  onCreateInvite: () => void;
}

export function DateGameScreen({
  gameState,
  playerBInitialQuestion,
  planNotice,
  onStepChange,
  onPreferencesChange,
  onMoodChange,
  onMoodContinue,
  onPreferencesContinue,
  onPlayerAAnswer,
  onPlayerBAnswer,
  onPlayerAComplete,
  onPlayerBComplete,
  onHandoffContinue,
  onCompatibilityBack,
  onMysteryBoxOpen,
  onChangePlan,
  onSavePlan,
  onResolveDateStep,
  onActiveDateFinish,
  onFavoriteMomentChange,
  onMessageChange,
  onSaveMemory,
  onCopyResult,
  onRequestReset,
  onCreateInvite,
}: DateGameScreenProps) {
  const selectedPlan = datePlans.find(
    (plan) => plan.id === gameState.selectedPlanId,
  );

  switch (gameState.step) {
    case "welcome":
      return (
        <WelcomeScreen
          onInvite={onCreateInvite}
          onStart={() => onStepChange("mood")}
        />
      );
    case "mood":
      return (
        <MoodScreen
          selectedMood={gameState.preferences.mood}
          onSelect={onMoodChange}
          onBack={() => onStepChange("welcome")}
          onContinue={onMoodContinue}
        />
      );
    case "preferences":
      return (
        <PreferencesScreen
          preferences={gameState.preferences}
          onTimeChange={(time) => onPreferencesChange({ time })}
          onBudgetChange={(budget) => onPreferencesChange({ budget })}
          onDistanceChange={(distance) => onPreferencesChange({ distance })}
          onRelationshipChange={(relationship) =>
            onPreferencesChange({ relationship })
          }
          onBack={() => onStepChange("mood")}
          onContinue={onPreferencesContinue}
        />
      );
    case "player-a-quiz":
      return (
        <QuizScreen
          player="playerA"
          answers={gameState.playerAAnswers}
          onAnswer={onPlayerAAnswer}
          onExit={() => onStepChange("preferences")}
          onComplete={onPlayerAComplete}
        />
      );
    case "handoff":
      return <HandoffScreen onContinue={onHandoffContinue} />;
    case "player-b-quiz":
      return (
        <QuizScreen
          player="playerB"
          answers={gameState.playerBAnswers}
          initialQuestionIndex={playerBInitialQuestion}
          onAnswer={onPlayerBAnswer}
          onExit={() => onStepChange("handoff")}
          onComplete={onPlayerBComplete}
        />
      );
    case "compatibility":
      return gameState.compatibility ? (
        <CompatibilityScreen
          result={gameState.compatibility}
          onBack={onCompatibilityBack}
          onContinue={() => onStepChange("mystery-box")}
        />
      ) : (
        <QuizScreen
          player="playerB"
          answers={gameState.playerBAnswers}
          initialQuestionIndex={quizQuestions.length - 1}
          onAnswer={onPlayerBAnswer}
          onExit={() => onStepChange("handoff")}
          onComplete={onPlayerBComplete}
        />
      );
    case "mystery-box":
      return <MysteryBoxScreen onOpen={onMysteryBoxOpen} />;
    case "plan":
      return selectedPlan ? (
        <DatePlanScreen
          plan={selectedPlan}
          planChangeCount={gameState.planChangeCount}
          notice={planNotice}
          onChangePlan={onChangePlan}
          onSavePlan={onSavePlan}
          onStart={() => onStepChange("active-date")}
        />
      ) : (
        <MysteryBoxScreen onOpen={onMysteryBoxOpen} />
      );
    case "active-date":
      return selectedPlan ? (
        <ActiveDateScreen
          plan={selectedPlan}
          completedStepIds={gameState.completedStepIds}
          skippedStepIds={gameState.skippedStepIds}
          onResolveStep={onResolveDateStep}
          onFinish={onActiveDateFinish}
        />
      ) : (
        <MysteryBoxScreen onOpen={onMysteryBoxOpen} />
      );
    case "memory":
      return selectedPlan ? (
        <MemoryCardScreen
          gameState={gameState}
          plan={selectedPlan}
          onFavoriteMomentChange={onFavoriteMomentChange}
          onMessageChange={onMessageChange}
          onSave={onSaveMemory}
          onCopyResult={onCopyResult}
          onRequestReset={onRequestReset}
        />
      ) : (
        <MysteryBoxScreen onOpen={onMysteryBoxOpen} />
      );
    default:
      return (
        <WelcomeScreen
          onInvite={onCreateInvite}
          onStart={() => onStepChange("mood")}
        />
      );
  }
}

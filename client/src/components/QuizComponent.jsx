import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuizComponent({ quizData, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData.questions || [];
  const passingScore = quizData.passingScore || 70;

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    // If passed, mark lesson as complete
    if (finalScore >= passingScore) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= passingScore;
    return (
      <div className="bg-white rounded-xl border border-[#DFE1E4] p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          {passed ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-[#1D1F23] mb-2">
          {passed ? 'Congratulations! You Passed!' : 'Keep Learning!'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {passed 
            ? 'Great job! You have successfully completed this quiz.' 
            : 'You didn\'t pass this time, but you can try again!'}
        </p>
        
        <div className="bg-[#F6F7F9] rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">Your Score</p>
          <p className={`text-5xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {score}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Passing score: {passingScore}% • Correct: {Math.round((score / 100) * questions.length)}/{questions.length}
          </p>
        </div>
        
        <div className="flex gap-3 justify-center">
          {!passed && (
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#461EA4] text-white font-semibold rounded-lg hover:bg-[#3a188a] transition-colors"
            >
              Retry Quiz
            </button>
          )}
          {passed && (
            <button
              onClick={() => window.location.href = '/my-courses'}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Learning
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="bg-white rounded-xl border border-[#DFE1E4] p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-[#461EA4] font-semibold">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#461EA4] rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-[#1D1F23] mb-4">
          {question.question}
        </h4>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(currentQuestion, idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswers[currentQuestion] === idx
                  ? 'border-[#461EA4] bg-[#461EA4]/5'
                  : 'border-[#DFE1E4] hover:border-[#461EA4]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === idx
                    ? 'border-[#461EA4] bg-[#461EA4]'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion] === idx && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[#1D1F23]">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-[#DFE1E4]">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            currentQuestion === 0
              ? 'opacity-0 cursor-default'
              : 'text-[#461EA4] hover:bg-[#461EA4]/5'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isAnswered
              ? 'bg-[#461EA4] text-white hover:bg-[#3a188a]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
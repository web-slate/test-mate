"use client"

import { useState, useEffect } from 'react';
import QuestionComponent from './QuestionComponent';
import ResultsPage from './ResultsPage';
import { shuffleArray } from '../utils/arrayUtils';

function getCurrentDate() {
  return new Date().toISOString();
}

export default function Quiz({ quizType, user, resetQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/questions?type=${quizType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const shuffledQuestions = shuffleArray(data).slice(0, 15);
          setQuestions(shuffledQuestions);
        } else if (Array.isArray(data) && data.length === 0) {
          setError('No questions available for this quiz type.');
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Received invalid data from server');
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setError(`Failed to load questions: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [quizType]);

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer) return false;

    switch (question.type) {
      case 'fill-in-the-blanks':
        return Array.isArray(userAnswer) &&
          Array.isArray(question.blanks) &&
          question.blanks.every((blank, index) =>
            userAnswer[index] && blank.includes(userAnswer[index])
          );

      case 'multiple-choice':
        if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswers)) {
          return false;
        }
        const sortedUserAnswer = [...userAnswer].sort();
        const sortedCorrectAnswers = [...question.correctAnswers].sort();
        return JSON.stringify(sortedCorrectAnswers) === JSON.stringify(sortedUserAnswer);

      case 'matching':
        if (!userAnswer || !question.correctMatches) {
          return false;
        }
        return JSON.stringify(question.correctMatches) === JSON.stringify(userAnswer);

      default:
        return false;
    }
  };

  const finishQuiz = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (checkAnswer(question, userAnswers[index])) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setQuizFinished(true);

    // Get the current user's ID from local storage
    const currentUserId = localStorage.getItem('quizUserId');

    if (currentUserId) {
      // Get existing quiz results from local storage
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

      // Find the current user in the quiz results
      const updatedResults = storedResults.map((result) => {
        if (result.id === currentUserId) {
          // Update the user's quiz result
          return {
            ...result,
            type: quizType,
            score: totalScore,
            totalQuestions: questions.length,
            date: getCurrentDate(), // or use the current date/time
          };
        }
        return result;
      });

      // Save the updated results back to local storage
      localStorage.setItem('quizResults', JSON.stringify(updatedResults));
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={resetQuiz} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <ResultsPage
        questions={questions}
        userAnswers={userAnswers}
        score={score}
        totalQuestions={questions.length}
        resetQuiz={resetQuiz}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">No questions available for this quiz type.</p>
        <button onClick={resetQuiz} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Try Another Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <QuestionComponent
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        userAnswer={userAnswers[currentQuestionIndex]}
      />
      <button
        onClick={nextQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
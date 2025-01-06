import { useState } from 'react'

export default function ResultsPage({ questions, userAnswers, score, totalQuestions, resetQuiz }) {
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 5
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion)

  const renderAnswer = (question, index) => {
    const questionIndex = indexOfFirstQuestion + index
    const userAnswer = userAnswers[questionIndex]

    switch (question.type) {
      case 'fill-in-the-blanks':
        return (
          <div>
            <p className="font-semibold">Your answer:</p>
            {question.blanks.map((blank, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className={blank.includes(userAnswer[i]) ? 'text-green-600' : 'text-red-600'}>
                  {userAnswer[i] || '_____'}
                </span>
              </span>
            ))}
            <p className="font-semibold mt-2">Correct answer:</p>
            {question.blanks.map((blank, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className="text-green-600">{blank[0]}</span>
              </span>
            ))}
          </div>
        )
      case 'multiple-choice':
        return (
          <div>
            <p className="font-semibold">Your answer: 
              <span className={question.correctAnswers.every(a => userAnswer?.includes(a)) ? 'text-green-600' : 'text-red-600'}>
                {userAnswer?.join(', ') || 'No answer'}
              </span>
            </p>
            <p className="font-semibold mt-2">Correct answer: 
              <span className="text-green-600">{question.correctAnswers.join(', ')}</span>
            </p>
          </div>
        )
      case 'matching':
        return (
          <div>
            <p className="font-semibold">Your matches:</p>
            {Object.entries(userAnswer || {}).map(([key, value]) => (
              <p key={key} className={question.correctMatches[key] === value ? 'text-green-600' : 'text-red-600'}>
                {key} ➔ {value}
              </p>
            ))}
            <p className="font-semibold mt-2">Correct matches:</p>
            {Object.entries(question.correctMatches).map(([key, value]) => (
              <p key={key} className="text-green-600">{key} ➔ {value}</p>
            ))}
          </div>
        )
      default:
        return <p>Unsupported question type</p>
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <p className="mb-4">Your score: {score} out of {totalQuestions}</p>
      {currentQuestions.map((question, index) => (
        <div key={indexOfFirstQuestion + index} className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">Question {indexOfFirstQuestion + index + 1}:</h3>
          <p className="mb-2">{question.question}</p>
          {renderAnswer(question, index)}
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      <button
        onClick={resetQuiz}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Start New Quiz
      </button>
    </div>
  )
}


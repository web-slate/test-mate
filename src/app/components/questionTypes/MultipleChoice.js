"use client"

export default function MultipleChoice({ question, onAnswer, userAnswer }) {
  const handleChange = (option) => {
    if (question.multipleAnswers) {
      const newAnswer = userAnswer?.includes(option)
        ? userAnswer.filter((a) => a !== option)
        : [...(userAnswer || []), option]
      onAnswer(newAnswer)
    } else {
      onAnswer([option])
    }
  }

  return (
    <div>
      <p className="mb-2">{question.question}</p>
      {question.options.map((option, index) => (
        <div key={index} className="mb-2">
          <label className="flex items-center">
            <input
              type={question.multipleAnswers ? 'checkbox' : 'radio'}
              checked={userAnswer?.includes(option)}
              onChange={() => handleChange(option)}
              className="mr-2"
            />
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}

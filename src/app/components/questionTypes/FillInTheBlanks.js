import { useState, useEffect } from 'react'

export default function FillInTheBlanks({ question, onAnswer, userAnswer }) {
  const [answers, setAnswers] = useState(userAnswer || [])

  useEffect(() => {
    if (userAnswer) {
      setAnswers(userAnswer)
    } else {
      setAnswers(new Array(question.blanks.length).fill(''))
    }
  }, [question, userAnswer])

  const handleChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
    onAnswer(newAnswers)
  }

  const parts = question.question.split('__')

  return (
    <div>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              className="border border-gray-300 px-2 py-1 mx-1"
            />
          )}
        </span>
      ))}
    </div>
  )
}

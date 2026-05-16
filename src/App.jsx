import { useEffect, useState, useRef } from 'react'
import './App.css'
import Question from './Question'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import Confetti from "react-confetti"


function App() {
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Fisher-Yates (Knuth) Shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function selectOption(questionId, optionValue) {
    console.log(`Selected option: ${optionValue} for question ID: ${questionId}`)
    setQuestions(prevQuestions => {
      return prevQuestions.map(question => {
        if (question.id === questionId) {
          const updatedOptions = question.answerOptions.map(option => {
            return {
              ...option,
              isSelected: option.value === optionValue
            }
          })
          return {
            ...question,
            answerOptions: updatedOptions
          }
        } else {
          return question
        }
      })
    })
  }

  const startQuiz = () => {
    getQuestions(selectedCategory, selectedDifficulty)
  }

  const playAgain = () => {
    setQuestions([])
    setIsSubmitted(false)
  }

  const getQuestions = (selectedCategoryId, selectedDifficulty) => {
    const url = `https://opentdb.com/api.php?amount=5&type=multiple&category=${selectedCategoryId}&difficulty=${selectedDifficulty}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const decodedQuestions = data.results.map(question => {
          const answerOptions = [...question.incorrect_answers.map(decode), decode(question.correct_answer)]
            .map(o => ({ value: o, isSelected: false }))
          return {
            ...question,
            id: nanoid(),
            question: decode(question.question),
            correct_answer: decode(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(decode),
            answerOptions: shuffleArray(answerOptions)
          }
        })
        setQuestions(decodedQuestions)
      })
      .catch(error => console.error(error))
    }

  const checkAnswers = () => {
    setIsSubmitted(true)
  }

  // derived 
  const showQuestions = questions.length > 0
  const questionElements = questions.map(
    (question) => (
      <Question
        key={question.id}
        question={question}
        isSubmitted={isSubmitted}
        selectOption={(id, value) => selectOption(id, value)}
      />
    )
  )
  const score = isSubmitted ? questions.reduce((total, question) => {
    const selectedOption = question.answerOptions.find(option => option.isSelected)
    if (selectedOption && selectedOption.value === question.correct_answer) {
      return total + 1
    } else {
      return total
    }
  }, 0) : 0
  const gameWon = score > 0 && score === questions.length
  const scoreText = `You scored ${score}/${questions.length} correct answers`

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => setCategories(data.trivia_categories))
      .catch(error => console.error(error))
  }, [])

  const categoryElements = categories.map(category => (
    <option key={category.id} value={category.id}>{category.name}</option>
  ))
  const selectedCategoryName = categories.find(category => category.id === parseInt(selectedCategory))?.name || ''
  const selectedDifficultyName = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)

  return (
    <>
      {gameWon && <Confetti />}
      {!showQuestions &&
        <section className="intro-page">
          <h1>Quizzical</h1>
          <p className="description">
            Quizzical game is a fun and interactive way to test your knowledge on various topics.
          </p>
          <div className="category-select">
            <label htmlFor="category">Select Category:</label>
            <select id="category" name="category" onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">-- Select a Category --</option>
              {categoryElements}
            </select>
          </div>
          <div className="difficulty-select">
            <label htmlFor="difficulty">Select Difficulty:</label>
            <select id="difficulty" name="difficulty" onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="">-- Select Difficulty --</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => startQuiz()}
            disabled={!selectedCategory || !selectedDifficulty}
          >
            Start Quiz
          </button>
        </section>
      }
      {showQuestions &&
        <section className="questions-page">
          <h2>{selectedCategoryName} - {selectedDifficultyName}</h2>
          {questionElements}
          <div className='buttons'>
            {!isSubmitted &&
              <button
                type="button"
                className='btn-check-answers'
                onClick={() => checkAnswers()}
              >
                Check Answers
              </button>
            }
            {isSubmitted &&
              <span className='scoreText'>{scoreText}</span>
            }
            {isSubmitted &&
              <button
                type="button"
                className='btn-play-again'
                onClick={() => playAgain()}
              >
                Play again
              </button>
            }
          </div>
        </section>
      }
    </>
  )
}

export default App

import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Question from './Question'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'

function App() {
  const [questions, setQuestions] = useState([])

  // Fisher-Yates (Knuth) Shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const startQuiz = () => {
    console.log('Fetching questions...')
    const url = 'https://opentdb.com/api.php?amount=5&type=multiple'
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const decodedQuestions = data.results.map(question => {
          return {
            ...question,
            id: nanoid(),
            question: decode(question.question),
            correct_answer: decode(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(decode),
            answerOptions: shuffleArray([...question.incorrect_answers.map(decode), decode(question.correct_answer)])
          }
        })
        console.log(decodedQuestions)
        setQuestions(decodedQuestions)
      })
      .catch(error => console.error(error))
  }

  const checkAnswers = () => {
    console.log('Checking answers!')
  }

  // derived 
  const showQuestions = questions.length > 0

  return (
    <>
      {!showQuestions &&
        <section id="intro">
          <h1>Quizzical</h1>
          <p className="description">
            Quizzical game is a fun and interactive way to test your knowledge on various topics. It
          </p>
          <button
            type="button"
            className="counter"
            onClick={() => startQuiz()}
          >
            Start Quiz
          </button>
        </section>
      }
      {showQuestions &&
        <section id="questions">
          <h1>Questions</h1>
          {questions.map((question, index) => (
            <Question key={question.id} question={question} />
          ))}
          <button
            type="button"
            className="counter"
            onClick={() => checkAnswers()}
          >
            Check Answers
          </button>
        </section>
      }
    </>
  )
}

export default App

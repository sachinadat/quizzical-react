import { nanoid } from 'nanoid'

export default function Question(props) {
  return (
    <div>
      <h3>{props.question.question}</h3>
      <div>
        {props.question.answerOptions.map(option => (
          <button key={option}>{option}</button>
        ))}
      </div>
      __________________________________________________
    </div>
  )
}
export default function Question(props) {
  const questionId = props.question.id;
  const handleClick = (optionValue) => {
    props.selectOption(questionId, optionValue)
  }

  const optionElements = props.question.answerOptions.map(option => {
    const isSubmitted = props.isSubmitted
    const isRightAnswer = option.value === props.question.correct_answer
    let className = '' 
    
    if (isSubmitted) {
      if (isRightAnswer) {
        className = 'right'
      } else if (option.isSelected) {
        className = 'wrong'
      }
    } else if (option.isSelected) {
      className = 'selected'
    }

    return (
      <button
        key={option.value}
        className={className}
        onClick={() => handleClick(option.value)}
      >
        {option.value}
      </button>
    )
  })

  return (
    <div className="question">
      <h3>{props.question.question}</h3>
      <div className="options">
        {
          optionElements
        }
      </div>
    </div>
  )
}
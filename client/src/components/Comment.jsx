const Comment = (props) => {
  const { name, comment, key } = props
  return (
    <div key={key}>
      <h3>{name}</h3>
      <p>{comment}</p>
    </div>
  )
}

export default Comment

import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import axiosInstance from '../../../utils/verifyJWT'
import { ThumbsUp, Flag } from 'lucide-react'
import { globalContext } from '../../../App'

const ReviewsComponent = (props) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [comments, setComments] = useState([])
  const { isLoggedIn, userData } = useContext(globalContext)
  const { productDetails } = props

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${serverURL}/api/getCommentsOfProduct/${productDetails._id}`
        )
        const data = response.data
        setComments(data)
      } catch (e) {
        alert('Error loading Comments')
        console.error(e)
      }
    }

    fetchComments()
  }, [productDetails, serverURL])

  const likeComment = async (commentId) => {
    if (!isLoggedIn) {
      return alert('Please login to like a comment')
    }

    const commentIndex = comments.findIndex(
      (comment) => comment._id === commentId
    )
    const hasLiked = comments[commentIndex].likes.includes(userData._id)

    if (hasLiked) {
      return alert('You already liked this comment')
    }

    const updatedComments = comments.map((comment) =>
      comment._id === commentId
        ? { ...comment, likes: [...comment.likes, userData._id] }
        : comment
    )
    setComments(updatedComments)

    try {
      await axiosInstance.post(`${serverURL}/api/likeComment`, { commentId })
    } catch (e) {
      console.error(e)
      alert('Error liking comment')
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: comment.likes.filter((id) => id !== userData._id)
              }
            : comment
        )
      )
    }
  }

  const flagComment = async (commentId) => {
    if (!isLoggedIn) {
      return alert('Please login to flag a comment')
    }

    const commentIndex = comments.findIndex(
      (comment) => comment._id === commentId
    )

    const hasFlagged = comments[commentIndex].flags.includes(userData._id)

    if (hasFlagged) {
      return alert('You already flagged this comment')
    }

    const updatedComments = comments.map((comment) =>
      comment._id === commentId
        ? { ...comment, flags: [...comment.flags, userData._id] }
        : comment
    )
    setComments(updatedComments)

    try {
      await axiosInstance.post(`${serverURL}/api/flagComment`, { commentId })
    } catch (e) {
      console.error(e)
      if (e.response.data.message === 'Cannot flag your own comment') {
        alert('Cannot flag your own comment')
      } else {
        alert('Error flagging comment')
      }
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                flags: comment.flags.filter((id) => id !== userData._id)
              }
            : comment
        )
      )
    }
  }

  return (
    <div className="my-5 flex w-full flex-col items-center space-y-5 border-y border-black py-4 font-jost sm:block">
      <h1 className="font-playfair text-xl font-semibold">Reviews</h1>
      {comments.length !== 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex-col items-center gap-2 sm:flex-row"
            >
              <p className="mb-2 w-fit border-b border-black">
                {comment.postedBy}
              </p>
              <p className="text-gray-600">{comment.text}</p>
              <div className="flex gap-2">
                <div className="mt-4 flex w-fit gap-2 rounded-md border border-black px-2 py-1">
                  <button
                    className="flex w-fit gap-2 rounded-md px-2 py-1"
                    onClick={() => likeComment(comment._id)}
                  >
                    <ThumbsUp />
                    <p>{comment?.likes?.length}</p>
                  </button>
                </div>
                <div className="mt-4 flex w-fit gap-2 rounded-md border border-black px-2 py-1">
                  <button
                    className="flex w-fit gap-2 rounded-md px-2 py-1"
                    onClick={() => flagComment(comment._id)}
                  >
                    <Flag />
                    <p>{comment?.flags?.length}</p>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No reviews yet</p>
        </div>
      )}
    </div>
  )
}

export default ReviewsComponent

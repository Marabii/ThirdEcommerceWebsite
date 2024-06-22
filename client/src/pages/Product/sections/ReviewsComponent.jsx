import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import axiosInstance from '../../../utils/verifyJWT'
import { ThumbsUp, Flag } from 'lucide-react'
import { globalContext } from '../../../App'

const ReviewsComponent = (props) => {
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER
  const [comments, setComments] = useState([])
  const [usernames, setUsernames] = useState([])
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
  }, [productDetails])

  useEffect(() => {
    const getUsernames = async () => {
      try {
        const userNamesPromises = comments.map((comment) => {
          return axios.get(`${serverURL}/api/getUsername/${comment.postedBy}`)
        })

        const data = await Promise.all(userNamesPromises)

        setUsernames(
          data.map((item) => {
            return item.data[0].username
          })
        )
      } catch (e) {
        console.error(e)
        alert('Error loading User Names')
      }
    }
    getUsernames()
  }, [comments])

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

    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === commentId) {
          return { ...comment, likes: [...comment.likes, userData._id] }
        }
        return comment
      })
    })

    try {
      await axiosInstance.post(`${serverURL}/api/likeComment`, {
        commentId
      })
    } catch (e) {
      console.error(e)
      alert('Error liking comment')

      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: comment.likes.filter((id) => id !== userData._id)
            }
          }
          return comment
        })
      })
    }
  }

  return (
    <div className="my-5 flex w-full flex-col items-center space-y-5 border-y border-black py-4 font-jost sm:block">
      <h1 className="font-playfair text-xl font-semibold">Reviews</h1>
      {comments.length !== 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => {
            return (
              <div
                key={comment._id}
                className="flex-col items-center gap-2 sm:flex-row"
              >
                <p className="mb-1 mb-2 w-fit border-b border-black">
                  {usernames[index]}
                </p>
                <p className="text-gray-600">{comment.text}</p>
                <div>
                  <div className="mt-4 flex w-fit gap-2 rounded-md border border-black px-2 py-1">
                    <button onClick={() => likeComment(comment._id)}>
                      <ThumbsUp />
                    </button>
                    <p>{comment.likes.length}</p>
                  </div>
                  <div></div>
                </div>
              </div>
            )
          })}
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

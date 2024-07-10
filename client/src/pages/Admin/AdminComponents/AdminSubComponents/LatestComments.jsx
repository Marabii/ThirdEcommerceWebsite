import { useState, useEffect } from 'react'
import axios from 'axios'
import { ThumbsUp, Trash } from 'lucide-react'
import axiosInstance from '../../../../utils/verifyJWT'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LatestComments = () => {
  const [comments, setComments] = useState([])
  const [refreshComments, setRefreshComments] = useState(0)
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/getLatestComments`)
        setComments(response.data)
      } catch (e) {
        console.error(e)
      }
    }
    getComments()
  }, [refreshComments])

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

  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`${serverURL}/api/deleteComment/${commentId}`)
      toast.success('Comment deleted successfully')
      setRefreshComments(refreshComments + 1)
    } catch (e) {
      console.error(e)
      alert('Error deleting comment')
    }
  }

  if (comments.length === 0) {
    return <p>No comments found</p>
  }

  return (
    <div className="h-[400px] w-[500px] overflow-y-scroll rounded-xl bg-white p-5 shadow-lg">
      <h2 className="mb-5 text-2xl font-bold">Latest Reviews</h2>
      <div className="my-5 flex w-full flex-col items-center space-y-5 border-y border-black py-4 font-jost sm:block">
        {comments.length !== 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => {
              return (
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
                      <button onClick={() => likeComment(comment._id)}>
                        <ThumbsUp />
                      </button>
                      <p>{comment?.likes?.length}</p>
                    </div>
                    <div className="mt-4 flex w-fit gap-2 rounded-md border border-black px-2 py-1">
                      <button onClick={() => deleteComment(comment._id)}>
                        <Trash />
                      </button>
                      <p>{comment?.flags?.length}</p>
                    </div>
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
    </div>
  )
}

export default LatestComments

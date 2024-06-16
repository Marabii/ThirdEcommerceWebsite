const express = require("express");
const router = express.Router();
const passport = require("passport");
const connectionComment = require("../models/comments");
const Comment = connectionComment.models.Comment;

router.post(
  "/api/postComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("Request body:", req.body);
    const { comment, productId, postedBy } = req.body;
    // console.log(comment, productId, postedBy);
    if (!comment || !productId || !postedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newComment = new Comment({
      text: comment,
      productId: productId,
      postedBy: postedBy,
    });

    newComment
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Comment created successfully",
          comment: result,
        });
      })
      .catch((err) => {
        console.error("Error saving comment:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
);

router.delete(
  "/api/deleteComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId } = req.body;
    if (!commentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await comment.remove();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/replyToComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId, reply } = req.body;

    if (!commentId || !reply) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const newReply = {
        text: reply,
        postedBy: req.user._id,
        createdAt: Date.now(),
      };

      comment.replies.push(newReply);
      await comment.save();
      res.status(200).json({ message: "Reply added successfully" });
    } catch (err) {
      console.error("Error adding reply:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/likeComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId } = req.body;
    if (!commentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.likes.includes(req.user._id)) {
        return res.status(400).json({ message: "Already liked" });
      }
      comment.likes.push(req.user._id);
      await comment.save();
      res.status(200).json({ message: "Comment liked successfully" });
    } catch (err) {
      console.error("Error liking comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/api/updateComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId, text } = req.body;
    if (!commentId || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      comment.text = text;
      comment.updatedAt = Date.now();

      await comment.save();
      res.status(200).json({ message: "Comment updated successfully" });
    } catch (err) {
      console.error("Error updating comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/flagComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId } = req.body;
    if (!commentId)
      return res.status(400).json({ message: "Missing required fields" });
    try {
      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      if (comment.flags.includes(req.user._id))
        return res.status(400).json({ message: "Already flagged" });

      if (comment.postedBy.toString() === req.user._id.toString())
        return res
          .status(400)
          .json({ message: "Cannot flag your own comment" });

      comment.flags.push(req.user._id);
      await comment.save();
      res.status(200).json({ message: "Comment flagged successfully" });
    } catch (err) {
      console.error("Error flagging comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/removeFlagComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { commentId } = req.body;
    if (!commentId)
      return res.status(400).json({ message: "Missing required fields" });
    try {
      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      if (!comment.flags.includes(req.user._id))
        return res.status(400).json({ message: "Not flagged" });

      if (comment.postedBy.toString() === req.user._id.toString())
        return res
          .status(400)
          .json({ message: "Cannot unflag your own comment" });

      comment.flags = comment.flags.filter(
        (flag) => flag.toString() !== req.user._id.toString()
      );
      await comment.save();
      res.status(200).json({ message: "Comment unflagged successfully" });
    } catch (err) {
      console.error("Error unflagging comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/api/getComments/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const comments = await Comment.find({ productId: id }).sort({
      createdAt: -1,
    });
    if (!comments) {
      console.log("No comments found for ID:", id);
      return res.status(404).json({ message: "Comments not found" });
    }
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

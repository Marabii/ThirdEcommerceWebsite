const express = require("express");
const router = express.Router();
const { uploadToFirebaseStorage } = require("../lib/googleStorage");

router.post("/upload/:dest", (req, res) => {
  const dest = req.params.dest;
  uploadToFirebaseStorage(req, res, dest);
});

module.exports = router;

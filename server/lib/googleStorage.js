const { Storage } = require("@google-cloud/storage");
const busboy = require("busboy");
const base64 = require('base-64');

const bucketName = process.env.BUCKET_NAME;
const credentialsJSON = JSON.parse(base64.decode(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64));

// Initialize the Google Cloud Storage with decoded credentials
const storage = new Storage({
  credentials: credentialsJSON,
});
const uploadToFirebaseStorage = (req, res, dest) => {
  const bb = busboy({ headers: req.headers });
  const bucket = storage.bucket(bucketName);

  let uploadResults = [];
  let uploadErrors = [];

  // Handling file upload stream
  bb.on("file", (fieldname, file, fileInfo) => {
    const { filename, encoding, mimeType } = fileInfo;
    console.log(`Uploading: ${filename}`);

    const storagePath = `assets/${dest}/${filename}`;
    const gcsFile = bucket.file(storagePath);

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: mimeType,
      },
      public: true,
    });

    file.pipe(stream);

    stream.on("finish", async () => {
      try {
        // Make the file public (optional)
        await gcsFile.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${storagePath}`;
        uploadResults.push(publicUrl);
        console.log(`Uploaded: ${filename} to ${publicUrl}`);
      } catch (error) {
        console.error("Error making file public:", error);
        uploadErrors.push(`Error uploading ${filename}: ${error.message}`);
      }
    });

    stream.on("error", (error) => {
      console.error("Error uploading to GCS:", error);
      uploadErrors.push(`Error uploading ${filename}: ${error.message}`);
    });
  });

  bb.on("finish", () => {
    console.log("Upload complete.");
    if (uploadErrors.length > 0) {
      res.status(500).json({ errors: uploadErrors });
    } else {
      res.status(200).json({ urls: uploadResults });
    }
  });

  req.pipe(bb);
};

module.exports = { uploadToFirebaseStorage };

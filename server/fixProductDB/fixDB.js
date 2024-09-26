const fs = require("fs");
const path = require("path");

// Path to the JSON file
const productsFilePath = path.join(
  __dirname,
  "ThirdEcommerceWebsite.products.json"
);

// Directory containing additional images
const additionalImagesDir = path.join(__dirname, "../assets/additionalImages");

// Read and parse the JSON file
let productsData = fs.readFileSync(productsFilePath, "utf8");
let products = JSON.parse(productsData);

// Get all filenames in the additionalImages directory
const allAdditionalImages = fs.readdirSync(additionalImagesDir);

// Loop through each product in the JSON array
products.forEach((product) => {
  const oid = product._id.$oid;

  // Add the 'productThumbnail' field
  product.productThumbnail = `https://storage.googleapis.com/taha_saad/assets/products/${oid}.png`;

  // Find all image files that start with the same '$oid'
  const matchingImages = allAdditionalImages.filter((filename) =>
    filename.startsWith(oid)
  );

  // Construct URLs for the additional images
  product.additionalImages = matchingImages.map((filename) => {
    return `https://storage.googleapis.com/taha_saad/assets/additionalImages/${filename}`;
  });
});

// Write the updated products back to a new JSON file
const outputFilePath = path.join(
  __dirname,
  "ThirdEcommerceWebsite.products.updated.json"
);
fs.writeFileSync(outputFilePath, JSON.stringify(products, null, 2), "utf8");

console.log("Updated products have been saved to", outputFilePath);

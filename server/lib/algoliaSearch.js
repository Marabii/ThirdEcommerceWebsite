const connection = require("../models/products");
const Product = connection.models.Product;
const algoliaSearch = require("algoliasearch");
const APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID;
const API_KEY = process.env.ALGOLIA_WRITE_API_KEY;
const client = algoliaSearch(APPLICATION_ID, API_KEY);
const index = client.initIndex("farnic_products");

const watchProductCollection = async () => {
  try {
    const changeStream = Product.watch();

    changeStream.on("change", async (next) => {
      console.log("Received a change to the collection:", next);
      try {
        if (next.operationType === "insert") {
          const document = next.fullDocument;
          console.log("New document inserted:", document);
          await index.saveObject({ ...document, objectID: document._id });
        } else if (next.operationType === "update") {
          console.log("Document updated with changes:", next.updateDescription);
          const updatedFields = {
            objectID: next.documentKey._id,
            ...next.updateDescription.updatedFields,
          };
          await index.partialUpdateObject(updatedFields);
        } else if (next.operationType === "delete") {
          console.log("Document deleted:", next.documentKey);
          await index.deleteObject(next.documentKey._id);
        }
      } catch (algoliaError) {
        console.error("Algolia Sync Error:", algoliaError);
      }
    });
  } catch (error) {
    console.error("MongoDB Change Stream Error:", error);
  }
};

const searchProductsWithAlgolia = async (search) => {
  try {
    const found = await index.search(search);
    return found;
  } catch (e) {
    console.error("Algolia Search Error:", e);
  }
};

module.exports = { searchProductsWithAlgolia, watchProductCollection };

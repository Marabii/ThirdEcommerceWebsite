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
      try {
        if (next.operationType === "insert") {
          const document = next.fullDocument;
          await index.saveObject({ ...document, objectID: document._id });
        } else if (next.operationType === "update") {
          const updatedFields = {
            objectID: next.documentKey._id,
            ...next.updateDescription.updatedFields,
          };
          await index.partialUpdateObject(updatedFields);
        } else if (next.operationType === "delete") {
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

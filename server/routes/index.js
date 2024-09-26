const router = require("express").Router();

//--Routes--:

// const fetchApis = require("./fetch_apis");
const users = require("./users");
const stripeApi = require("./stripe_api.cjs");
const admin = require("./admin");
const handleComments = require("./handleComments");
const orders = require("./orders");
const products = require("./products");
const cart = require("./cart");
const googleStorage = require("./googleStorage");

// router.use(fetchApis);
router.use(users);
router.use(stripeApi);
router.use(admin);
router.use(handleComments);
router.use(orders);
router.use(products);
router.use(cart);
router.use(googleStorage);

module.exports = router;

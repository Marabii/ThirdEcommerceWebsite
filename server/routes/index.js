const router = require("express").Router();

//--Routes--:

const users = require("./users");
const fetchApis = require("./fetch_apis");
const stripeApi = require("./stripe_api.cjs");
const admin = require("./admin");
const handleComments = require("./handleComments");

router.use(users);
router.use(fetchApis);
router.use(stripeApi);
router.use(admin);
router.use(handleComments);

module.exports = router;

const router = require("express").Router();

//--Routes--:

const users = require("./users");
const fetchApis = require("./fetch_apis");
const stripeApi = require("./stripe_api.cjs");
const admin = require("./admin");

router.use(users);
router.use(fetchApis);
router.use(stripeApi);
router.use(admin);

module.exports = router;

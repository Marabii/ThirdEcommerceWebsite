const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Your are not authorized");
  }
};

module.exports = isAdmin;

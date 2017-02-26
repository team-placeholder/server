module.exports = {

  isAuthenticated: (req, res, next) => {
    return (req, res, next) => {
        if (req.user) {
          next();
        } else {
          res.status(401).json("You are unauthorized");
        }
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role == role) {
        next();
      } else {
        res.status(403).send();
      }
    };
  }
};

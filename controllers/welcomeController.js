const path = require("path");

exports.welcome = (req, res) => {
  res.sendFile(path.join(__dirname, "/welcome.html"));
};

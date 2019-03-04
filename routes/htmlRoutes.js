const db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/articles", function(req, res) {
      db.Article.find({})
      .limit(15)
      .then(function(dbArticle) {
          res.render("partials/articles", {dbArticle});
      })
      .catch(function(err) {
          console.log(err);
      })
  })

  app.get("/saved", function(req, res) {
      db.Article.find({ saved: true })
      .then(function(dbArticle) {
          res.render("partials/saved", {dbArticle});
      })
      .catch(function(err) {
          console.log(err);
      })
  })
}
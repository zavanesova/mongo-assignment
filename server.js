var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models")

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
app.set("view engine", "handlebars");
require("./routes/htmlRoutes")(app);


// mongoose.connect("mongodb://localhost/unit19Populater", { useNewUrlParser: true});
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://www.denverpost.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("div.article-info").each(function(i, element) {
            var result = {};
            result.title = $(this).find("a").attr("title");
            result.link = $(this).find("a").attr("href");
            result.summary = $(this).find("div.excerpt").text();
            console.log(result);

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle)
            })
            .catch(function(err) {
                console.log(err)
            });
        });
        db.Article.find({})
         .limit(15)
         .then(function(dbArticle) {
          res.render("partials/articles", {dbArticle});
        })
          .catch(function(err) {
          console.log(err);
        })
    });
});

app.get ("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});
app.get ("/api/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(err) {
        res.json(err);
    })
});

app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set:{
            saved: true
        }
    })
    .then(function(result) {
        res.json(result);
    });

})

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });  
});

app.get ("/saved", function(req, res) {
    db.Article.find({ saved: true })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});
// app.get ("/saved/:id", function(req, res) {
//     db.Article.findOne({ _id: req.params.id })
//     .then(function(dbArticle) {
//         res.json(dbArticle);
//     })
//     .catch(function(err) {
//         res.json(err);
//     });
// });




app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
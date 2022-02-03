//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  ///////////////////////// Requests Targetting All Articles //////////////////////

  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res) {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully add a article.")
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("successfully delete all articles");
      } else {
        res.send(err);
      }
    })
  })

///////////////////////// Requests Targetting A Specified Articles //////////////////////
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    const title = req.params.articleTitle;
    Article.findOne({
      title: title
    }, function(err, article) {
      if (err) {
        res.send(err);
      } else {
        if (article) {
          res.send(article);
        } else {
          res.send("No articles matching that title was found.")
        }
      }
    });
  })

  .put(function(req,res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title:req.body.title, content:req.body.content},
      // {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully Replace the article.");
        }else{
          res.send(err);
        }
      }
    );
  })

  .patch(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      // {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully update.");
        }else{
          res.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Article deleted.");
        }else{
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

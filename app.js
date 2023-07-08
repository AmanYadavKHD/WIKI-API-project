
const express= require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose = require("mongoose");

const app= express();

app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB",{useNewUrlParser:true});

const articleSchema =new mongoose.Schema({
    title:{type:String},
    content:{type:String}
});


const Article = new mongoose.model('Article',articleSchema);

app.route("/articles")
     .get(function(req,res){
    Article.find().then(function(foundArticles){
        res.send(foundArticles);
          });
      })
     .post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save();
      })
     .delete(function(req,res){
    Article.deleteMany().then(function(err){
        res.send("Succesfuly deleted all the articles.");
          });
      });

  /////////////////////////REQUEST TARGETTING A SPECIFIC CODE //////////////////////////////    

app.route("/articles/:articleTitle")
     .get(function(req,res){
        
     Article.findOne({title:req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No such article was found!");
        }
     });
     })
     .put(function(req,res){
        Article.replaceOne({title:req.params.articleTitle},
            {title:req.body.title,content:req.body.content},{overwrite:true}).then(function(err){
                
                    res.send("Succesfuly updated article.")
            
            });
     })
     .patch(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {$set:req.body},
        ).then(function(){
            res.send("Succesfuly updated.")
        });
     })
     .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle},{overwrite:true}).then(function(){
            res.send("Succesfuly Deleted!")
        });
     });

app.listen(3000,()=>{console.log("Server is running on port 3000.")});



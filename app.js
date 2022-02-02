//jshint esversion 6 

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { listen } = require("express/lib/application");
const { Router } = require("express");
// const date = require(__dirname+"/date.js");
const app = express();

const items = ["do code","do some more code","eat food"];
const workItems = [];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

app.get("/",function(req,res){
//    const day = date.getdate();

    itemModel.find({},function(err,foundItems){
        // console.log(foundItems);
        if(foundItems.length ===0)
        {
            itemModel.insertMany(defaultItems,function(err){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("New Items added");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",newListItems:foundItems});
        }
        
    });
   
   
});

const itemSchema = {
    name:String
};

const itemModel = new mongoose.model("itemcollection",itemSchema);

const item1 = new itemModel({
    name:"Welcome to ToDo list"
});

const item2 = new itemModel({
    name:"Welcome to ToDo list"
});

const item3 = new itemModel({
    name:"Welcome to ToDo list"
});

const defaultItems=[item1,item2,item3];

const listSchema = {
    name:String,
    items:[itemSchema]
};

const ListModel = new mongoose.model("listcollection",listSchema);


// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"work list",newListItems:workItems});

// });



app.get("/about",function(req,res){
    res.render("about");
});


app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;

    ListModel.findOne({name:customListName},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                //Create an new list
                const list = new ListModel({
                    name:customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                //Show an existing list
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
            }
        }
    });
    



});



app.post("/work",function(req,res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.post("/delete",function(req,res){
    const checkedItemId= req.body.checkbox;

    itemModel.findByIdAndRemove(checkedItemId,function(err){
        if(!err)
        {
            console.log("Successfully Deleted Checked Item");
            res.redirect("/");
        }
    
    })
});

app.post("/",function(req,res){
    const itemName =req.body.newItem;
    const item = new itemModel({
        name:itemName
    });

    item.save();
    res.redirect("/");
});


app.listen(3000,function(){
    console.log("Server started at port 3000");
});
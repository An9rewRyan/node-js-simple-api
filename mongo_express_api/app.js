const express = require("express");
const app = express();
const api_router = express.Router();

const express_hbs = require("express-handlebars");
const hbs = require("hbs");

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017/usersdb";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheme = new Schema(
    {
        name: String,
        age: Number
    }, {versionKey: false});
const User = mongoose.model("User", userScheme)

const urlencodedParser = express.urlencoded({extended: false});
app.use(urlencodedParser);

app.engine("hbs", express_hbs(
    {
        layoutsDir: "templates/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

app.set("view engine", "hbs");
app.set("views", "templates")
hbs.registerPartials(__dirname + "/templates/partials"); 
app.use(express.static(__dirname + "/static"));

let db_client;

mongoose.connect(url, {auth:{username: "admin", password: "1234"}}, function(err){
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

api_router.post("/search", function(req, res){
    let user_name = req.body.user_name;
    let user_age = req.body.user_age;
    let output;

    if (user_name && user_age){
        output = User.find({name:user_name, age:user_age}, (err, users)=>{
            if (err){
                return res
                    .status(404)
                    .send({message:"User not found!"})
            }
            else{
                return res
                    .status(200)
                    .send(users)
            }
        })
    }

    if (user_name && !user_age){
        output = User.find({name:user_name}, (err, users)=>{
            if (err){
                return res
                    .status(404)
                    .send({message:"User not found!"})
            }
            else{
                return res
                    .status(200)
                    .send(users)
            }
        })
    }

});

api_router.get('/', (req, res)=>{   
    users = User.find({}, (err, users)=>{
        if (err){
            console.log(err)
        }
        res.send(users)
    });
});

api_router
    .get('/:id/', (req, res) => {
        if(req.params.id){
            let id = req.params.id; 
            User.findById(id, (err, user)=>{
                if(!user){
                    console.log(err)
                    return res
                        .status(404)
                        .send({message: 'User not found.'})
                }
                else{
                    return res
                        .status(200)
                        .send(user)
                }
            });  
        }else{ 
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    });

api_router
    .delete('/:id/delete', (req, res) => {
        if(req.params.id) {
            let id = req.params.id;
            User.deleteOne({_id: id}, (err, user)=>{

                if(err){
                    console.log(err);    
                    return res
                        .status(404)
                        .send({message: 'User not found.'})
                } 
                else{
                    return res
                        .status(404)
                        .send(user)
                }
            });

        } else{
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    })

api_router
    .put('/:id/put', (req, res) => {
        if(req.params.id){
            if(req.query){

                let id = req.params.id;
                let user_name = req.query.name;
                let user_age = req.query.age;
                
                User.findByIdAndUpdate(
                    id,
                    {name: user_name, age: user_age},
                    {new: true},
                    (err, result)=>{
                        if (err){
                            console.log(err)
                        }
                        else{
                        return res
                            .status(200)
                            .send(result)
                        }
                    });
                }
            }
        if (!req.params || !req.query){
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    })

api_router
    .post('/post', (req, res) => {
        if(req.query){

            let user_name = req.query.name;
            let user_age = req.query.age;  

            User.create({name: user_name, age: user_age}, function(err, result){
          
                if(err){ 
                    console.log(err);
                    return res
                        .status(0)
                        .send({message: 'An exception occurred while processing the request.'})
                }
                return res
                    .status(200)
                    .send(result)
            });
        }
        else{
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    })

app.use("/api/users", api_router);

    
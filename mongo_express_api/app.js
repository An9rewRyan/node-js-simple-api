const express = require("express");
const app = express();
const api_router = express.Router();

const express_hbs = require("express-handlebars");
const hbs = require("hbs");

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
const url = "mongodb://architect:1234@localhost:27017/";
const mongo_client = new MongoClient(url);
 
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

mongo_client.connect(function(err, client){
    if(err) return console.log(err);
    db_client = client;
    app.locals.collection = client.db("usersdb").collection("users");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

api_router.post("/search", function(req, res){
    const collection = req.app.locals.collection;
    let user_name = req.body.user_name;
    let user_age = req.body.user_age;
    console.log(user_name)
    console.log(user_name && !user_age)
    user = null
    let output;

    if (user_name && user_age){
        output = collection.find({name:user_name, age:user_age})
    }

    if (user_name && !user_age){
        output = collection.find({name:user_name})
    }

    if (output){
        res.render('details', {'user':output})
        return res
            .status(200)
            .send(output)
    }
    else{
        return res.status(404).send(); 
    }
});

api_router.get('/', (req, res)=>{   
    console.log(req.app.locals.collection);
    const collection = req.app.locals.collection; 
    users = collection.find().toArray((err, results)=>{
        if (err){
            console.log(err)
        }
        res.send(results)
    });
});

api_router
    .get('/:id/', (req, res) => {
        if(req.params.id){
            const collection = req.app.locals.collection;
            let id = req.params.id; 
            collection.findOne((err, user)=>{
                if(err){
                    console.log(err)
                    return res
                        .status(404)
                        .send({message: 'User not found.'})
                }
                return res
                    .status(200)
                    .send(user)
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

            const collection = req.app.locals.collection;
            let id = new objectId(req.params.id);
            collection.findOneAndDelete({_id: id}, (err, user)=>{

                if(err){
                    console.log(err);    
                    return res
                        .status(404)
                        .send({message: 'User not found.'})
                } 

                return res
                    .status(404)
                    .send(user.value)
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

                const collection = req.app.locals.collection;
                let id = new objectId(req.params.id);
                let user_name = (req.query.name).toString()
                let user_age = (req.query.age).toString();
                
                collection.findOneAndUpdate(
                    {_id:id},
                    {$set: {name: user_name, age: user_age}},
                    (err, result)=>{
                        if (!err){
                            return res
                                .status(200)
                                .send(result.value)
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

            const collection = req.app.locals.collection;
            let user_name = req.query.name;
            let user_age = req.query.age;  
            let max_id = 0

            let user = {
                name: user_name,
                age: user_age
            }
            collection.insertOne(user, function(err, result){
          
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

    
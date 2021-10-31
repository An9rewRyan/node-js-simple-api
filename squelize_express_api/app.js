const Sequelize = require("sequelize");
const express = require("express");
const app = express();
const api_router = express.Router();

const express_hbs = require("express-handlebars");
const hbs = require("hbs");

const sequelize = new Sequelize("sqlize", "root", "Verywell2017", {
    dialect: "mysql",
    host: "localhost",
    port: "3306",
  });

const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

// Ниже код для синхронизации с бд
// sequelize.sync().then(result=>{
//     console.log(result);
//   })
//   .catch(err=> console.log(err));

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
  
api_router.post("/search", function(req, res){
    let user_name = req.body.user_name;
    let user_age = req.body.user_age;
    let output;

    if (user_name && user_age){
        output = User.findAll({where: {name:user_name, age:user_age}, raw: true })
            .then(users=>{
                if (users){
                    return res
                        .status(200)
                        .send(users)
                }
            })
            .catch(err=>{
                console.log(err)
                return res
                    .status(404)
                    .send({message:"User not found!"})
            })
        }

    if (user_name && !user_age){
        output = User.findAll({where: {name:user_name}, raw: true })
            .then(users=>{
                if (users){
                    return res
                        .status(200)
                        .send(users)
                }
            })
            .catch(err=>{
                console.log(err)
                return res
                    .status(404)
                    .send({message:"User not found!"})
            })  
        } 
              
});

api_router.get('/', (req, res)=>{   
    User.findAll({raw:true})
        .then(users=>{
            if (users){
                return res
                    .status(200)
                    .send(users)
            }
        })
        .catch(err=>console.log(err));
});

api_router
    .get('/:id/', (req, res) => {
        if(req.params.id){
            let id = req.params.id; 
            User.findByPk(id, {raw:true})
                .then(user=>{
                    if(user){
                        return res
                            .status(200)
                            .send(user)
                    }
                    else{
                        return res
                            .status(404)
                            .send({message:"User not found!"})
                    }
                })
        }
        else{ 
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    });

api_router
    .delete('/:id/delete', (req, res) => {
        if(req.params.id) {
            let id = parseInt(req.params.id, 10);
            User.destroy({where: {id: id}})
                .then(user=>{
                    if(user){
                        return res
                            .status(200)
                            .send(user)
                    }
                })
                .catch(err=>{
                    console.log(err)
                    return res
                        .status(404)
                        .send({message:"User not found!"})
                })
        }
        else{
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    });

api_router
    .put('/:id/put', (req, res) => {
        if(req.params.id){
            if(req.query){

                let id = req.params.id;
                let user_name = req.query.name;
                let user_age = req.query.age;
                
                User.update(
                    {name: user_name, age: user_age},
                    {where:{id: id}})
                        .then(result=>{
                            if (result!=0){
                            return res
                                .status(200)
                                .send(result)
                            }
                            else{
                                return res
                                    .status(404)
                                    .send({message:"User not found!"})
                            }

                        })
                }
            }
        if (!req.params || !req.query){
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    });

api_router
    .post('/post', (req, res) => {
        if(req.query){

            let user_name = req.query.name;
            let user_age = req.query.age;  

            User.create({name: user_name, age: user_age})

                .then(result=>{
                    return res
                        .status(200)
                        .send(result)
                })
                .catch(err=>{
                    console.log(err);
                    return res
                        .status(0)
                        .send({message: 'An exception occurred while processing the request.'})
                });
        }
        else{
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    });

app.use("/api/users", api_router);
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});


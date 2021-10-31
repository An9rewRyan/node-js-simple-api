const User = require("../models/user.js")

const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlize", "root", "Verywell2017", {
    dialect: "mysql",
    host: "localhost",
    port: "3306",
  });

exports.get_all = (req, res) =>{
    User.findAll({raw:true})
        .then(users=>{
            if (users){
                return res
                    .status(200)
                    .send(users)
            }
            else{
                console.log("Что-то не так")
            }
        })
        .catch(err=>console.log(err));
    }

exports.get_one = (req, res) =>{
        if(req.params.id){
            let id = req.params.id; 
            console.log(id)
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
    };

exports.delete = (req, res) => {
        if(req.params.id) {
            let id = parseInt(req.params.id, 10);
            User.destroy({where: {id: id}})
                .then(user=>{
                    if(user){
                        return res
                            .status(200)
                            .send('successfully deleted')
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
    };

exports.put = (req, res) => {
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
    };


exports.post = (req, res) => {
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
    };
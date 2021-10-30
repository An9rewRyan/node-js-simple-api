const express = require("express");
const expressHbs = require("express-handlebars");
const fs = require("fs");
const hbs = require("hbs");
const urlencodedParser = express.urlencoded({extended: false});

const app = express();
const api_router = express.Router();
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs(
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
app.use(urlencodedParser);
const filePath = "users.json";
const content = fs.readFileSync(filePath,"utf8");
let users = JSON.parse(content);

api_router.post("/search", function(req, res){
    let user_name = req.body.user_name;
    let user_age = req.body.user_age;
    console.log(user_name)
    console.log(user_name && !user_age)
    user = null

    if (user_name && user_age){
        for (let user of users){
            if (user.name === user_name && user.age === user_age){
                found_user = user
            }
        }
    }

    if (user_name && !user_age){
        for (let user of users){
            if (user.name === user_name){
                found_user = user
            }
        }
    }

    if (found_user){
        return res.render('details', {'user':found_user})
    }

    else{
        return res.status(404).send(); 
    }
});

api_router.get('/', (req, res)=>{    
    res.send(users)
});

api_router
    .get('/:id/', (req, res) => {
        if(req.params.id){
            let id = req.params.id; 
            let user = users.find(item=>item.id == id);
            if (user){
                user_json = [{
                    "id":id,
                    "name":user.name,
                    "age":user.age  
                }]
                return res
                    .status(200)
                    .send(user_json)
            } else {
                return res
                    .status(404)
                    .send({meassage: 'User not found.'})
            }
        }else{ 
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    })

api_router
    .delete('/:id/delete', (req, res) => {
        if(req.params.id) {

            let id = req.params.id; 
            user_index = String(users.findIndex(user => user.id ==id));
            console.log(user_index)

            if(user_index){
                user = users.splice(user_index, 1)[0];
                data = JSON.stringify(users);
                fs.unlinkSync(filePath)
                fs.writeFileSync(filePath, data);

                user_json = [{
                    "id":id,
                    "name":user.name,
                    "age":user.age  
                }]
                
                return res
                    .status(200)
                    .send(user_json)
            }

        } else{
            return res
                .status(400)
                .send({message: 'Bad request.'})
        }
    })

api_router
    .put('/:id/put', (req, res) => {
        if(req.params.id){

            if(req.body){

                if(req.query){
                    let id = req.params.id; 
                    let user_name = (req.query.name).toString()
                    let user_index = (users.findIndex(user => user.id ==id)).toString();
                    let age = (req.query.age).toString();
                    // let max_id = 0
                    
                    // for (let i = 0; i < users.length; i ++){
                    //     if (max_id < Number(users[i].id)){
                    //         max_id  = Number(users[i].id)
                    //     }
                    // }
                    users.splice(user_index, 1)[0];
                    // id = max_id.toString()
                    
                    let updated_user = {
                        "id": id.toString(),
                        "name":user_name,
                        "age":age
                    }
                    console.log(users, '--pre')
                    users.push(updated_user)
                    console.log(users, '--after')
                    data = JSON.stringify(users);
                    console.log(data, '--after--data')
                    fs.unlinkSync(filePath)
                    fs.writeFileSync(filePath, data);

                    return res
                        .status(200)
                        .send(updated_user)
                }
            }
        }
        return res
            .status(400)
            .send({message: 'Bad request.'})
    })

api_router
    .post('/post', (req, res) => {
        if(req.body){

            if(req.query){
                let user_name = (req.query.name);
                let age = (req.query.age);  
                let max_id = 0
                
                for (let i = 0; i < users.length; i ++){
                    if (max_id < Number(users[i].id)){
                        max_id  = Number(users[i].id)
                    }
                }

                id = (max_id+1).toString()
                
                let new_user = {
                    "id": id,
                    "name":user_name,
                    "age":age
                }
                users.push(new_user)
                data = JSON.stringify(users);
                fs.unlinkSync(filePath)
                fs.writeFileSync(filePath, data);

                return res
                    .status(200)
                    .send(new_user)
            }
        }
        return res
            .status(400)
            .send({message: 'Bad request.'})
    })

app.use("/api/users", api_router);

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});


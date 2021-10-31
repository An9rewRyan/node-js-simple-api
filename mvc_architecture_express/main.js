const express = require("express");
const app = express();
const api_router = require("./routes/api_router.js");
const home_router = require("./routes/home_router.js");
const hbs = require("hbs");

app.set("view engine", "hbs");
const express_hbs = require("express-handlebars");

app.engine("hbs", express_hbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials"); 
app.use(express.static(__dirname + "/static"));
 
app.use("/api/users/", api_router);;
app.use("/", home_router);
 

app.listen(3000, ()=>{
    console.log("Сервер запущен по адресу: http://localhost:3000/");
});


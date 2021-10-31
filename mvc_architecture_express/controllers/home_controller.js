const express_hbs = require("express-handlebars");
const hbs = require("hbs");

exports.home = (req, res) => {
    return res
        .status(200)
        .render('index')
}

exports.about = (req, res) => {
    return res
        .status(200)
        .render('about')
}

exports.contact = (req, res) => {
    return res
        .status(200)
        .render('contact')
}
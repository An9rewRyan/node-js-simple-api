const express = require("express");
const api_controller = require("../controllers/api_controller.js");
const api_router = express.Router();

api_router.get('/', api_controller.get_all);
api_router.get('/:id/get', api_controller.get_one);
api_router.post('/create', (req, res) => api_controller.post(req, res));
api_router.put('/:id/update', (req, res) => api_controller.put(req, res));
api_router.delete('/:id/delete', api_controller.delete);

module.exports = api_router;
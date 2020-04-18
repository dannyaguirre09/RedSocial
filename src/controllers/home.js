const controller = {};
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');

controller.index = async (req, res) => {
    const images = await Image.find().sort({ timestamp: -1 }); //Ascendente = 1; Descendente = -1
    let viewModel = {images: []};
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    console.log(viewModel);
    res.render('index', viewModel) //Pasando Parametros a la vista
};


module.exports = controller; 
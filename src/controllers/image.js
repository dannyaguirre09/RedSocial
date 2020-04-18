const image = {};
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const { Image, Comment } = require('../models/index')
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');

image.index = async (req, res) => {
    let viewModel = {image: {}, comments: {}};

    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
    if (image) {
        image.views = image.views + 1;
        viewModel.image = image;
        await image.save();
        const comment = await Comment.find({ image_id: image._id });
        viewModel.comments = comment;
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel); //Paso de parámetros
    } else {
        res.redirect('/');
    }
};


image.create = async (req, res) => {
    const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl }); //Buscar una imagen repetida

        if (images.length > 0) {
            saveImage();
        } else {
            const imagePath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase(); //Extensión de la imagen
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imagePath, targetPath);
                const newImage = new Image({ //Create object image
                    title: req.body.title,
                    filename: imgUrl + ext,
                    description: req.body.description
                });
                const imageSaved = await newImage.save();
                res.redirect('/images/' + imageSaved.uniqueId);
            } else {
                await fs.unlink(imagePath);
                res.status(500).json({ error: 'Only Images are allowed' });
            }
        }
    };

    saveImage();
};


image.like = async (req, res) => {
  const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
  if (image) {
      image.likes = image.likes + 1;
      image.save();
      res.json({likes: image.likes});
  } else {
      res.status(500).json({error: 'Internal Error'});      
  }
};


image.comment = async (req, res) => {
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } })

    if (image) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);
    } else {
        res.redirect('/');
    }
};


image.remove = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});

    if (image) {
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
        await Comment.deleteOne({image_id: image._id});
        await image.remove();
        res.json(true);
    } 
};

module.exports = image;
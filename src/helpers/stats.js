const { Comment, Image } = require('../models');


async function imageCounter() {
    return await Image.countDocuments();
}

async function commentsCounter() {
    return await Comment.countDocuments();
}

async function imageTotalViewsCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
    }]);
    let viewsTotal = 0;
    if (result.length > 0) {
        viewsTotal += result[0].viewsTotal;
    }
    return viewsTotal;
}

async function likesTotalCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' }
        }
    }]);

    let likesTotal = 0;
    if (result.length > 0) {
        likesTotal += result[0].likesTotal;
    }
    return likesTotal;
}

module.exports = async () => {
    const result = await Promise.all([
        imageCounter(),
        commentsCounter(),
        imageTotalViewsCounter(),
        likesTotalCounter()
    ]);          //Promise ejecuta todas las funciones en paralelo
    return {
        image: result[0],
        comments: result[1],
        views: result[2],
        likes: result[3]
    }
};
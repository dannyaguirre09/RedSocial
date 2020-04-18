const Stast = require('./stats');
const Images = require('./images');
const Comments = require('./comments');

module.exports = async viewModel => {

    const result = await Promise.all([
        Images.popular(),
        Stast(),
        Comments.newest()
    ]);

    viewModel.sidebar = {
        stast: result[1],
        popular: result[0],
        comments: result[2]
    };

    return viewModel;
}

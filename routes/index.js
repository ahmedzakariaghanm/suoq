module.exports = (app) => {
    require('./user')(app);
    require('./product')(app);

  };
  
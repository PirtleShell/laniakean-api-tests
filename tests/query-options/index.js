
module.exports = get => {
  describe('QUERY OPTIONS', function() {

    require('./defaults')(get);
    require('./limit')(get);
  });
};

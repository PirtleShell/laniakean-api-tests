
module.exports = get => {
  describe('DATA FIELDS', function() {
    require('./catalogs')(get);
    require('./commonNames')(get);
  });
};

module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'ember-basic-dropdown',
      key: process.env.PAGEFRONT_KEY
    }
  };
};

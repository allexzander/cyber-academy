const Promise = require('bluebird')

//firbase authentication
const serviceAccount = require('../key.json')

const firebase_admin = require('firebase-admin')

//module
let FirbaseUtils = {
}

FirbaseUtils.logUsers = function() {
  var query = firebase_admin.database().ref("users").orderByKey();
  return query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key; // "ada"
        console.log(`USER: ${key}`);
        console.dir(childSnapshot.val());
        console.log("");
    });
  });
}

module.exports = FirbaseUtils;

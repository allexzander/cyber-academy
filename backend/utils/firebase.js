const Promise = require('bluebird')

//firbase authentication
const serviceAccount = require('../key.json')

const firebase_admin = require('firebase-admin')

//module
let FirbaseUtils = {
}

FirbaseUtils.allUsersSteamIds = function() {
  var query = firebase_admin.database().ref("users").orderByKey();
  return query.once("value")
    .then(function(snapshot) {
      let steamIds = [];
      snapshot.forEach(function(childSnapshot) {
        steamIds.push(childSnapshot.key);
    });
    return steamIds;
  });
}

module.exports = FirbaseUtils;

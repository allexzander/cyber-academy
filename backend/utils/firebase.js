const Promise = require('bluebird')

//firbase authentication
const serviceAccount = require('../key.json')

const firebase_admin = require('firebase-admin')

//module
let FirbaseUtils = {
}

/*
   returns Array of user steamIds
*/
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

/*
   @steamId: user steamId to query from database as 'users/' + steamId
   returns Object(ket: steamId, value: user object)
*/
FirbaseUtils.getUserBySteamId = function(steamId) {
  var query = firebase_admin.database().ref('users/' + steamId);
  return query.once("value")
    .then(function(snapshot) {
      return {key: steamId, value: snapshot.val()};
  });
}

module.exports = FirbaseUtils;

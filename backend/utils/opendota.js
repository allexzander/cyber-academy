const axios = require('axios')
const Promise = require('bluebird')

var baseURL = "https://api.opendota.com/api/";

var countProperties = function(obj) {
  return Object.keys(obj).length;
}

//module
let OpenDotaUtils = {
}

//FUNCTIONS:
/*
  @playerDotaId: Number
  returns Number
*/
OpenDotaUtils.howManyMatchesForPlayerID = function(playerDotaId) {
  const endPoint = "matches";
  let requestURL = `${baseURL}players/${playerDotaId}/${endPoint}`;

  return axios.get(requestURL)
  .then(function (response) {
    let amount = response.data.length;
    return amount;
  })
  .catch(function (error) {
    console.log("OpenDotaUtils.howManyMatchesForPlayerID failed: " + error);
    return 0;
  });
}

/*
  @playerDotaId: Number
  @statNames: Array of strings
  returns array of Objects{statName : statValue}
*/
OpenDotaUtils.fetchStatsForPlayerID = function(playerDotaId, statNames, limit) {
  const endPoint = "matches";
  let requestURL = `${baseURL}players/${playerDotaId}/${endPoint}`;

  //concat parameters string
  let stringParameters = "?";
  //concat limit
  stringParameters += `limit=${limit}`;

  //concat other parameters
  for (let i = 0; i < statNames.length; ++i) {
    stringParameters += `&project=${statNames[i]}`;
  }

  //concat final URL
  requestURL += stringParameters;

  return axios.get(requestURL)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log("OpenDotaUtils.fetchStatsForPlayerID failed: " + error);
    return [];
  });
}
/*
*/
OpenDotaUtils.fetchWinLoseStatsForPlayerID = function(playerDotaId) {
  const endPoint = "wl";
  let requestURL = `${baseURL}players/${playerDotaId}/${endPoint}`;
  return axios.get(requestURL)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log("OpenDotaUtils.fetchStatsForPlayerID failed: " + error);
    return [];
  });
}

OpenDotaUtils.fetchMMRStatsForPlayerID = function(playerDotaId) {
  let requestURL = `${baseURL}players/${playerDotaId}`;

  return axios.get(requestURL)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log("OpenDotaUtils.fetchStatsForPlayerID failed: " + error);
    return [];
  });
}

module.exports = OpenDotaUtils;

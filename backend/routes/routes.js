const OpenDotaUtils = require('../utils/opendota.js');
const FirbaseUtils = require('../utils/firebase.js');
const Routes = require('express').Router();

Routes.get('/dropstatistics', (req, res) => {
    FirbaseUtils.allUsersSteamIds().then((steamIds) => {
        for (let i = 0; i < steamIds.length; ++i) {
          FirbaseUtils.addSingleChildToUser(steamIds[i], "openDotaStatistics", null);
        }
      }).then(() => {res.send("statistics dropped...")});
});

Routes.get('/fillstatistics', function (req, res) {
    let statNames = ["gold_per_min", "start_time", "hero_id", "xp_per_min", "last_hits", "tower_damage", "kills", "deaths", "assists", "denies", "kda"];
  
    //fetch user steamID for each user from database
    FirbaseUtils.allUsersSteamIds().then((steamIds) => {
      for (let i = 0; i < steamIds.length; ++i) {
      //get each user by for fetched steamId
       FirbaseUtils.getUserBySteamId(steamIds[i]).then((user) => {
         let userDotaId = user.value.dotaId;
         
         //win/lose
         OpenDotaUtils.fetchWinLoseStatsForPlayerID(userDotaId).then(function (result) {
          FirbaseUtils.addSingleChildToUser(user.key, "openDotaStatistics/win_rate", result);
        });
        
        //mmr
        OpenDotaUtils.fetchMMRStatsForPlayerID(userDotaId).then(function (result) {
          FirbaseUtils.addSingleChildToUser(user.key, "openDotaStatistics/mmr", result);
        });
  
         //fetch num matches from statistics
        OpenDotaUtils.howManyMatchesForPlayerID(userDotaId).then(function (amount) {
          return amount;
        }).then((numMatches) => {
          //fetch num records from firebase
          FirbaseUtils.howManyRecordsForUserSteamId(user.key, "openDotaStatistics/matches").then(function(numRecords) {
            return numRecords; }).then(function(numRecords) {
              //only fetch statistics, and update the firebase, if numMatches > numRecords
            if (numMatches > numRecords) {
              let limit = numMatches - numRecords;
              OpenDotaUtils.fetchStatsForPlayerID(userDotaId, statNames, limit).then(function (stats) {
                FirbaseUtils.addChildToUser(user.key, "openDotaStatistics/matches", stats);
              })
            }
          });
        });
      });
    }
    res.send("statistics fetched...");
  });
  })

module.exports = Routes;
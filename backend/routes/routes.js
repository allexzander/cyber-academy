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
    let statNames = ["hero_damage", "gold_per_min", "start_time", "hero_id", "xp_per_min", "last_hits", "tower_damage", "kills", "deaths", "assists", "denies", "kda"];
  
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

  Routes.get('/getdotastatistics', function (req, res) {
    console.log(req.query);
    if (req.query.steamID) {
      FirbaseUtils.getUserDotaStatisticsBySteamId(req.query.steamID).then((result) => 
      {
          let statistics = {};

          statistics.matches = [];

          console.dir(result.value.matches);
          for (let match in result.value.matches) {
              let matchObject = {
                  gpm: result.value.matches[match]["gold_per_min"],
                  xpm: result.value.matches[match]["xp_per_min"],
                  tower_damage: result.value.matches[match]["tower_damage"],
                  hero_damage: result.value.matches[match]["hero_damage"],
                  //kills: result.value.matches[match]["kills"],getdotastatistics?steamID=76561198404101751
                  //deaths: result.value.matches[match]["deaths"],
                 // assists: result.value.matches[match]["assists"],
                  denies: result.value.matches[match]["denies"],
                  kda: result.value.matches[match]["kda"],
                  last_hits: result.value.matches[match]["last_hits"],
                  start_time: result.value.matches[match]["start_time"],

                  //TODO: find a way to get win_lose history
                  win: result.value.win_rate["win"],
                  lose: result.value.win_rate["lose"],
                };

              statistics.matches.push(matchObject);
          }

          res.send(statistics);
      });
    }
    else {
      res.send("Missing parameter 'steamID'");
    }
})

module.exports = Routes;
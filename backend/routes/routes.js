const OpenDotaUtils = require('../utils/opendota.js');
const FirbaseUtils = require('../utils/firebase.js');
const Routes = require('express').Router();

let formatOpenDotaStatistics = function(openDotaStats) {
    let statistics = {matches : []};

    let matches = openDotaStats.matches;
    
    for (let match in matches) {
        let matchObject = {
            gpm: matches[match]["gold_per_min"],
            xpm: matches[match]["xp_per_min"],
            tower_damage: matches[match]["tower_damage"],
            hero_damage: matches[match]["hero_damage"],
            //kills: matches[match]["kills"],getdotastatistics?steamID=76561198404101751
            //deaths: matches[match]["deaths"],
            // assists: matches[match]["assists"],
            denies: matches[match]["denies"],
            kda: matches[match]["kda"],
            last_hits: matches[match]["last_hits"],
            start_time: matches[match]["start_time"],

            //TODO: find a way to get win_lose history
            win: openDotaStats.win_rate["win"],
            lose: openDotaStats.win_rate["lose"],
        };
        
        statistics.matches.push(matchObject);
    }
    
    return statistics;
}

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
    res.header("Access-Control-Allow-Origin", "*");
    if (req.query.steamID) {
      FirbaseUtils.getUserDotaStatisticsBySteamId(req.query.steamID).then((result) => 
      {
        res.send(formatOpenDotaStatistics(result.value));
      });
    }
    else {
      res.send("Missing parameter 'steamID'");
    }
})

module.exports = Routes;
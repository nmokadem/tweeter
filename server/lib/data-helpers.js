"use strict";
const fs = require("fs");
const path = require('path');
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      const filePath = path.join(__dirname, '../data-files/initial-tweets.json');
      db.tweets.push(newTweet);
      fs.writeFile(filePath, JSON.stringify(db.tweets, null, 2), (err) => {
        if (err) {
          console.log(err);
        }
      });

      simulateDelay(() => {
//        db.tweets.push(newTweet);
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      simulateDelay(() => {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, db.tweets.sort(sortNewestFirst));
      });
    }
  };
}

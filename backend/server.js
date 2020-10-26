"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { top50 } = require("./data/data");
const { restart } = require("nodemon");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .get("/top50", (req, res) => {
    res.status(200).json({
      status: 200,
      data: top50,
    });
  })

  .get("/top50/song/:rank", (req, res) => {
    const rank = req.params.rank;
    const rankNumber = Number(rank);
    const data = top50.find((song) => {
      return song.rank === rankNumber;
    });
    if (!data) {
      res.status(400).json({
        status: 400,
        message: "Song not found",
      });
    } else {
      res.status(200).json({
        status: 200,
        data,
      });
    }
  })

  .get("/top50/artist/:artistName", (req, res) => {
    const artistName = req.params.artistName;
    const data = top50.find(
      (song) => song.artist.toLowerCase() === artistName.toLowerCase()
    );
    if (data.length === 0) {
      res.status(400).json({
        status: 400,
        message: "Artist not found",
      });
    } else {
      res.status(200).json({
        stauts: 200,
        data,
      });
    }
  })

  .get("/top50/popular-artist", (req, res) => {
    const artistArr = top50.map((song) => song.artist);
    const data = artistArr
      .sort(
        (a, b) =>
          artistArr.filter((v) => v === a).length -
          artistArr.filter((v) => v === b).length
      )
      .pop();
    res.status(200).json({
      stauts: 200,
      data,
    });
  })

  .get("/top50/artist", (req, res) => {
    const artistArray = top50.map((song) => song.artist);
    const data = [];
    function artistSet(value, set) {
      data.push(value);
    }
    new Set(artistArray).forEach(artistSet);
    res.status(200).json({
      status: 200,
      data,
    });
  })

  //   var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
  // var uniqueNames = [];
  // $.each(names, function(i, el){
  //     if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  // });
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));

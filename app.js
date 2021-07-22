//import express js
const express = require("express");

//import sqlite and sqlite3
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

//importing path
const path = require("path");

//create path fro database
const dataPath = path.join(__dirname, "cricketTeam.db");

//creating instance
const app = express();

//use of json in script
app.use(express.json());

//initializing database
let database = null;

//initializing database and server
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => console.log("Server Running at localhost 3000"));
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};

initializeDbAndServer();

//return response in this format

const outputFormat = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//creating API 1
app.get("/players/", async (request, response) => {
  const getRequestQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const getResponse = await database.all(getRequestQuery);
  response.send(getResponse.map((eachPlayer) => outputFormat(eachPlayer)));
});

//creating API2
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postRequestQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const postResponse = await database.run(postRequestQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getRequestQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};`;
  const getResponse = await database.get(getRequestQuery);
  response.send(outputFormat(getResponse));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updateRequestQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updateRequestQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;

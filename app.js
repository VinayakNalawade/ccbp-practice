const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;

app.use(express.json());

let initializeServer = async () => {
  let dbpath = path.join(__dirname, "cricketTeam.db");

  db = await open({ filename: dbpath, driver: sqlite3.Database });

  app.listen(3000, () => console.log("server is running"));
};

initializeServer();

//conversion object
function conversion(obj) {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
}

//API 1
app.get("/players/", async (request, response) => {
  let query = `SELECT * FROM cricket_team`;

  let obj = await db.all(query);

  let converted = obj.map((eachItem) => conversion(eachItem));

  response.send(converted);
});

//API 2
app.post("/players/", async (request, response) => {
  let details = request.body;

  console.log(request);

  let { playerName, jerseyNumber, role } = details;

  let query = `INSERT INTO cricket_team 
    (player_name,jersey_number,role)
    VALUES 
    ("${playerName}",${jerseyNumber},"${role}") `;

  await db.run(query);

  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;
  let query = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;

  let obj = await db.get(query);

  response.send(conversion(obj));
});

//API 4
app.put("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;

  const obj = request.body;

  console.log(request);

  let { playerName, jerseyNumber, role } = obj;

  let query = `UPDATE cricket_team 
  SET player_name = '${playerName}',
  jersey_number = ${jerseyNumber},
  role = '${role}' ;`;

  await db.run(query);

  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;

  let query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;

  await db.run(query);

  console.log("Player Removed");
});

//module export
module.exports = app;

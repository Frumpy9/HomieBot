require("dotenv").config()
import { ExtendedClient } from "./structs/Client";
import { Spotify } from "./structs/Spotify";
import express from "express";


export const client = new ExtendedClient();
export const spotify = new Spotify();

client.start();
spotify.refreshToken();

const app = express()
const port = 8080

app.post('/spotify', (req, res) => {
  console.log(req.body);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
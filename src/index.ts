require("dotenv").config()
import { ExtendedClient } from "./structs/Client";
import { Spotify } from "./structs/Spotify";
import express from "express";


export const client = new ExtendedClient();
export const spotify = new Spotify();

client.start();
console.log(spotify.createAccessLink());

const app = express()
const port = 3000

app.get('/spotify', (req, res) => {
    const code = req.query.code as string;
    res.send(`<script> window.close()</script>`);

    spotify.authorizationCodeGrant(code).then(
        function (data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            // Set the access token on the API object to use it in later calls
            spotify.setAccessToken(data.body['access_token']);
            spotify.setRefreshToken(data.body['refresh_token']);
        },
        function (err) {
            console.log('Something went wrong!', err);
        }
    );
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
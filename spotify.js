var SpotifyWebApi = require('spotify-web-api-node');
const { spotifyID, spotifySecret } = require('./config.json');


const spotifyApi = new SpotifyWebApi({
    clientId: spotifyID,
    clientSecret: spotifySecret
});

module.exports.spotifyApi = spotifyApi;
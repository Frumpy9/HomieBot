var SpotifyWebApi = require('spotify-web-api-node');
const { spotifyID, spotifySecret } = require('./config.json');


const spotifyApi = new SpotifyWebApi({
    clientId: spotifyID,
    clientSecret: spotifySecret
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
  
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );


module.exports.spotifyApi = spotifyApi;
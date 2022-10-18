import SpotifyWebApi from 'spotify-web-api-node';

export class Spotify extends SpotifyWebApi {
    constructor() {
        super({
            clientId: process.env.spotifyID,
            clientSecret: process.env.spotifySecret,
            redirectUri: process.env.redirectURI
        });
    }

    createAccessLink() : string{
        var scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public'],
        state = 'some-state-of-my-choice';

        return this.createAuthorizeURL(scopes, state);
    }

    async refreshToken() {
        const token = await this.clientCredentialsGrant().then(
            function (data: { body: { [x: string]: any; }; }) {
                console.log('The access token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);

                // Save the access token so that it's used in future calls
                return data.body['access_token'];
            },
            function (err: any) {
                console.log('Something went wrong when retrieving an access token', err);
            }
        );

        if (!token) return 
        this.setAccessToken(token);
    }
}
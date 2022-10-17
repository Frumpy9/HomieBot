export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            clientId: string;
            guildId: string;
            forumID: string;
            spotifyID: string;
            spotifySecret: string;
        }
    }
}
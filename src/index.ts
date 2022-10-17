require("dotenv").config()
import { ExtendedClient } from "./structs/Client";
import { Spotify } from "./structs/Spotify";

export const client = new ExtendedClient();
export const spotify = new Spotify();

client.start();
spotify.refreshToken();
import type { CreatePlaylistInput } from "shared/schemas/playlist.schema";
import { myPlaylistSchema, playlistSchema } from "shared/schemas/playlist.schema";
import { z } from "zod";

export type PlaylistCredentials = {
    data: CreatePlaylistInput;
    image: File | null;
}

export type Playlist = z.infer<typeof playlistSchema>

export type MyPlaylist = z.infer<typeof myPlaylistSchema>

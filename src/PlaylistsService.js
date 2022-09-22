const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(id) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, 
      users.username FROM playlists LEFT JOIN users 
      ON playlists.owner = users.id WHERE playlists.id = $1`,
      values: [id],
    };
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };

    const resultPlaylist = await this._pool.query(playlistQuery);
    const resultSongs = await this._pool.query(songsQuery);

    if (!resultPlaylist.rowCount) {
      throw new Error('Playlist tidak ditemukan');
    }

    return {
      playlist: {
        id: resultPlaylist.rows[0].id,
        name: resultPlaylist.rows[0].name,
        username: resultPlaylist.rows[0].username,
        songs: resultSongs.rows,
      }
    };
  }
}

module.exports = PlaylistsService;
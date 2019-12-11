const https = require('https');

var movie = {
	token: null,

	// getGenreId makes a call to the API in order to
	// fetch the category ID used by the API
	getGenreId: (genre) => {
		return new Promise((resolve, reject) => {
			var options = {
				headers: {
					Authorization: 'Bearer ' + movie.token
				}
			}
			https.get('https://api.themoviedb.org/3/genre/movie/list', options, (res) => {

				res.on('data', (d) => {
					var genres = JSON.parse(d).genres
					for (var i = 0; i < genres.length; i ++) {
						if (genres[i].name == genre) {
							resolve(genres[i].id)
						}
					}
				});

			}).on('error', (e) => {
				// TODO: extract the error
				console.error(e)
				reject(e)
			}).end();
		});
	}
}

movie.token = process.env.MOVIEDB_TOKEN
movie.getGenreId('Action').then((id) => {
	console.log(id)
})

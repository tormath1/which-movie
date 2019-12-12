const request = require('request');

var movie = {
	token: null,

	// getGenreId makes a call to the API in order to
	// fetch the category ID used by the API
	getGenreId: (genre) => {
		return new Promise((resolve, reject) => {
			request.get('https://api.themoviedb.org/3/genre/movie/list', (err, res, body) => {
				if (err) { reject(err); }
				var genres = JSON.parse(body).genres;
				for (var i = 0; i < genres.length; i ++) {
					if (genres[i].name == genre) {
						resolve(genres[i].id);
					}
				}
			}).auth(null, null, true, movie.token);
		});
	},
	
	// getRandomPage returns a random page from the number of results
	getRandomPage: (genre) => {
		return new Promise((resolve, reject) => {
			movie.getGenreId(genre).then((id) => {
				request.get('https://api.themoviedb.org/3/discover/movie?with_genres=' + id, (err, res, body) => {
					if (err) { reject(err); }
					var movies = JSON.parse(body);
					var random_page = movie.getRandomInt(movies.total_pages);
					resolve({random_page, id});
				}).auth(null, null, true, movie.token);
			});
		});
	},

	// getRandomMovie returns a random movie from a random page
	// with a genre
	getRandomMovieId: (genre) => {
		return new Promise((resolve, reject) => {
			movie.getRandomPage(genre).then((res) => {
				request.get('https://api.themoviedb.org/3/discover/movie?with_genres=' + res.id + '&page=' + res.random_page, (err, res, body) => {
					if (err) { reject(err); }
					var movies = JSON.parse(body);
					var random_index = movie.getRandomInt(movies.results.length)
					resolve(movies.results[random_index - 1])
				}).auth(null, null, true, movie.token);
			});
		});
	},

	// getRandomInt retuns an integer
	// where i in [1; max]
	getRandomInt: (max) => {
		return Math.floor(Math.random() * max) + 1;
	}
}

movie.token = process.env.MOVIEDB_TOKEN
movie.getRandomMovieId('Comedy').then((movie) => {
	console.log(movie);
});

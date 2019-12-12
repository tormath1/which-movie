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
	},

	// getMovie returns a random movie from the api
	// with `genre` as filter
	getMovie: (genre) => {
		return new Promise((resolve, reject) => {
			var options = {
				headers: {
					Authorization: 'Bearer ' + movie.token
				}
			}
			movie.getGenreId(genre).then((id) => {
				https.get('https://api.themoviedb.org/3/discover/movie?with_genres=' + id, options, (res) => {
					var chuncks = [];
					res.on('data', (d) => {
						chuncks.push(d);
					}).on('end', () => {
						var data = Buffer.concat(chuncks);
						var movies = JSON.parse(data);
						var number_pages = movies.total_pages;
						var random_page = movie.getRandomPage(number_pages);
						resolve(random_page)
					});
				}).on('error', (e) => {
					// TODO: extract the error
					console.error(e)
					reject(e)
				}).end();
			});
				
		});
	},

	// getRandomPage returns a random index of page
	getRandomPage: (number_of_pages) => {
		// get an element in [1; number_of_pages]
		return Math.floor(Math.random() * number_of_pages) + 1
	},

	// getIndex returns the index of the page
	getIndex: (index, number_of_pages, page) => {
		return index - number_of_pages * page
	}
}

movie.token = process.env.MOVIEDB_TOKEN
movie.getMovie('Crime').then((movie) => {
	console.log(movie)
})

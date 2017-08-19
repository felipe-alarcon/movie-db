/*
Features to add:
  
  Add animations to some of the elements
  Add icons to some of the buttons
  Find a way to add imdb score in the search page
  random movie button
  add a watch later feature with comment feature saved into localstorage

  https://api.themoviedb.org/3/movie/550?api_key=9d680017ac8785fd1d4bb9862ebf6863
  For Tmdb --
  https://api.themoviedb.org/3/movie/tt0167260?api_key=9d680017ac8785fd1d4bb9862ebf6863
  With IMDB ID

*/

//formats a string like '106 min' to 1 Hour 46 Minutes
function displayHour(passedStr){

  passedStr = passedStr.replace(/\D/g,'');

  var a = parseInt(passedStr);

  var hours = Math.trunc(a/60);
  var minutes = a % 60;
	
	var h, m;
	
	if(hours > 1){
		h = "Hours";
	}else{
		h = "Hour";
	}
	
	if(minutes > 0){
		m = "minutes";
	}else{
		m = "";
	}
	
  return "("+hours +" "+h+" "+ minutes +" "+m+")";
}



$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

//limits the number of characters to display in the title
//this was created because text was pushing the div down making it larger
function limitChars(str, limit){
  if( str.length > limit ){
    return str.substring(0,limit) + "...";
  }else{
    return str;
  }
}

//Shows an image-not-found image when server return N/A
//Was created because when image was N/A the broken iage would be shown
function hasImg(source){
  if( source === 'N/A' ){
    return 'img/No-image-found.jpg';
  }else{
    return source;
  }
}

//this replaces empty spaces to a dash (-)
//created because then I can append it to trailers website and search for a 
//trailer although it does not seem to be that good, will look for alternatives
function format(str){
  return str.replace(/\s+/g, '-').toLowerCase();
}

function getMovies(searchText){
  axios.get('http://www.omdbapi.com/?s='+searchText+'&apikey=c4337100')
    .then((response) => {
      //console.log(response);
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        let title = limitChars(movie.Title, 20);
        let image = hasImg(movie.Poster);
        let score = getImdbScore(movie.imdbID);
        output += `
          <div class="col-md-3 animated tada">
            <div class="well text-center">
              <h5 class="label label-default">${movie.Type} <span class="label label-success">${score}</span></h5>
              <object data="${image}" type="image/png"></object>
              <div>
                <h5>${title}</h5>
                <h6>${movie.Year}</h6>
              </div>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary btn-block" href="#">Details</a>
            </div>
          </div>
        `;
      });

      // check if string is empty which means no movie has been returned
      if( !output ){
        output += `
          <div class="col-md-12">
            <div class="well text-center">
              <h1 class="label label-warning">No movie has been found, try another one please.</h1>
            </div>
          </div>
        `;
      }

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com/?i='+movieId+'&apikey=c4337100')
    .then((response) => {
      //console.log(response)
      let movie = response.data;
      let image = hasImg(movie.Poster);
      let title = format(movie.Title);
      let formattedRuntime = displayHour(movie.Runtime);
      let output =`
        <div class="row">
          <div class="col-md-4">
            <object class="thumbnail" data="${image}" type="image/png"></object>
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime} ${formattedRuntime}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating: </strong><span class="label label-success"> ${movie.imdbRating}</span></li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Production:</strong> ${movie.Production}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Website:</strong><a target="_blank" href="${movie.Website}"> ${movie.Website}</a></li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="https://www.traileraddict.com/search/${title}" target="_blank" class="btn btn-default">Watch Trailer</a>
            <button class="btn btn-primary" onclick="getImdbScore('${movie.imdbID}')">Get More Info</button>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getImdbScore(imdbID){
    axios.get('http://www.omdbapi.com/?i='+imdbID+'&apikey=c4337100')
    .then((response) => {
      console.log(response.data.imdbRating);
    })
    .catch((err) => {
      console.log(err);
    });
}

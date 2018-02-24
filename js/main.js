
/**
 * ONLOAD FUNCTION
 */
function createWatchLaterArray(){
  if(!localStorage.getItem('watchLater')){
    localStorage.setItem('watchLater', '[]');
  }
}
/**
 * END ONLOAD FUNCTION
 */



function getMovies(searchText){
  axios.get('https://www.omdbapi.com/?s='+searchText+'&apikey=c4337100')
    .then((response) => {
      
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        getMovieData(movie.imdbID, function(data){
            //The variable data holds more information about specific movie
            //which is determined by imdbID
            let title = limitChars(data.Title, 20);
            let image = hasImg(data.Poster, data.type);
            let scoreLabel = getScoreLabel(data.imdbRating);
            output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <div style="margin:5px;">
                    <span class="label label-default lb-md">${data.Type}</span>
                    <span class="label label-${scoreLabel} lb-md">${data.imdbRating}</span>
                  </div>
                  <object data="${image}" type="image/png"></object>
                  <div>
                    <h5>${title}</h5>
                    <h6>${data.Year}</h6>
                    <h6>${data.Director}</h6>
                  </div>
                  <a onclick="movieSelected('${data.imdbID}')" class="btn btn-primary btn-block" href="#">Details</a>
                  <button onclick="watchLater('${data.imdbID}')" class="btn btn-success btn-block">Watch Later</button>
                </div>
              </div>`;
            
            $('#movies').html(output);
            console.log(output)
          });
        });
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

  axios.get('https://www.omdbapi.com/?i='+movieId+'&apikey=c4337100')
    .then((response) => {
      //console.log(response)
      let movie = response.data;
      let image = hasImg(movie.Poster, movie.type);
      let title = format(movie.Title);
      let formattedRuntime = displayHour(movie.Runtime);
      let scoreLabel = getScoreLabel(movie.imdbRating);
      let output =`
        <div class="row">
          <div class="col-md-4">
            <object class="thumbnail" data="${image}" type="image/png"></object>
          </div>
          <div class="col-md-8">
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>BoxOffice:</strong> ${movie.BoxOffice}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime} ${formattedRuntime}</li>
              <li class="list-group-item"><strong>Awards:</strong> ${movie.Awards}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating: </strong><span class="label label-${scoreLabel} lb-md"> ${movie.imdbRating}</span></li>
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
            <h2>${movie.Title}</h2>
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="https://www.traileraddict.com/search/${title}" target="_blank" class="btn btn-default">Find Trailer</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getWatchLater(){
  //unpack localStorage and get all the movies
  //loop though all the id's and return the values
  if(localStorage.getItem('watchLater')){
    let imdbIDS = JSON.parse(localStorage.getItem('watchLater'));
    let output = '';
    $.each(imdbIDS, (index, movie) => {
          getMovieData(movie, function(data){
              //The variable data holds more information about specific movie
              //which is determined by imdbID
              
              let title = limitChars(data.Title, 20);
              let image = hasImg(data.Poster, data.type);
              let scoreLabel = getScoreLabel(data.imdbRating);
              output += `
                <div class="col-md-3">
                  <div class="well text-center">
                    <div style="margin:5px;">
                      <span class="label label-default lb-md">${data.Type}</span>
                      <span class="label label-${scoreLabel} lb-md">${data.imdbRating}</span>
                    </div>
                    <object data="${image}" type="image/png"></object>
                    <div>
                      <h5>${title}</h5>
                      <h6>${data.Year}</h6>
                      <h6>${data.Director}</h6>
                    </div>
                    <a onclick="movieSelected('${data.imdbID}')" class="btn btn-primary btn-block" href="#">Details</a>
                    <a onclick="deleteMovie('${data.imdbID}')" class="btn btn-danger btn-block" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
                  </div>
                </div>`;
              
              $('#watch').html(output);
      });
    }); 
  }else{
    output += "Nothing here...";
    
    $('#watch').html(output);
  }
}

function getRandom(){
  var number;
  do {
    number = Math.floor(Math.random() * 999);
  } while (number < 100);

  axios.get('https://www.omdbapi.com/?i='+'tt00'+number+'51&apikey=c4337100')
    .then((response) => {
      //console.log(response)
      let movie = response.data;
      let image = hasImg(movie.Poster, movie.type);
      let title = format(movie.Title);
      let formattedRuntime = displayHour(movie.Runtime);
      let scoreLabel = getScoreLabel(movie.imdbRating);
      let output =`
        <div class="row">
          <div class="col-md-4">
            <object data="${image}" type="image/png"></object>
          </div>
          <div class="col-md-8">
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>BoxOffice:</strong> ${movie.BoxOffice}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime} ${formattedRuntime}</li>
              <li class="list-group-item"><strong>Awards:</strong> ${movie.Awards}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating: </strong><span class="label label-${scoreLabel} lb-md"> ${movie.imdbRating}</span></li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Production:</strong> ${movie.Production}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Website:</strong><a target="_blank" href="${movie.Website}"> ${movie.Website}</a></li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="well">
              <h2>${movie.Title}</h2>
              <h3>Plot</h3>
              ${movie.Plot}
              <hr>
              <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
              <a href="https://www.traileraddict.com/search/${title}" target="_blank" class="btn btn-default">Find Trailer</a>
            </div>
          </div>
        </div>
      `;

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getMovieData(imdbID, fn){
    axios.get('https://www.omdbapi.com/?i='+imdbID+'&apikey=c4337100')
    .then((response) => {
      let movie = response.data;
      fn(movie);
    })
    .catch((err) => {
      console.log(err);
    });
}


function watchLater(imdbID){
    //if true unpack and push new item
    let watch = JSON.parse(localStorage.getItem('watchLater'));

    if($.inArray(imdbID, watch) === -1){ //checks if imdbID already exists
      watch.push(imdbID);
    }else{
      alert('you are trying to save a movie that is already saved!');
    }

    localStorage.setItem('watchLater', JSON.stringify(watch));
}

function deleteMovie(imdbID){
  let watch = JSON.parse(localStorage.getItem('watchLater'));

  let pos = watch.indexOf(imdbID);

  watch.splice(pos, 1);

  localStorage.setItem('watchLater', JSON.stringify(watch));

  window.location = 'watch.html';

  return false;
}






/******************************************************************
*******************************************************************
* Helper Functions
*/

//return a string depending on the IMDB Score
function getScoreLabel(score){
  if( score >= "7.0" ){
    return "success";
  }
  if( score < "7.0" && score >= "5.0" ){
    return "warning";
  }
  if( score < "5.0" ){
    return "danger";
  }
}

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


//handles click in the search box
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
//Was created because when image was N/A the broken image would be shown
function hasImg(source, type){
  if( source === 'N/A' || type === 'game'){ //game images are returning error from amazon
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
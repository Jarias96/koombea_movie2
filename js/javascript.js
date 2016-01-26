var apiBaseUrl = 'https://api.themoviedb.org/3/movie/';
var apiKeyString = '?api_key=300d2fb47e3f5f8d5e569ce27884acdc';
var movieTemplate = Handlebars.compile($("#movies-template").html());
var similarMoviesTemplate = Handlebars.compile($("#similar-movies-template").html());

function get_json_movie(){
  $.get(apiBaseUrl + "now_playing" + apiKeyString, function (data){
    for (var i = 0; i < data.results.length; i++) {
      var compiledHTML = movieTemplate(data.results[i]);
      $('#movie__movies').append(compiledHTML);
      if (i == 0) {
        get_information(data.results[i].id);
      };
    };
  });
};

$(document).on('click', '.template-movie__image', function(){
  get_information(this.id);
});

$(document).on('click', '.similar-movies__image', function (){
  get_information(this.id);
});

function get_information(id){
  $.get(apiBaseUrl + id + '/videos' + apiKeyString, function (data){ // Brings movie trailer
    $('#video-trailer').attr('src', 'https://www.youtube.com/embed/' + data.results[0].key);
  }); // End brings movie trailer

  $.get(apiBaseUrl + id + apiKeyString, function (data){ // Brings movie information
    $('body').css('background-image', 'url(http://image.tmdb.org/t/p/w300/' + data.backdrop_path + ')');
    $('h1.movie-information-details__title').html(data.original_title);
    $('p.movie-information-details__overview').html(data.overview);
  }); // End brings movie information

  $.get(apiBaseUrl + id + "/similar" + apiKeyString, function (data){ // Brings movies similar
    $("#similar-movies-container").html(""); 
    if (data.results.length > 3) {
      for (var i = 0; i < 3; i++) { 
        var compiledHTML = similarMoviesTemplate(data.results[i]);
        $('#similar-movies-container').append(compiledHTML);
      };
    } else if(data.results.length > 1) {
      for (var i = 0; i < data.results.length; i++) {
        var compiledHTML = similarMoviesTemplate(data.results[i]);
        $('#similar-movies-container').append(compiledHTML);
      };
    } else {
      $('#similar-movies-container').append('<p/>', 'No hay peliculas similares.').css('color', 'red');
    };
  }); // End brings movies similar
}

$(document).on('ready', function (){
  get_json_movie();
});


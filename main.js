function onLoad() {
    featuredMovies();
    filmsInReleases();
}

/**
 * Metodo para fazer a requisicao para API. Esse metodo recebe dois parametros 
 * @param {*} url e o endereco da requisicao que queremos  
*/
const request = async (url) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjdjOGFlMWYyMjIxMTYxMWEyYTQwYzg3MWQ5M2NiNyIsInN1YiI6IjYyYjBkYjI0OWMyNGZjMDA2MWIyODMyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EBb5x36iB5MtHgnJ8NRdC6Bgb8GJBN41MpYSMgdIshc'
        }
    };

    let response = (await fetch(url, options)).json();
    return response;
}

/**
 * Metodo para mostrar os filmes em destaque
 * @param {*} results sao os filmes em destaque 
*/
const featuredMovies = async () => {
    let featuredMoviesContainer = document.getElementById("featured-movies");
    let response = await request("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1");

    for(let i = 0; i < 4; i++) {;
        let movie = `
            <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                <img src="https://image.tmdb.org/t/p/original${response.results[i].poster_path}" alt="${response.results[i].title}" class="featured-images">
            </div>
        `;

        featuredMoviesContainer.innerHTML += movie;
    }
}

const filmsInReleases = async () => {
    let featuredMovieCarousel = document.getElementById("carousel");
    let answerMovies = await request("https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1");

    for(let i = 0; i < 3; i++) {
        let movie = document.createElement('article');
        let collaborators = await technicalDirection(answerMovies.results[i].id);

        movie.classList.add("carousel-movie");
        // if(i == 0) {
        //     movie.classList.add("active");
        // }

        movie.innerHTML += `
            <section class="row">
                <div class="col-12 col-lg-6">
                    <iframe src="https://www.youtube.com/embed/aWzlQ2N6qqg" title="${answerMovies.results[i].original_title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>

                <div class="col-12 col-lg-6">
                    <h2>${answerMovies.results[i].title}</h2>

                    <p class="text-justify my-1"><strong>Sinopse: </strong>${answerMovies.results[i].overview}</p>

                    <div class="d-flex align-items-center justify-content-between my-1">
                        <p>${collaborators.director}</p>
                        <p>${collaborators.screenplay}</p>
                        <p><strong>Estreia: </strong>${answerMovies.results[i].release_date}</p>
                    </div>

                    <p class="my-1"><strong>Elenco:</strong></p>

                    <div class="d-flex align-items-center justify-content-between cast">
                        <p>${collaborators.cast[0]}</p>
                        <p>${collaborators.cast[1]}</p>
                        <p>${collaborators.cast[2]}</p>
                        <p>${collaborators.cast[3]}</p>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <p><strong>Avaliação:</strong></p>
                        <div>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-half"></i>
                            <i class="bi bi-star"></i>
                        </div>
                    </div>
                </div>
            </section>
        `

        featuredMovieCarousel.appendChild(movie);
    }
}

const technicalDirection = async (id) => {
    let movieHighlights = await request(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`);

    let collaborators = {
        "director": "",
        "screenplay": "",
        "cast": []
    }

    for(let i = 0; i < 4; i++) {
        collaborators.cast.push(movieHighlights.cast[i].name);
    }

    movieHighlights.crew.forEach(member => {
        if(collaborators.director === "" && member.job === "Director") {
            collaborators.director = member.name;
        } else if(collaborators.screenplay === "" && member.job === "Screenplay") {
            collaborators.screenplay = member.name;
        } 

        if(collaborators.director !== "" && collaborators.screenplay !== "") 
            return;
    })

    return collaborators;
}
function onLoad() {
    featuredMovies();
    filmsInReleases();
}

// Metodo para fazer a requisicao para API. Esse metodo recebe dois parametros 
const request = async (url) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjdjOGFlMWYyMjIxMTYxMWEyYTQwYzg3MWQ5M2NiNyIsInN1YiI6IjYyYjBkYjI0OWMyNGZjMDA2MWIyODMyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EBb5x36iB5MtHgnJ8NRdC6Bgb8GJBN41MpYSMgdIshc'
        }
    };

    return (await fetch(url, options)).json()  
}

// Metodo para mostrar os filmes em destaque
const featuredMovies = async () =>  {
    let uploadMoreMovies = document.getElementById("upload-more-movies");
    let featuredMovies = document.getElementById("featured-movies");
    let response = await request("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1");

    let n = parseInt(uploadMoreMovies.value);
    for(let i = 0; i < 4; i++) {;
        let item = `
            <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                <img src="https://image.tmdb.org/t/p/original${response.results[n + i].poster_path}" alt="${response.results[n + i].title}" class="featured-images">
            </div>
        `;

        featuredMovies.innerHTML += item;
    }
    
    n += 4;
    uploadMoreMovies.value = n;
}

const filmsInReleases = async () => { 
    let launchFilmContainer = document.getElementById("carousel");
    let movieDetails = await request("https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1");

    for(let i = 0; i < 3; i++) {
        let item = document.createElement('article');
        let movieTechnicalSheet = await datasheet(movieDetails.results[i].id);

        item.classList.add("carousel-item");
        if(i == 0) {
            item.classList.add("active");
        }

        item.innerHTML += `
        <section class="row">
            <div class="col-12 col-lg-6">
                <iframe src="https://www.youtube.com/embed/aWzlQ2N6qqg" title="${movieDetails.results[i].original_title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            <div class="col-12 col-lg-6">
                <h2>${movieDetails.results[i].title}</h2>

                <p class="text-justify my-1"><strong>Sinopse: </strong>${movieDetails.results[i].overview}</p>

                <div class="d-flex align-items-center justify-content-between my-1">
                    <p><strong>Diretor: </strong>${movieTechnicalSheet.director}</p>
                    <p><strong>Roterista: </strong>${movieTechnicalSheet.screenplay}</p>
                    <p><strong>Estreia: </strong>${movieDetails.results[i].release_date}</p>
                </div>

                <p class="my-1"><strong>Elenco:</strong></p>

                <div class="d-flex align-items-center justify-content-between cast">
                    <p>${movieTechnicalSheet.cast[0]}</p>
                    <p>${movieTechnicalSheet.cast[1]}</p>
                    <p>${movieTechnicalSheet.cast[2]}</p>
                    <p>${movieTechnicalSheet.cast[3]}</p>
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

        launchFilmContainer.appendChild(item);
    }
}

const datasheet = async (id) => {
    let movie = await request(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`);
    let movieTechnicalSheet = {
        "director": "",
        "screenplay": "",
        "cast": []
    }

    for(let i = 0; i < 4; i++) {
        movieTechnicalSheet.cast.push(movie.cast[i].name);
    }

    movie.crew.forEach(member => {
        if (member.job === "Director" && movieTechnicalSheet.director === "") {
            movieTechnicalSheet.director = member.name;
        } else if (member.job === "Screenplay" && movieTechnicalSheet.screenplay === "") {
            movieTechnicalSheet.screenplay = member.name;
        }

        if (movieTechnicalSheet.director !== "" && movieTechnicalSheet.screenplay !== "") {
            return;
        }
    });

    return movieTechnicalSheet;
}

const loadDetailedMoviePage = async (id) => {
    let movie = await request(`https://api.themoviedb.org/3/movie/${id}?language=pt-Br`);
    let movieDetails = await request(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`);

    
}
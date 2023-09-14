const onLoad = () => {
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
    if(n < 16) {
        for(let i = 0; i < 4; i++) {;
            let item = `
                <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                    <a href="movie.html?id=${response.results[n + i].id}">
                        <img src="https://image.tmdb.org/t/p/original${response.results[n + i].poster_path}" alt="${response.results[n + i].title}" class="featured-images">
                    </a>
                </div>
            `;
    
            featuredMovies.innerHTML += item;
        }
        
        n += 4;
        uploadMoreMovies.value = n;
    } 
}

// Metodo para mostrar os filmes em lancamentos
const filmsInReleases = async () => { 
    let launchFilmContainer = document.getElementById("carousel");
    let movieDetails = await request("https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1");

    for(let i = 0; i < 3; i++) {
        let item = document.createElement('article');
        let cast = (await request(`https://api.themoviedb.org/3/movie/${movieDetails.results[i].id}/credits?language=pt-BR`)).cast;
        let video = await movieTrailers(movieDetails.results[i].id);

        item.classList.add("carousel-item");
        if(i == 0) {
            item.classList.add("active");
        }

        item.innerHTML += `
        <section class="row">
            <div class="col-12 col-lg-6">
                <iframe src="https://www.youtube.com/embed/${video.key}" title="${video.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            <div class="col-12 col-lg-6">
                <h2>${movieDetails.results[i].title}</h2>

                <p class="text-justify my-1"><strong>Sinopse: </strong>${movieDetails.results[i].overview}</p>

                <div class="d-flex align-items-center justify-content-between my-1">
                    <p><strong>Diretor: </strong>${await movieStaff(movieDetails.results[i].id, "Director")}</p>
                    <p><strong>Roterista: </strong>${await movieStaff(movieDetails.results[i].id, "Screenplay")}</p>
                    <p><strong>Estreia: </strong>${movieDetails.results[i].release_date}</p>
                </div>

                <p class="my-1"><strong>Elenco:</strong></p>

                <div class="d-flex align-items-center justify-content-between cast">
                    <p>${cast[0].name}</p>
                    <p>${cast[1].name}</p>
                    <p>${cast[2].name}</p>
                    <p>${cast[3].name}</p>
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

// Metodo para retornar a chave do trailer de cada filme
const movieTrailers = async (id) => {
    let response = await request(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
    let trailer = {
        "key": "",
        "name": ""
    }

    response.results.forEach(video => {
        if(video.type === "Trailer") {
            trailer.key = video.key; 
            trailer.name = video.name; 
            return
        }
    })

    return trailer;
}

// Metodo para procurar algum funcionario do filme
const movieStaff = async (id, job) => {
    let credits = await request(`https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`);
    let name;

    credits.crew.forEach(member => {
        if(member.job == job) {
            name = member.name;
            return ;
        }
    })

    return name;
}

// Metodo para mostrar um filme mais detalhado
const loadDetailedMoviePage = async () => {
    let url = new URL(window.location.href);
    let idMovie = url.searchParams.get("id"); 

    let movie = await request(`https://api.themoviedb.org/3/movie/${idMovie}?language=pt-BR`);
    let trailer = await movieTrailers(movie.id);

    let detailedFilmContainer = document.getElementById("movie-detalhs");
    detailedFilmContainer.innerHTML = `
    <secntion class="row">
        <aside class="col-12 col-md-4">
            <img class="w-100 image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        </aside>

        <article class="col-12 col-md-8">
            <h1>${movie.title}</h1>

            <div class="d-flex align-items-center">
                <span class="space">${movie.runtime} min</span> 

                <div id="genres"></div>
            </div>

            <div class="my-3">
                <h2>Enredo</h2>
                <p>${movie.overview}</p>
            </div>

            <div class="mb-3">
                <h2>Data de Lançamento</h2>
                <p>${movie.release_date}</p>
            </div>

            <div class="mb-3 d-flex align-items-center - justify-content-between">
                <div>
                    <h2>Diretor</h2>
                    <p>${await movieStaff(idMovie, "Director")}</p>
                </div>

                <div>
                    <h2>Roterista</h2>
                    <p>${await movieStaff(idMovie, "Screenplay")}</p>
                </div>

                <div>
                    <h2>Produtor</h2>
                    <p>${await movieStaff(idMovie, "Producer")}</p>
                </div>
            </div>

            <div class="mb-3">
                <h2>Elenco</h2>
                <div id="cast"></div>
            </div>

            <iframe width="100%" src="https://www.youtube.com/embed/${trailer.key}" title="${trailer.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </article>
    </secntion>
    `

    let genres = document.getElementById("genres");
    movie.genres.forEach(genre => {
        genres.innerText += " " +  genre.name + ", ";
    })

    let credits = await request(`https://api.themoviedb.org/3/movie/${idMovie}/credits?language=pt-BR`);
    let cast = document.getElementById("cast"); 
    credits.cast.forEach(member => {
        cast.innerText += " " + member.name + ",";
    })
}

const addQuerySearch = () => {
    let navSearch = document.getElementById("nav-search");
    window.location.href = `search.html?query=${navSearch.value}`;
}

const search = async () => {
    let url = new URL(window.location.href);
    let query = url.searchParams.get("query");
    let response = await request(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=pt-BR&page=1`);
    let researchContainer = document.getElementById("search");

    response.results.forEach(movie => {
        researchContainer.innerHTML += `
        <article class="row rounded my-4">
            <div class="col-12 col-md-4">
                <a href="movie.html?id=${movie.id}">
                    <img class="w-100 image" src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}">
                </a>           
            </div>

            <div class="col-12 col-md-8">
                <h2 class="my-2 my-md-0"><a href="movie.html?id=${movie.id}">${movie.title}</a></h2>
                <p>${movie.overview}</p>
            </div>
        </article>
        `
    })
}
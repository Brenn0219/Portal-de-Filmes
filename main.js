function onLoad() {
    request("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1", featuredMovies);
    // featuredMovies(results("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1"));
    // filmsInReleases(options);
}

/**
 * Metodo para fazer a requisicao para API. Esse metodo recebe dois parametros 
 * @param {*} url e o endereco da requisicao que queremos
 * @param {*} results e uma arrow funciton que ira executar uma funcao com a resposta da requisicao  
 */
function request(url, results) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjdjOGFlMWYyMjIxMTYxMWEyYTQwYzg3MWQ5M2NiNyIsInN1YiI6IjYyYjBkYjI0OWMyNGZjMDA2MWIyODMyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EBb5x36iB5MtHgnJ8NRdC6Bgb8GJBN41MpYSMgdIshc'
        }
    };

    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        results(response.results);
    })
    .catch(err => console.error(err));  
}

/**
 * Metodo para mostrar os filmes em destaque
 * @param {*} results sao os filmes em destaque 
 */
const featuredMovies = (results) => {
    let featuredMovies = document.getElementById("featured-movies");
    for(let i = 0; i < 4; i++) {;
        let item = `
            <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                <img src="https://image.tmdb.org/t/p/original${results[i].poster_path}" alt="${results[i].title}" class="featured-images">
            </div>
        `;

        featuredMovies.innerHTML += item;
    }
}

const filmsInReleases = (results) => {
    filmsInReleases = document.getElementById("carousel");

    for(let i = 0; i < 3; i++) {
        let filmingCrew
        let cast;

        let item = `
            <article class="carousel-item active">
                <section class="row">
                    <div class="col-12 col-lg-6">
                        <iframe src="https://www.youtube.com/watch?v=" title="${results[i].original_title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>

                    <div class="col-12 col-lg-6">
                        <h2>${results[i].title}</h2>

                        <p class="text-justify my-1"><strong>Sinopse: </strong>${results[i].overview}</p>

                        <div class="d-flex align-items-center justify-content-between my-1">
                            <p><strong>Diretor: </strong>${filmingCrew.director}</p>
                            <p><strong>Roteiro: </strong>${filmingCrew.screenwriter}</p>
                            <p><strong>Estreia: </strong>${results[i].release_date}</p>
                        </div>

                        <p class="my-1"><strong>Elenco:</strong></p>

                        <div class="d-flex align-items-center justify-content-between cast">
                            <p>${cast[0]}</p>
                            <p>${cast[1]}</p>
                            <p>${cast[2]}</p>
                            <p>${cast[3]}</p>
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
            <article/>
        `;

        featuredMovies.innerHTML += item;
    }
}
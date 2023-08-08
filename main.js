function onLoad() {
    featuredMovies();
    filmsInReleases();
}

/**
 * Metodo para fazer a requisicao para API. Esse metodo recebe dois parametros 
 * @param {*} url e o endereco da requisicao que queremos
 * @param {*} results e uma arrow funciton que ira executar uma funcao com a resposta da requisicao  
*/
function request(url) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjdjOGFlMWYyMjIxMTYxMWEyYTQwYzg3MWQ5M2NiNyIsInN1YiI6IjYyYjBkYjI0OWMyNGZjMDA2MWIyODMyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EBb5x36iB5MtHgnJ8NRdC6Bgb8GJBN41MpYSMgdIshc'
        }
    };

    return fetch(url, options)
    .then(response => response.json())
    .then(response => {
        return response;
    })
    .catch(err => console.error(err));  
}

/**
 * Metodo para mostrar os filmes em destaque
 * @param {*} results sao os filmes em destaque 
*/
const featuredMovies = () =>  {
    let featuredMovies = document.getElementById("featured-movies");
    let response = request("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1");

    response.then(data => {
        for(let i = 0; i < 4; i++) {;
            let item = `
                <div class="col-12 col-sm-6 col-md-6 col-lg-3">
                    <img src="https://image.tmdb.org/t/p/original${data.results[i].poster_path}" alt="${data.results[i].title}" class="featured-images">
                </div>
            `;
    
            featuredMovies.innerHTML += item;
        }
    }) 
}

const filmsInReleases = () => { 
    let releases = document.getElementById("carousel");
    let response = request("https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1");

    response.then(data => {
        for(let i = 0; i < 3; i++) {
            let item = document.createElement('article');
            item.classList.add("carousel-item");

            if(i == 0) {
                item.classList.add("active");
            }

            item.innerHTML += `
            <section class="row">
                <div class="col-12 col-lg-6">
                    <iframe id="video${i}" src="https://www.youtube.com/embed/aWzlQ2N6qqg" title="${data.results[i].original_title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>

                <div class="col-12 col-lg-6">
                    <h2>${data.results[i].title}</h2>

                    <p class="text-justify my-1"><strong>Sinopse: </strong>${data.results[i].overview}</p>

                    <div class="d-flex align-items-center justify-content-between my-1">
                        <p id="director${i}"></p>
                        <p id="screenplay${i}"></p>
                        <p><strong>Estreia: </strong>${data.results[i].release_date}</p>
                    </div>

                    <p class="my-1"><strong>Elenco:</strong></p>

                    <div id="cast${i}" class="d-flex align-items-center justify-content-between cast"></div>

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
            let responseCast = request(`https://api.themoviedb.org/3/movie/${data.results[i].id}/credits?language=pt-BR`);
            responseCast.then(data => {
                let director = document.getElementById(`director${i}`);
                let screenplay = document.getElementById(`screenplay${i}`);
                let cast = document.getElementById(`cast${i}`);

                data.crew.forEach(member => {
                    if (member.job === "Director" && director.innerHTML == "") {
                        director.innerHTML += `<strong>Diretor: </strong> ${member.name}`;
                    } else if (member.job === "Screenplay" && screenplay.innerHTML == "") {
                        screenplay.innerHTML = `<strong>Roteiro: </strong> ${member.name}`;
                    }

                    if (director.innerHTML !== "" && screenplay.innerHTML !== "") {
                        return;
                    }
                })

                for(let j = 0; j < 4; j++) {
                    let p = `<p>${data.cast[j].name}</p>`;
                    cast.innerHTML += p;
                }
            })

            releases.appendChild(item)
        }
    })
}
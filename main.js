"use strict";

/////////////////TODAS LAS VARIABLES PARA USARLAS////////////////////////////////////

const search = document.querySelector(".js_search");
const button_name = document.querySelector(".js_button_name");
const button_all = document.querySelector(".js_button_all");
const results = document.querySelector(".js_results");
const favorites = document.querySelector(".js_favorites");
const url = "https://cima.aemps.es/cima/rest/medicamentos?&multiple=";
let allMedicamentos = []; //Este es el array vacio para meter los medicamentos que han salido al buscar.
let listadoFavoritos = []; //Este es el array vacio que usaré para meter los favoritos seleccionados.

/////////////////AQUI CUANDO DAS AL BOTON BUSCAR EXACTAMENTE CON LO QUE PONES EN EL INPUT DE BUSQUEDA///////////////

const handlerClickName = () => {
    results.innerHTML = ""; //Esto es para que borre los resultados una vez que ya se han publicado para que no se vayan acumulando
    const text = search.value.toLowerCase(); // Esta variable tiene el valor de input de búsqueda

    fetch(url + text) // Aquí la url le sumamos el valor de la búsqueda del input, así nos buscará exactamente lo que está escrito
        .then((response) => response.json()) //ese response.json lo convierte en medicamentos
        .then((medicamentos) => {
            //El resultado de la búsqueda lo vamos a meter en la variable allMedicamentos.
            //Hacemos un map porque hay un array, y coger el dato que necesitemos de cada medicamento.

            allMedicamentos = medicamentos.resultados.map(
                //aqui vamos a coger el id de cada medicamento para usarlo mas adelante como key de favoritos.
                (
                    medicamento //cada medicamento va a ser un li.
                ) =>
                    `<li id="${medicamento.nregistro}"><p>${medicamento.nombre}</p> 
                    <a href="${medicamento.docs[0].urlHtml}">Ficha técnica</a>
                    <img src="${medicamento.fotos[0].url}" alt="todo_medicamento" />
                    <p>¿Necesita receta?: ${medicamento.receta}</p>
                    </li>`
            );
            results.innerHTML += allMedicamentos; //results está en el html, es el espacio que he hecho para que se pueda escribir los resultados de la api
        });
    //console.log((${medicamento.nregistro}));

    let elClick = document.querySelectorAll("p");
    //elClick.addEventListener("click", handlerFavorite);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////AQUI CUANDO LE DAS AL BOTON DE TODOS MUESTRA EL LISTADO DE LOS PRIMEROS 25 MEDICAMENTOS///////////////

const handleClickAll = () => {
    results.innerHTML = "";
    fetch(url)
        .then((response) => response.json())
        .then((medicamentos) => {
            console.log(medicamentos);
            const resultado = medicamentos.resultados.map(
                (medicamento) =>
                    `<li id="${medicamento.nregistro}"><p>${medicamento.nombre}</p>
                    <a href="${medicamento.docs[0].urlHtml}">Ficha técnica</a>
                    <img src="${medicamento.fotos[0].url}" alt="todo_medicamento" />
                    <p>¿Necesita receta?: ${medicamento.receta}</p>
                    </li>`
            );
            results.innerHTML += resultado;
            let elClick = document.querySelectorAll("li");
            for (let elementoP of elClick) {
                elementoP.addEventListener("click", handlerFavorite);
            }
        });
};
button_all.addEventListener("click", handleClickAll);
button_name.addEventListener("click", handlerClickName);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////FUNCIÓN PARA SELECCIONAR LOS FAVORITOS//////////////////////////////////////////

function handlerFavorite(ev) {
    const medicamento = allMedicamentos;
    const favNregistro = ev.target.id; //Aqui se guardará los numeros de registro de los elementos que haya dado click, que serán los favoritos.
    const medicamentoFavorito = allMedicamentos.find(
        (medicamento) => medicamento.nregistro === favNregistro
    );
    //En esta variable guardamos el resultado de buscar en el array de medicamentos despues de dar al boton buscar,
    //Con la condición de que si coincide el numero de registro del medicamento con el numero de registro del medicamentofavoritos.
    //El resultado de esto nos da el medicamento entero que coincide el numero de registro de las favoritas.
    const exiteEnFavoritos = listadoFavoritos.findIndex(
        (medicamentoFavorito) => medicamentoFavorito.nregistro === favNregistro
    );
    //Esto es para saber que posicion ocupa en el array de favoritos

    if (exiteEnFavoritos == -1) {
        //Aqui comprobamos: si existe en favoritos dará una posición diferente a la de -1 porque una posición -1 no existe en un array
        //por lo tanto lo que quiere decir -1 es que no esta en favoritos, por lo tanto se puede meter, en el array de favoritos

        listadoFavoritos.push(medicamentoFavorito); //como coincide y además no estaba metido, en el listado de favoritos lo metemos con un push
        listadoFavoritos.innerHTML = ""; //¿?
    }
    //Aquí creo el nombre que tendrá el localStorate y que es lo que voy a meter en el localStorage, en este caso, la variable del listado de favoritos.
    localStorage.setItem("listadoStorage", JSON.stringify(listadoFavoritos));
}
console.log(results);
results.addEventListener("click", handlerFavorite);
/////////////////////////////////////////////////////////////FUNCION DEL LOCALSTORAGE////////////////////////////////////////////////////////////

function getLocalStorage() {
    const saveFavorites = JSON.parse(localStorage.getItem("listadoStorage")); //Esta es la variable que va a guardar el listado de favoritos en el LS
    if (saveFavorites !== null) {
        // si no está en el listado de favoritos, añadelo.
        console.log(saveFavorites.lenght);
        listadoFavoritos = saveFavorites;
    }
}
getLocalStorage();

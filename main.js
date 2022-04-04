"use strict";

/////////////////TODAS LAS VARIABLES PARA USARLAS////////////////////////////////////

const search = document.querySelector(".js_search");
const button_name = document.querySelector(".js_button_name");
const button_all = document.querySelector(".js_button_all");
const results = document.querySelector(".js_results");
const favorites = document.querySelector(".js_favorites");
const url = "https://cima.aemps.es/cima/rest/medicamentos?&multiple=";



let allMedicamentos = []; //Este es el array vacio para meter los medicamentos que han salido al buscar. 
let listadoFavoritos = [];//Este es el array vacio que usaré para meter los favoritos seleccionados. 

/////////////////Aqui cuando das a buscar, te busca exactamente lo que pones///////////////

const handlerClickName = () => { 

    results.innerHTML = ""; //Esto es para que borre los resultados una vez que ya se han publicado para que no se vayan acumulando

    const text = search.value.toLowerCase(); // Esta variable tiene el valor de input de búsqueda

    console.log(text);

    fetch(url + text) // Aquí la url le sumamos el valor de la búsqueda del input, así nos buscará exactamente lo que está escrito
        .then((response) => response.json()) //ese response.json lo convierte en medicamentos
        .then((medicamentos) => {

            allMedicamentos = medicamentos.resultados.map(
                (medicamento) =>
                    `<li id=${medicamento.nregistro}><p>${medicamento.nombre}</p>
        <a href="${medicamento.docs[0].urlHtml}">Ficha técnica</a>
        <img src="${medicamento.fotos[0].url}" alt="todo_medicamento" />
        <p>¿Necesita receta?: ${medicamento.receta}</p>
        </li>`
            );
            results.innerHTML += allMedicamentos;
        });
      
        console.log(allMedicamentos)
let elClick= document.querySelectorAll('p');
        elClick.addEventListener("click", handlerFavorite);
};

function handlerFavorite (ev) {

   
const favNregistro= ev.currenTarget.id; //Aqui se guardará los numeros de registro de los elementos que haya dado click

const medicamentoFavorito = allMedicamentos.find(medicamento => medicamento.nregistro === favNregistro); //El resultado de esto nos da el medicamento entero que coincide el numero de registro de las favoritas.

const exiteEnFavoritos=listadoFavoritos.findIndex(medicamentoFavorito => medicamentoFavorito.nregistro===favNregistro);//Esto es para saber que posicion ocupa en el array de favoritos
console.log(exiteEnFavoritos);

if(exiteEnFavoritos == -1){ //quiere decir -1 que no esta en favoritos, por lo tanto se puede meter, en el array de favoritos

    listadoFavoritos.push(medicamentoFavorito);
    listadoFavoritos.innerHTML="";

}
localStorage.setItem("listadoStorage", JSON.stringify(listadoFavoritos));
}



function getLocalStorage(){

    const saveFavorites= JSON.parse(localStorage.getItem("listadoStorage"));

  console.log(saveFavorites.lenght);

    if(saveFavorites !==null){

       listadoFavoritos=saveFavorites;
    }


}
getLocalStorage();


///////////Aqui cuando le da al boton de todos muestra el listadode los 25 primeros medicamentos///////////////
    


const handleClickAll = () => { 
    results.innerHTML = "";
    fetch(url)
        .then((response) => response.json())

        .then((medicamentos) => {
            console.log(medicamentos)
            const resultado = medicamentos.resultados.map(
                (medicamento) =>
                    `<li id=${medicamento.nregistro}><p>${medicamento.nombre}</p>
<a href="${medicamento.docs[0].urlHtml}">Ficha técnica</a>
<img src="${medicamento.fotos[0].url}" alt="todo_medicamento" />
<p>¿Necesita receta?: ${medicamento.receta}</p>
</li>`
            );

            results.innerHTML += resultado;


   let elClick= document.querySelectorAll('li');
   for(let elementoP of elClick){

    elementoP.addEventListener("click", handlerFavorite); 
   }
   
        });

     
};
button_all.addEventListener("click", handleClickAll);
button_name.addEventListener("click", handlerClickName);



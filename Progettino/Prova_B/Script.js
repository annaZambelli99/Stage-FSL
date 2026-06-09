const btn = document.getElementById("btnCerca");
const input = document.getElementById("inputIngrediente");
const tbody = document.getElementById("tabellaBody");
//aggiunta della selet
const selectCategoria = document.getElementById("selectCategoria");

let mealTrovati = [];

//Aggiungo la chiamata API mettendo tutte le categoriw subito
async function caricaCategorie() {
  const resp= await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data= await resp.json();
    console.log(data); 

  selectCategoria.innerHTML= '<option value="tutte">Tutte le categorie</option>';
  for (let i=0; i<data.categories.length; i++){
    selectCategoria.innerHTML += '<option value="' + data.categories[i].strCategory+'">'+data.categories[i].strCategory+"</option>";
    }
  }

  function vaiARicetta(i){
    localStorage.setItem("piattoScelto", JSON.stringify(pastoDaVedere[i]));
    window.location.href="recipe.html";
  } 

  caricaCategorie();

btn.addEventListener("click", async () => {
  /*trim per togliere gli spazi prima e dopo dall'input inserito dall'utente*/
  const ingrediente = input.value.trim();
  if (!ingrediente) return;

  const categoriaScelta=selectCategoria.value;

  tbody.innerHTML =
    '<tr><td colspan="6" class="text-center">Si sta caricando...</td></tr>';

  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + ingrediente,
  );
  const data = await resp.json();

  /*controllo che sia stata trovata alemno una rictta*/
  if (!data.meals) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center text-danger">Nessuna ricetta presente per "' +
      ingrediente +'"</td></tr>';
      return;
  }

  //mi salvo ipiatti che ho trovato
  mealTrovati = data.meals;
  console.log(mealTrovati);
  //se l'utente non scegli tutte le categorie devo filtrare
  let pastoDaVedere=[];
  if(categoriaScelta=="tutte"){
    pastoDaVedere=mealTrovati;
  }else{
    for(let i=0; i<mealTrovati.length; i++){
      if(mealTrovati[i].strCategory===categoriaScelta){
        pastoDaVedere.push(mealTrovati[i]);
      }
    }
  }
  tbody.innerHTML = "";

  if(pastoDaVedere.length===0){
    tbody.innerHTML='<tr><td colspan="7" class="text-center text-danger">Non ho trovato ricette per '+ ingrediente+ ' nella categoria '+ categoriaScelta+ '</td></tr>';
    return;
  }

 

  for (let i = 0; i < pastoDaVedere.length; i++) {
    const meal = pastoDaVedere[i];
    const link = meal.strYoutube;

    const riga =
      "<tr>" +
      "<td>" +
      meal.strMeal +
      "</td>" +
      "<td>" +
      meal.strCategory +
      "</td>" +
      "<td>" +
      meal.strArea +
      "</td>" +
      '<td><span class="badge bg-success">Disponibile</span></td>' +
      '<td><img src="' +
      meal.strMealThumb +
      '" width="60" class="rounded"></td>' +
      '<td><a href="' +
      link +
      '" target="_blank" class="btn btn-outline-danger btn-sm">Vai</a></td>' +
      '<td><a href="recipe.html?id=' + meal.idMeal + '" class="btn btn-outline-primary btn-sm">Recipe</a></td>' +
      "</tr>";

    tbody.innerHTML += riga;
  }
    
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btn.click();
})

function apriRicetta(id) {
    localStorage.setItem("idRicetta", id);
    window.location.href = "recipe.html";
}
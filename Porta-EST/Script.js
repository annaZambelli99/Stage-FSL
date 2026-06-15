let tratte = {
  "Venezia": "Caorle|Treviso",
  "Treviso": "Venezia|Padova"
};

let veicolo="Premium";

window.onload = function () {
  let selectPartenza=document.getElementById("select-partenza");
  for (let partenza in tratte) {
    let opzione= document.createElement("option");
    opzione.value= partenza;
    opzione.textContent=partenza;
    selectPartenza.appendChild(opzione);
  }

  let datepicker=document.getElementById("datepicker");
  let oggi=new Date();
  let minStr= formatDate(oggi);
  let maxData= new Date(oggi);
  maxData.setDate(oggi.getDate() + 4);
  let maxStr= formatDate(maxData);
  datepicker.min=minStr;
  datepicker.max=maxStr;

  //Aggiorna opzioni valigie/bagagli quando cambia passeggeri
  document.getElementById("select-passeggeri").addEventListener("change", aggiornaBagagli);
};

function formatDate(d) {
  let y= d.getFullYear();
  let m= String(d.getMonth() + 1).padStart(2, '0');
  let g= String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + g;
}

function aggiornaDestinazione() {
  let selectPartenza=document.getElementById("select-partenza");
  let selectDestinazione= document.getElementById("select-destinazione");
  let partenzaScelta=selectPartenza.value;

  selectDestinazione.innerHTML= "";

  if (partenzaScelta === "") {
    let opzioneVuota= document.createElement("option");
    opzioneVuota.value= "";
    opzioneVuota.textContent= "Seleziona prima la partenza";
    selectDestinazione.appendChild(opzioneVuota);
    return;
  }

  let destinazioni= tratte[partenzaScelta].split("|");
  let opzioneBase= document.createElement("option");
  opzioneBase.value="";
  opzioneBase.textContent="Seleziona destinazione";
  selectDestinazione.appendChild(opzioneBase);

  for (let i = 0; i < destinazioni.length; i++) {
    let opzione= document.createElement("option");
    opzione.value=destinazioni[i];
    opzione.textContent=destinazioni[i];
    selectDestinazione.appendChild(opzione);
  }
}

function selezionaVeicolo(btn, nome) {
  veicolo=nome;
  document.querySelectorAll('.btn-veicolo').forEach(function (b) {
    b.classList.remove('btn-veicolo-active');
  });
  btn.classList.add('btn-veicolo-active');
}

//Aggiorna le opzioni di valigie e bagagli in base ai passeggeri
//e gestisce il suggerimento Luxury se passeggeri > 5
function aggiornaBagagli() {
  let numPass= parseInt(document.getElementById("select-passeggeri").value);

  /*devo far si che cambia le opzioni selezionabili in base ai passseggeri
  se i passeggrei sono tot le valigie selezionabili saranno minori =*/
  let selVal= document.getElementById("select-valigie");
  let valCurrent= parseInt(selVal.value);
  selVal.innerHTML="";
  for (let i = 0; i <= numPass; i++) {
    let o=document.createElement("option");
    o.value=i;
    o.textContent= i;
    selVal.appendChild(o);
  }
  selVal.value= Math.min(valCurrent, numPass);

  /*devo far si che cambia le opzioni selezionabili in base ai passseggeri
  se i passeggrei sono tot le bagagli selezionabili saranno minori =*/
  let selBag= document.getElementById("select-bagagli");
  let bagCurrent= parseInt(selBag.value);
  selBag.innerHTML= "";
  for (let j = 0; j <= numPass; j++) {
    let ob=document.createElement("option");
    ob.value= j;
    ob.textContent= j;
    selBag.appendChild(ob);
  }
  selBag.value= Math.min(bagCurrent, numPass);

  //se passeggeri >5 va automaticamente a Luxury
  let avviso= document.getElementById("avviso-luxury");
  if (numPass > 5) {
    veicolo= "Luxury";
    /*da capire un pochino cosa ha fatto*/
    document.querySelectorAll('.btn-veicolo').forEach(function (b) {
      b.classList.remove('btn-veicolo-active');
      if (b.textContent.trim().startsWith("Luxury")) b.classList.add('btn-veicolo-active');
    });
    avviso.style.display= "block";
  } else {
    avviso.style.display= "none";
  }
}

function validaOrario() {
  let minuti=document.getElementById("input-minuti").value;
  let errDiv=document.getElementById("orario-error");

  if (minuti === "") {
    errDiv.style.display = "none";
    return true;
  }

  let min = parseInt(minuti, 10);
  if (isNaN(min) || min < 0 || min > 59 || min % 5 !== 0) {
    errDiv.style.display= "block";
    document.getElementById("input-minuti").classList.add("input-error");
    return false;
  } else {
    errDiv.style.display= "none";
    document.getElementById("input-minuti").classList.remove("input-error");
    return true;
  }
}

function validaVolo(input) {
  //prendo il testo dell'utente e lo porto tutto in maiuscolo
  let val=input.value.toUpperCase();
  input.value= val;

  //mi prendo lelemento in cu iscrivo lerrore se è vuoto non scirvo nulla
  let errDiv=document.getElementById("volo-error");
  if (val === "") {
    errDiv.style.display="none";
    input.classList.remove("input-error");
    return true;
  }

  //utilizzandso la Regex(+ semplice) mi assicuro che l'utemte scriva 2 lettere e i numeri 
  let numVol= /^[A-Z]{0,2}[0-9]{0,4}$/.test(val);
  if (!numVol) {
    input.value=val.slice(0, -1); //così impedisco all'utemnte di scrivere altro
    return false;
  }

  let regex = /^[A-Z]{2}[0-9]{1,4}$/;
  if (val.length >= 3 && !regex.test(val)) { //se a scritto 3 caratteri ma non è ancora tutto gisuto seganlo
    errDiv.style.display= "block";
    input.classList.add("input-error");
    return false;
  } else if (regex.test(val)) {//qui non ci sono problemi non segnalo nulla
    errDiv.style.display= "none";
    input.classList.remove("input-error");
    return true;
  } else { //se lutente ha sol odigitato le prime due lettere sto tranquillo perchè deve ancora completare
    errDiv.style.display= "none";
    input.classList.remove("input-error");
    return true;
  }
}

function mostraRiepilogo() {
  let partenza= document.getElementById("select-partenza").value;
  let destinazione= document.getElementById("select-destinazione").value;
  let data= document.getElementById("datepicker").value;
  let ora= document.getElementById("input-ora").value;
  let minuti= document.getElementById("input-minuti").value;
  let volo= document.getElementById("input-volo").value;

  if (!partenza) { 
    alert("Seleziona la partenza."); 
    return; }
  if (!destinazione) { 
    alert("Seleziona la destinazione."); 
    return; }
  if (!data) { 
    alert("Seleziona una data."); 
    return; }
  if (!ora || !minuti) { 
    alert("Inserisci l'orario di arrivo del volo."); 
    return; }
  if (!validaOrario()) { 
    return; }

  let voloRegex = /^[A-Z]{2}[0-9]{1,4}$/;
  if (volo && !voloRegex.test(volo)) {
    alert("Numero volo non valido. Formato: 2 lettere IATA + 1-4 cifre (es. AZ1929).");
    return;
  }

  let dateParts = data.split("-");
  let dataLeggibile = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
  let minutiStr = String(parseInt(minuti, 10)).padStart(2, '0');
  let oraStr = String(parseInt(ora, 10)).padStart(2, '0');

  let optional = [];
  let optionals = [
    { id: "opt-seggiolino", nome: "Seggiolino per bambini" },
    { id: "opt-alzatina",   nome: "Alzatina per bambini" },
    { id: "opt-passeggino", nome: "Passeggino" },
    { id: "opt-carrozzina", nome: "Carrozzina pieghevole" },
    { id: "opt-sci",        nome: "Sci o snowboard" },
    { id: "opt-strumenti",  nome: "Strumenti musicali" },
    { id: "opt-golf",       nome: "Attrezzatura da golf" },
    { id: "opt-animali",    nome: "Animali domestici" },
  ];
  optionals.forEach(function (o) {
    let val = document.getElementById(o.id).value;
    if (parseInt(val) > 0) optional.push(o.nome + " x" + val);
  });

  let html = '<div class="riepilogo-grid">';
  html += rigaRiepilogo("Partenza", partenza);
  html += rigaRiepilogo("Destinazione", destinazione);
  html += rigaRiepilogo("Data", dataLeggibile);
  html += rigaRiepilogo("Orario volo", oraStr + ":" + minutiStr);
  if (volo) html += rigaRiepilogo("Numero volo", volo);
  html += rigaRiepilogo("Veicolo", veicolo);
  html += rigaRiepilogo("Passeggeri", document.getElementById("select-passeggeri").value);
  html += rigaRiepilogo("Valigie", document.getElementById("select-valigie").value);
  html += rigaRiepilogo("Bagagli a mano", document.getElementById("select-bagagli").value);
  if (optional.length > 0) html += rigaRiepilogo("Optional", optional.join(", "));
  html += '</div>';

  document.getElementById("riepilogo-content").innerHTML = html;
  let box= document.getElementById("box-riepilogo");
  box.style.display="block";
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function rigaRiepilogo(label, valore) {
  return '<div class="riepilogo-row"><span class="riepilogo-label">' + label + '</span><span class="riepilogo-value">' + valore + '</span></div>';
}

function acquista() {
  alert("Reindirizzamento al pagamento...");
}

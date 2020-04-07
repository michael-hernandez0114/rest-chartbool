$(document).ready(function () {

    var json = [
        {type:"lightblue",      amount:15},
        {type:"lightcoral",     amount:5},
        {type:"lightcoral",     amount:15},
        {type:"yellow",         amount:2},
        {type:"lightblue",      amount:25},
        {type:"lightblue",      amount:5}
    ]

    // ------------------- VERSIONE A MANO -------------------

    // ci serve un passagio intermedio per organizzare i dati in modo da farli digerire a chartJS
    var passaggioIntermedio = {
        lightcoral: 20,
        yellow: 2,
        lightblue: 45
    }

    var labelsFinali =  ['lightcoral', 'yellow', 'lightblue'];
    var dataFinali =  [20, 2, 45];

    // ------------------- FINE VERSIONE A MANO -------------------

    // Ora i passaggi a mano dobbiamo farli fare al computer

    var oggettoIntermedio = {};     // creo un oggetto vuoto dove inseriremo i valori dei 'json.type' come chiavi e come valori le somme degli 'amount'

    for (var i = 0; i < json.length; i++) {
        var oggettoSingolo = json[i];
        // console.log(oggettoSingolo);
        // console.log(oggettoSingolo.type);
        // console.log(oggettoSingolo.amount);
        var colore = oggettoSingolo.type;
        if (oggettoIntermedio[colore] === undefined) {      // nel caso in cui la chiave non esiste
            oggettoIntermedio[colore] = 0;                  //  allora la creiamo e gli assegnamo il valore 0
        }
        // console.log(oggettoIntermedio);
        oggettoIntermedio[colore] += oggettoSingolo.amount;     // (oramai la chiave esiste) e al suo valore sommiamo quello dell'amount dell'iesimo oggetto singolo che stiamo ciclando
    }
    // console.log(oggettoIntermedio);

    var labelsPC = [];
    var dataPC = [];

    for (var key in oggettoIntermedio) {    // ciclo nell'oggettoIntermedio per prendermi le chiavi e trasformarle in 'labels' e i valori (di quella chiave) per trasformarli in 'data'
        // console.log(key);
        labelsPC.push(key);
        dataPC.push(oggettoIntermedio[key]);
    }
    // console.log(labelsPC);
    // console.log(dataPC);

    var ctx = $('#grafico');
    var chart = new Chart(ctx, {

        type: 'pie',
        data: {
            datasets: [{
                data: dataPC,
                backgroundColor: labelsPC
            }],

            labels: labelsPC
        }
    });



});

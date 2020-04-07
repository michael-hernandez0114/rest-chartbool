$(document).ready(function () {


    /*
    var json = [
        {type:"lightblue",      amount:15},
        {type:"lightcoral",     amount:5},
        {type:"lightcoral",     amount:15},
        {type:"yellow",         amount:2},
        {type:"lightblue",      amount:25},
        {type:"lightblue",      amount:5}
    ]
    */

    var json = [];

    $.ajax({
        url: 'http://157.230.17.132:4012/sales',
        method: 'GET',
        async: false,
        success: function(data) {
            //console.log(data);
            //console.log(data.length);

            for (var i = 0; i < data.length; i++) {
                //console.log(data[i]);
                var salesData = {
                    id: data[i].id,
                    salesman: data[i].salesman,
                    amount: data[i].amount,
                    date: data[i].date,
                    month: moment(data[i].date, 'DD-MM-YYYY').locale('it').format('M')
                }
                //console.log(salesData);
                json.push(salesData);
            }
            console.log(json);

            console.log(json[0].month - json[1].month);
        }

    });

    json.sort(function(a,b) {
        return a.month - b.month
    })

    console.log(json);



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
        var currDate = moment(oggettoSingolo.date, 'DD-MM-YYYY').locale('it');

         //console.log(oggettoSingolo);
         //console.log(oggettoSingolo.date);
         //console.log(currDate.format('MM'));
         //console.log(oggettoSingolo.amount);
        var mese = currDate.format('MMMM');
        if (oggettoIntermedio[mese] === undefined) {      // nel caso in cui la chiave non esiste
            oggettoIntermedio[mese] = 0;                  //  allora la creiamo e gli assegnamo il valore 0
        }
        // console.log(oggettoIntermedio);
        oggettoIntermedio[mese] += oggettoSingolo.amount;     // (oramai la chiave esiste) e al suo valore sommiamo quello dell'amount dell'iesimo oggetto singolo che stiamo ciclando
    }
    console.log(oggettoIntermedio);

    var labelsLine = [];
    var dataLine = [];

    for (var key in oggettoIntermedio) {    // ciclo nell'oggettoIntermedio per prendermi le chiavi e trasformarle in 'labels' e i valori (di quella chiave) per trasformarli in 'data'
        // console.log(key);
        labelsLine.push(key);
        dataLine.push(oggettoIntermedio[key]);
    }
     //console.log(labelsLine);
     //console.log(dataLine);

    var ctx = $('#grafico');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: labelsLine,
            datasets: [{
                backgroundColor: 'blue',
                pointStyle: 'square',
                borderColor: 'blue',
                fill: false,
                lineTension: 0,
                showLine: true,
                label: '2017',
                data: dataLine,
            }],


        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                    },
                }]
            }
        }
    });



});

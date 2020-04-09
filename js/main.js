$(document).ready(function () {

    var apiBaseURL = 'http://157.230.17.132:4012/sales';


    $.ajax({
        url: apiBaseURL,
        method: 'GET',
        //async: false,
        success: function(data) {
            //console.log(data);
            //console.log(data.length);

            var dataCopy = data;
            var salesObject = processSalesPerMonth(dataCopy);
            //console.log(salesObject);
            createLineChart(salesObject);
            var venditeData = processContributoVenditore(dataCopy);
            createTorta(venditeData);



            //console.log(json);

            //console.log(json[0].month - json[1].month);
        }

    });

    $('#btn-submit').on('click', function(){
        var venditoreSelezionato = $('#venditore').val();
        var dateSelected = $('#sales-date').val();
        var formattedDate = moment(dateSelected, 'YYYY-MM-DD').format('DD/MM/YYYY');
        var salesAmount = $('#sales').val();

        $.ajax({
            url: apiBaseURL,
            method: 'POST',
            data: {
                salesman: venditoreSelezionato,
                date: dateSelected,
                sales: salesAmount
            },
            success: function(data, stato) {

            },
            error: function(error){
                alert('the PUSH API has errored:' + error)
            }
        })

        console.log(venditoreSelezionato);
        console.log(dateSelected);
        console.log(formattedDate);
        console.log(salesAmount);

    });

    function processSalesPerMonth(salesData){
        var salesArray = [];
        var finalObject = {};

        for (var i = 0; i < salesData.length; i++) {
            //console.log(data[i]);
            var salesEntry = {
                id: salesData[i].id,
                salesman: salesData[i].salesman,
                amount: salesData[i].amount,
                date: salesData[i].date,
                month: moment(salesData[i].date, 'DD-MM-YYYY').locale('it').format('M')
            }
            //console.log(salesData);
            salesArray.push(salesEntry);
        }

        salesArray.sort(function(a,b) {
            return a.month - b.month
        })

        var oggettoIntermedio = {};     // creo un oggetto vuoto dove inseriremo i valori dei 'json.type' come chiavi e come valori le somme degli 'amount'

        for (var i = 0; i < salesArray.length; i++) {
            var oggettoSingolo = salesArray[i];
            var currDate = moment(oggettoSingolo.date, 'DD-MM-YYYY').locale('it');

            var mese = currDate.format('MMMM');
            if (oggettoIntermedio[mese] === undefined) {      // nel caso in cui la chiave non esiste
                oggettoIntermedio[mese] = 0;                  //  allora la creiamo e gli assegnamo il valore 0
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[mese] += oggettoSingolo.amount;     // (oramai la chiave esiste) e al suo valore sommiamo quello dell'amount dell'iesimo oggetto singolo che stiamo ciclando
        }
        //console.log(oggettoIntermedio);

        var labelsLine = [];
        var dataLine = [];

        for (var key in oggettoIntermedio) {    // ciclo nell'oggettoIntermedio per prendermi le chiavi e trasformarle in 'labels' e i valori (di quella chiave) per trasformarli in 'data'
            // console.log(key);
            labelsLine.push(key);
            dataLine.push(oggettoIntermedio[key]);
        }

        finalObject.labels = labelsLine;
        finalObject.allData = dataLine;

        //console.log(finalObject);

        return finalObject;
    }

    function processContributoVenditore(tortaData) {
        var venditeArray = [];
        var finalObject = {};
        var totalSales = 0;

        for (var i = 0; i < tortaData.length; i++) {
            //console.log(data[i]);
            var vendite = {
                salesman: tortaData[i].salesman,
                amount: tortaData[i].amount
            }
            //console.log(salesData);
            venditeArray.push(vendite);
        }

        var oggettoIntermedio = {};     // creo un oggetto vuoto dove inseriremo i valori dei 'json.type' come chiavi e come valori le somme degli 'amount'

        for (var i = 0; i < venditeArray.length; i++) {
            var oggettoSingolo = venditeArray[i];
            var salesMan = oggettoSingolo.salesman;

            if (oggettoIntermedio[salesMan] === undefined) {      // nel caso in cui la chiave non esiste
                oggettoIntermedio[salesMan] = 0;                  //  allora la creiamo e gli assegnamo il valore 0
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[salesMan] += oggettoSingolo.amount;     // (oramai la chiave esiste) e al suo valore sommiamo quello dell'amount dell'iesimo oggetto singolo che stiamo ciclando
        }
        console.log(oggettoIntermedio);

        for (var amount in oggettoIntermedio) {
            totalSales += oggettoIntermedio[amount];
        }

        for (var amount in oggettoIntermedio) {
            oggettoIntermedio[amount] = ((oggettoIntermedio[amount] / totalSales) * 100).toFixed(2);
        }

        console.log(totalSales);
        console.log(oggettoIntermedio);

        var labelsTorta = [];
        var dataTorta = [];

        for (var key in oggettoIntermedio) {    // ciclo nell'oggettoIntermedio per prendermi le chiavi e trasformarle in 'labels' e i valori (di quella chiave) per trasformarli in 'data'
            // console.log(key);
            labelsTorta.push(key);
            dataTorta.push(oggettoIntermedio[key]);
        }

        finalObject.labels = labelsTorta;
        finalObject.allData = dataTorta;

        console.log(finalObject);

        return finalObject;

    }

    function pushSalesData(newData){


    }

    function createLineChart(chartData) {
        var ctx = $('#linechart');
        var chart = new Chart(ctx, {

            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    backgroundColor: 'blue',
                    pointStyle: 'square',
                    borderColor: 'blue',
                    fill: false,
                    lineTension: 0,
                    showLine: true,
                    label: '2017',
                    data: chartData.allData,
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

    }

    function createTorta(tortaData) {
        var ctx = $('#torta');
        var chart = new Chart(ctx, {

            type: 'pie',
            data: {
                labels: tortaData.labels,
                datasets: [{
                    backgroundColor: ['blue','green','red','yellow'],
                    borderColor: 'none',
                    borderWidth: 0,
                    data: tortaData.allData,
                }],


            }
        });
    }
});

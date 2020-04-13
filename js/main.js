$(document).ready(function () {

    const regExp = '^[0-9]+$';
    var apiBaseURL = 'http://157.230.17.132:4012/sales';
    var minDate = '2017-01-01';
    var maxDate = '2017-12-31';
    var htmlOption = $('#select-template').html();
    var templateOption = Handlebars.compile(htmlOption);

    setDateRange(minDate, maxDate);
    drawCharts();

    $('#btn-submit').on('click', function(){
        var dateSelected = $('#sales-date').val();
        var newSalesEntry = {
            salesman: $('#venditore').val(),
            date: moment(dateSelected, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            amount:parseInt($('#sales').val())
        };
        $('#sales-date').val('');
        $('#sales').val('');

        pushSalesData(newSalesEntry);
        drawCharts();

    });

    function setDateRange(min, max) {
        $('#sales-date').attr('min', min);
        $('#sales-date').attr('max', max);
    }

    function collectAPIData(input) {
        var dataArray = [];

        for (var i = 0; i < input.length; i++) {
            //console.log(data[i]);
            var salesEntry = {
                salesman: input[i].salesman,
                amount: parseInt(input[i].amount),
                date: input[i].date,
                month: moment(input[i].date, 'DD-MM-YYYY').locale('it').format('M')
            }
            //console.log(salesData);
            //console.log(input[i].amount);
            dataArray.push(salesEntry);
        }

        dataArray.sort(function(a,b) {
            return a.month - b.month
        })

        return dataArray;
    }

    function drawCharts() {

        $('#linechart').empty();
        $('#torta').empty();
        $('#bar').empty();
        $('#venditore').empty();

            $.ajax({
                url: apiBaseURL,
                method: 'GET',
                success: function(data) {
                    //console.log(data);
                    //console.log(data.length);

                    var dataCopy = data;
                    var salesArrayObjs = collectAPIData(dataCopy);
                    populateVenditore(salesArrayObjs);
                    var salesObject = processSalesPerMonth(salesArrayObjs);
                    //console.log(salesObject);
                    createLineChart(salesObject);
                    var venditeData = processContributoVenditore(salesArrayObjs);
                    createTorta(venditeData);
                    var salesQuarterObject = processSalesPerQuarter(salesArrayObjs);
                    createBarChart(salesQuarterObject);

                }

            })
    }

    function populateVenditore(apiData) {
        var venditoreArray = [];

        for (var i = 0; i < apiData.length; i++) {

            if(!venditoreArray.includes(apiData[i].salesman)) {
                venditoreArray.push(apiData[i].salesman);

                var venditore = {
                    venditoreValue: apiData[i].salesman,
                    venditore: apiData[i].salesman
                }

                var templateFinale = templateOption(venditore);
                $('#venditore').append(templateFinale);
            }

        }

    }

    function processSalesPerMonth(salesArray){
        var finalObject = {};
        var oggettoIntermedio = {};

        for (var i = 0; i < salesArray.length; i++) {
            var oggettoSingolo = salesArray[i];
            var currDate = moment(oggettoSingolo.date, 'DD-MM-YYYY').locale('it');

            var mese = currDate.format('MMMM');
            if (oggettoIntermedio[mese] === undefined) {
                oggettoIntermedio[mese] = 0;
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[mese] += oggettoSingolo.amount;
        }
        //console.log(oggettoIntermedio);

        var labelsLine = [];
        var dataLine = [];

        for (var key in oggettoIntermedio) {
            // console.log(key);
            labelsLine.push(key);
            dataLine.push(oggettoIntermedio[key]);
        }

        finalObject.labels = labelsLine;
        finalObject.allData = dataLine;

        //console.log(finalObject);

        return finalObject;
    }

    function processContributoVenditore(apiData) {
        var finalObject = {};
        var totalSales = 0;

        var oggettoIntermedio = {};

        for (var i = 0; i < apiData.length; i++) {
            var oggettoSingolo = apiData[i];
            var salesMan = oggettoSingolo.salesman;

            if (oggettoIntermedio[salesMan] === undefined) {
                oggettoIntermedio[salesMan] = 0;
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[salesMan] += oggettoSingolo.amount;
        }
        //console.log(oggettoIntermedio);

        // calculate total sales from individual sales
        for (var amount in oggettoIntermedio) {
            totalSales += parseInt(oggettoIntermedio[amount]);
        }

        // calculate percentage of sales per venditore using totalSales
        for (var amount in oggettoIntermedio) {
            oggettoIntermedio[amount] = ((oggettoIntermedio[amount] / totalSales) * 100).toFixed(2);
        }

        //console.log(totalSales);
        //console.log(oggettoIntermedio);

        var labelsTorta = [];
        var dataTorta = [];

        for (var key in oggettoIntermedio) {
            // console.log(key);
            labelsTorta.push(key);
            dataTorta.push(oggettoIntermedio[key]);
        }

        finalObject.labels = labelsTorta;
        finalObject.allData = dataTorta;

        //console.log(finalObject);

        return finalObject;

    }

    function processSalesPerQuarter(apiData) {
        var finalObject = {};
        var oggettoIntermedio = {};

        for (var i = 0; i < apiData.length; i++) {
            var oggettoSingolo = apiData[i];
            var currQuarter = 'Q' + moment(oggettoSingolo.date, 'DD-MM-YYYY').quarter();

            console.log(currQuarter);

            if (oggettoIntermedio[currQuarter] === undefined) {
                oggettoIntermedio[currQuarter] = 0;
            }
            // console.log(oggettoIntermedio);
            oggettoIntermedio[currQuarter] += oggettoSingolo.amount;
        }
        //console.log(oggettoIntermedio);

        var labelsLine = [];
        var dataLine = [];

        for (var key in oggettoIntermedio) {
            // console.log(key);
            labelsLine.push(key);
            dataLine.push(oggettoIntermedio[key]);
        }

        finalObject.labels = labelsLine;
        finalObject.allData = dataLine;

        //console.log(finalObject);

        return finalObject;
    }

    function pushSalesData(newSales){

        $.ajax({
            url: apiBaseURL,
            method: 'POST',
            data: {
                salesman: newSales.salesman,
                amount: newSales.amount,
                date: newSales.date

            },
            success: function(data, stato) {
                //console.log(data);
            },
            error: function(error){
                alert('the PUSH API has errored:' + error)
            }
        })

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

    function createBarChart(barChartData) {
        var ctx = $('#bar');
        var chart = new Chart(ctx, {

            type: 'bar',
            data: {
                labels: barChartData.labels,
                datasets: [{
                    backgroundColor: ['blue','green','red','yellow'],
                    borderColor: 'none',
                    borderWidth: 0,
                    data: barChartData.allData,
                    label: '2017'
                }],


            }
        });
    }
});

$(document).ready(function() {
  var heatmap;
  axios
  .get('http://127.0.0.1:8000/v1/visitations/get_data_heatmap/')
  .then((response) => {
    heatmap = response.data; 
    var chart1 = calendarHeatmap()
                  .data(heatmap)
                  .selector('#chart-one')
                  .colorRange(['#d4edf4', '#004459'])
                  .tooltipEnabled(true)
                  .onClick(function (data) {
                    console.log('onClick callback. Data:', data);
                  })
                  .legendEnabled(false)
                  .locale({
                    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
                    days: ['', '', '', '', '', '', ''],
                    No: 'Нет',
                    on: ' ',
                    Less: '',
                    More: 'Больше'
                  });
    chart1();
    })
    .catch(error => console.log(error));
});
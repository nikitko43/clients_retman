const instance = axios.create({ baseURL: 'http://gym.nikitko.ru/' });

Vue.component('stats', {
  props: ['data'],
  template: `<div>
  <li> Последняя неделя - <b>{{ data.last_week }}</b> </li>
  <li> Последний месяц - <b>{{ data.last_month }}</b> </li>
  <li> Абонементы за за последний месяц - <b>{{ data.last_month_ms }}</b> </li>
  <li> Обычные тренировки за последний месяц - <b>{{ data.last_month_vs }}</b> </li>
  <li> Персональные тренировки за за последний месяц - <b>{{ data.last_month_pt }}</b> </li>
  <li> Групповые тренировки за за последний месяц - <b>{{ data.last_month_gt }}</b> </li>
  <li> Последний год - <b>{{ data.last_year }}</b> </li> </div>`
})

var stats = new Vue({
  el: '#stats',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_stats: function () {
    axios
    .get('v1/payments/overview/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_stats()}
});
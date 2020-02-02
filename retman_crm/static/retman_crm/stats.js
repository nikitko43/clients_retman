const instance = axios.create({ baseURL: 'https://clients.retman.ru/' });

Vue.component('stats', {
  props: ['data'],
  template: `<div>
  <li> Активные абонементы 1/3/6/12 месяцев - <b>{{ data.month_active_memberships1 }}</b>, <b>{{ data.month_active_memberships3 }}</b>,
  <b>{{ data.month_active_memberships6 }}</b>, <b>{{ data.month_active_memberships12 }}</b> </li>
  <li> Сумма по активным абоненементам на 1 месяц - <b>{{ data.month_memberships_sum }}</b> </li>
  <br>
  <li> Абонементы за за последний месяц - <b>{{ data.last_month_ms }}</b> </li>
  <li> Персональные тренировки за последний месяц - <b>{{ data.last_month_pt }}</b> </li>
  <li> Групповые тренировки за последний месяц - <b>{{ data.last_month_gt }}</b> </li>
  <br>
  <li> Последний год - <b>{{ data.last_year }}</b> </li>
  <li> Последний месяц - <b>{{ data.last_month }}</b> </li>
  <li> Последняя неделя - <b>{{ data.last_week }}</b> </li>
  </div>
  `
})

function checkPassword(){
  if ($("#pswd").val() == 'drop'){
    $("#stats-container").removeClass("is-hidden");
  }
  else {
    $("#stats-container").addClass("is-hidden");
  }
}

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
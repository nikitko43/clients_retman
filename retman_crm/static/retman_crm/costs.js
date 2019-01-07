var csrftoken = Cookies.get('csrftoken');
const instance = axios.create({ baseURL: 'http://127.0.0.1:8000' });

Vue.component('simple', {
  props: ['item'],
  template: '<li>{{ item }}</li>'
});

Vue.component('cost', {
  props: ['cost'],
  template: `<p>
             <b> {{ cost.type_display }} </b> на {{ cost.amount }}, стоимость - <b> {{ cost.value }} </b>
             <a :c_id="cost.id" onclick="click_delete_cost(this)" class="delete is-pulled-right"></a></p>`
});

var costs = new Vue({
  el: '#costs',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_costs: function () {
    axios
    .get('v1/costs/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_costs()}
});

function click_delete_cost(button) {
  c_id = $(button).attr('c_id');
  const formData = new FormData($('#form_cost'));

  $.ajax({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        type: 'DELETE',
        url: '/v1/costs/' + c_id + '/',
        data: formData,
        processData: false,
        contentType: false,

        success: (result) => {
          costs.get_costs();
        }
    });
}

$(document).ready(function() {
    var form_cost = $("#form_cost");

    form_cost.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/v1/costs/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              form_cost[0].reset();
              costs.get_costs();
            }
        });
    });
});
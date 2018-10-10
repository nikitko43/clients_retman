var splitted_url = window.location.pathname.split('/');
var customer_id = splitted_url[splitted_url.length - 1]
const instance = axios.create({ baseURL: 'http://gym.nikitko.ru/' });

Vue.component('customer-full', {
  props: ['customer'],
  template: `<div><b><p class="is-size-2 b-p">{{ customer.full_name }}</p></b>
            <li><b>ID</b> - {{ customer.card_id }}</li>
            <li v-if="customer.phone_number != ''"><b>Номер телефона</b> - {{ customer.phone_number }}</li>
            <li v-if="customer.birth_date != null"><b>День рождения</b> - {{ customer.birth_date }}</li>
            </br>
            <li><b>Количество доступных посещений</b> - {{ customer.amount_of_available_visitations }}</li>
            <li><b>Количество доступных персональных тренировок</b> - {{ customer.amount_of_available_personal }}</li>
            <li><b>Количество доступных групповых тренировок</b> - {{ customer.amount_of_available_group }}</li>
            </div>`
});

Vue.component('membership', {
  props: ['membership'],
  template: `<div><p>Действителен с <b>{{ membership.enrollment_date.split(' ')[0] }}</b> до 
            <b>{{ membership.expiration_date.split(' ')[0] }}</b> </p>
            </div>`
});

Vue.component('short-membership', {
  props: ['membership'],
  template: `<div><li><b>{{ membership.enrollment_date.split(' ')[0] }}</b> - 
            <b>{{ membership.expiration_date.split(' ')[0] }}</b> </li>
            </div>`
});

Vue.component('visitation', {
  props: ['visitation'],
  template: `<div><li>{{ visitation.type_display }}, 
             <b>{{ visitation.came_at }}</b>
             - <b>{{ visitation.left_at }}</b>
             {{ visitation.key_number ? ', ключ - ' + visitation.key_number : '' }}</li></div>`
});

var customer = new Vue({
  el: '#customer',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_customer: function () {
    axios
    .get('v1/customers/' + customer_id)
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_customer()}
});

var customer_membership = new Vue({
  el: '#customer_membership',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_customer_membership: function () {
    axios
    .get('v1/customers/' + customer_id + '/membership/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_customer_membership()}
});

var customer_memberships = new Vue({
  el: '#customer_memberships',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_customer_memberships: function () {
    axios
    .get('v1/customers/' + customer_id + '/memberships/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_customer_memberships()}
});

var customer_visitations = new Vue({
  el: '#customer_visitations',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_customer_visitations: function () {
    axios
    .get('v1/customers/' + customer_id + '/visitations/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_customer_visitations()}
});

$(document).ready(function() {
    var form_visitation = $("#form_visitation");
    form_visitation.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.set('customer_id', customer_id)

        $.ajax({
            type: 'POST',
            url: '/v1/visitations/open/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              window.location.href = "http://gym.nikitko.ru/dashboard/";
            },

            error: (result) => {
              alert('Ошибка')
            }
        });
    });

    var form_add_visitations = $("#form_add_visitations");
    form_add_visitations.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/v1/customers/' + customer_id + '/visitations/add/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              alert('Добавлено')
              form_add_visitations[0].reset();
              $('#vs_amount').val('');
              customer.get_customer();
            }
        });
    });

    var form_membership = $("#form_membership");
    form_membership.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/v1/customers/' + customer_id + '/membership/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              form_membership[0].reset();
              customer.get_customer();
              customer_membership.get_customer_membership();
              customer_memberships.get_customer_memberships();
            },

            error: (result) => {
              alert('Ошибка');
            }
        });
    });

    var costs;
    axios
    .get('v1/costs/')
    .then((response) => {costs = response.data});

    function set_ms_cost(){
      for(var cost of costs){
        if (cost['type'] == 'MS' && cost['amount'] == $("#ms_amount").val()){
          $("#ms_value").val(cost['value']);
          return;
        }
      }
    }

    function set_vs_cost(){
      for(var cost of costs){
        if (cost['type'] == $("#vs_type").val() && cost['amount'] == $("#vs_amount").val()){
          $("#vs_value").val(cost['value']);
          return;
        }
      }
    }

    $("#ms_amount").on("change paste keyup", set_ms_cost);
    $("#vs_type").on("change paste keyup", set_vs_cost);
    $("#vs_amount").on("change paste keyup", set_vs_cost);
});

$("#mh1").click(function(){
   $('#list_memberships').toggleClass('is-hidden')
});

$("#vh1").click(function(){
   $('#list_visitations').toggleClass('is-hidden')
});
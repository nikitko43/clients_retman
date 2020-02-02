const instance = axios.create({ baseURL: 'http://gym.nikitko.ru/' });

Vue.prototype.moment = moment

Vue.component('customer', {
  props: ['customer'],
  template: `<b><b class="has-text-grey-light">{{ customer.card_id }}</b>
             <a :c_id="customer.id" onclick="click_view_customer(this)">{{ customer.full_name }}</a></b>`
});

Vue.component('visitation', {
  props: ['visitation'],
  template: `<p> <b class="has-text-grey-light">{{ visitation.customer.card_id }}</b>
             <b>
             <div v-if="Math.abs(moment.duration(moment(visitation.came_at, "DD/MM/YYYY HH:mm:ss").diff(moment())).hours()) <= 2">
             <a :c_id="visitation.customer.id" onclick="click_view_customer(this)">
             {{ visitation.customer.full_name }}</a>
             </div>
             <div v-else>
             <a :c_id="visitation.customer.id" class="red" onclick="click_view_customer(this)">
             {{ visitation.customer.full_name }}</a>
             </div>
             </b>
             <a :c_id="visitation.customer.id" 
             onclick="click_close_visitation(this)" class="delete is-pulled-right"></a> </p>`
});

var customers = new Vue({
  el: '#customers',
  data() {
    return {
      info: {}
    }
  },
  methods: {
  get_customers: function () {
    axios
    .get('v1/customers/')
    .then((response) => {this.info = response.data});
  }},
  mounted: function () {this.get_customers()}
});


var visitations = new Vue({
  el: '#visitations',
  data: {
    vs: [],
    gt: [],
  },
  methods: {
  get_visitations: function () {
    axios
    .get('v1/visitations/')
    .then((response) => {
      this.vs = [];
      this.gt = []
      for (var item of response.data){
        if (item.type == 'GT'){
          this.gt.push(item);
        }
        else {
          this.vs.push(item);
        }
      }
    });
  }},
  mounted: function () {this.get_visitations()}
});

function click_view_customer(button) {
  c_id = $(button).attr('c_id');

  window.location.href = "http://gym.nikitko.ru/customer/" + c_id;
}

function click_close_group_all() {
  $.ajax({
    type: 'GET',
    url: '/v1/visitations/close_group/',
    processData: false,
    contentType: false,

    success: (result) => {visitations.get_visitations()}
  });
}

function click_close_visitation(button) {
  c_id = $(button).attr('c_id');

  $.ajax({
    type: 'GET',
    url: '/v1/customers/' + c_id + '/visitation/close/',
    processData: false,
    contentType: false,

    success: (result) => {visitations.get_visitations()}
  });
}

var modal = {
  open: function() { document.getElementById('modal').classList.add('is-active') },
  close: function() { document.getElementById('modal').classList.remove('is-active') }
};

$(document).ready(function() {
    $("#mh1").click(function(){
      $('#form_customer_hide').toggleClass('is-hidden');
    });

    $("#add_visitation").click(function(){
      $(".modal").addClass('is-active');
    })

    var form_visitation = $("#form_visitation");
    form_visitation.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.set('card_id', $("#card_id").val())
        console.log(formData);

        $.ajax({
            type: 'POST',
            url: '/v1/visitations/open/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              visitations.get_visitations();
              $("#card_id").val("");
              modal.close();
            },

            error: (result) => {
              alert('Ошибка')
            }
        });
    });

    var form_customer = $("#form_customer");
    form_customer.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/v1/customers/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              form_customer[0].reset();
              customers.get_customers();
            },
            error: (result) => {
              alert('Ошибка');
            }
        });
    });
});
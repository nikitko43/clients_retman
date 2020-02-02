var splitted_url = window.location.pathname.split('/');
var customer_id = splitted_url[splitted_url.length - 1];
const instance = axios.create({ baseURL: 'https://clients.retman.ru/' });

Vue.component('customer-full', {
  props: ['customer'],
  template: `<div><b><p class="is-size-2 b-p">{{ customer.full_name }}</p></b>
            <p><b>ID</b> - {{ customer.card_id }}</p>
            <p v-if="customer.phone_number != ''"><b>Номер телефона</b> - {{ customer.phone_number }}</p>
            <p v-if="customer.birth_date != null"><b>День рождения</b> - {{ customer.birth_date }}</p>
            </br>
            <table class="table">
              <thead>
                <tr>
                  <th>Обычные</th>
                  <th>Персональные</th>
                  <th>Групповые</abbr></th>
                  <th>Вводная</th>
                </tr>
              </thead>
              <tbody>
                <td style="font-size: 22px">{{ customer.amount_of_available_visitations }}</td>
                <td style="font-size: 22px">{{ customer.amount_of_available_personal }}</td>
                <td style="font-size: 22px">{{ customer.amount_of_available_group }}</td>
                <td> <div>
                  <input type="checkbox" id="introducing" name="introducing" :checked="customer.introducing">
                </div> </td>
              </tbody>
            </table>
            </div>`
});

Vue.component('membership', {
  props: ['membership'],
  template: `<div><p>Абонемент действителен с <b>{{ membership.enrollment_date.split(' ')[0] }}</b> до 
            <b>{{ membership.expiration_date.split(' ')[0] }} </b> 
            <p v-if="membership.freeze_start != null">Заморозка с 
            <b>{{ membership.freeze_start }}</b> до <b>{{ membership.freeze_end }}</b></p></p>
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
             {{ visitation.key_number ? ', ключ - ' + visitation.key_number : '' }}
             <p style="padding-left: 22px;">{{ visitation.note }}</p></li></div>`
});

var modal = {
  open: function() { document.getElementById('modal').classList.add('is-active') },
  close: function() { document.getElementById('modal').classList.remove('is-active') }
};

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
    .get('v1/customers/' + customer_id + '/')
    .then((response) => {
      this.info = response.data;
      $("#notes").val(response.data.notes);
    });
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
    .then((response) => {
      this.info = response.data;
      if (response.data.color == 0) {
        $("#customer_membership").addClass("background-green")
      }
      if (response.data.color == 1) {
        $("#customer_membership").addClass("background-yellow")
      }});
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

    let v = document.getElementById("take-photo");

    let imageCanvas = document.createElement('canvas');
    let imageCtx = imageCanvas.getContext("2d");

    function sendImagefromCanvas() {
        imageCanvas.width = v.videoWidth;
        imageCanvas.height = v.videoHeight;

        imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);

        imageCanvas.toBlob(postFile, 'image/jpeg');
    }

    v.onclick = function() {
        sendImagefromCanvas();
    };

    function postFile(file) {
        let formdata = new FormData($("#form_visitation"));
        formdata.append("csrfmiddlewaretoken", document.getElementById('form_membership').firstElementChild.value);
        formdata.append("image", file);
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/v1/customers/' + customer_id + '/photo/', true);
        xhr.onload = function () {
        if (this.status === 200){
            console.log(this.response);
            $(".modal").removeClass('is-active');
            customer.get_customer();
        }
        else
            console.error(xhr);
        };
        xhr.send(formdata);
    }

    $("#take-photo-button").click(function(){
      $(".modal").addClass('is-active');
    });

    $("#introducing").click( function(){
      if( $(this).is(':checked') ){ 
        let formdata = new FormData();
        formdata.append("csrfmiddlewaretoken", document.getElementById('form_membership').firstElementChild.value);
        formdata.append("check", "check");
        $.ajax({
          type: 'POST',
          url: '/v1/customers/' + customer_id + '/introducing/',
          data: formdata,
          processData: false,
          contentType: false,
          success: (result) => {
            console.log(result);
          }
        });
      }
      else {
        this.checked = true;
      }
    });

    navigator.mediaDevices.getUserMedia({video: {width: 600, height: 600}, audio: false})
        .then(stream => {
            v.srcObject = stream;
        })
        .catch(err => {
            console.log('navigator.getUserMedia error: ', err)
        });

    var form_visitation = $("#form_visitation");
    form_visitation.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.set('customer_id', customer_id);

        $.ajax({
            type: 'POST',
            url: '/v1/visitations/open/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              window.location.href = "https://clients.retman.ru/dashboard/";
            },

            error: (result) => {
              alert('Ошибка')
            }
        });
    });

    var form_notes = $("#form_notes");
    form_notes.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({

            headers: {
                'X-HTTP-Method-Override': 'PATCH'
            },
            type : "POST",
            url: '/v1/customers/' + customer_id + '/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              $("#saved-text").show().fadeOut(3000);
            },

            error: (result) => {
              alert('Ошибка');
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
              alert('Добавлено');
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
              alert('Добавлено');
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

    var form_freeze = $("#form_freeze");
    form_freeze.on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/v1/customers/' + customer_id + '/membership/freeze/',
            data: formData,
            processData: false,
            contentType: false,

            success: (result) => {
              alert('Абонемент заморожен');
              form_freeze[0].reset();
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

    axios
    .get('v1/costs/')
    .then((response) => {costs = response.data; set_vs_cost(); set_ms_cost();});

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
import axios from 'axios';


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break
            }
        }
    }
    return cookieValue
}

export const customers = axios.create({
    baseURL: '/api/v1/customers',
    headers: { Accept: '*/*' }
});

export const visitations = axios.create({
    baseURL: '/api/v1/visitations',
    headers: { Accept: '*/*' }
});

export const trainers = axios.create({
    baseURL: '/api/v1/trainers',
    headers: { Accept: '*/*' }
});

export const membership_types = axios.create({
  baseURL: '/api/v1/membership_types',
  headers: { Accept: '*/*' }
});

export const new_customer = (data) => {
    return customers.post('/', data);
};

export const get_customers = () => {
    return customers.get('/');
};

export const get_customer = (id) => {
    return customers.get(`${id}/`);
};

export const edit_customer = (data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return customers.post(`${data.get('id')}/`, data, {headers: headers})
};

export const delete_customer = (id) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return customers.delete(`${id}/`, {headers: headers})
};

export const change_customer = (id, data) => {
    return customers.post(`${id}/`, data, {headers: {'X-HTTP-Method-Override': 'PATCH'}});
};

export const get_customer_memberships = (id) => {
    return customers.get(`${id}/memberships/`);
};

export const edit_membership = (client_id, data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return customers.post(`/${client_id}/memberships/${data.get('id')}/`, data, {headers: headers})
};

export const delete_membership = (client_id, id) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return customers.delete(`${client_id}/memberships/${id}/`, {headers: headers})
};

export const get_customer_visitations = (id) => {
    return customers.get(`${id}/visitations/`);
};

export const get_visitations = () => {
    return visitations.get('/');
};

export const close_customer_visitation = (id) => {
    return customers.get(`/${id}/visitation/close/`);
};

export const get_trainers = () => {
    return trainers.get('/');
};

export const open_visitation = (data) => {
    return visitations.post('/open/', data);
};

export const set_customer_introducing = (customer_id, data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return customers.post(`/${customer_id}/introducing/`, data, {headers: headers});
};

export const get_membership_types = () => {
    return membership_types.get('/');
};

export const create_membership_type = () => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return membership_types.post('/', null, {headers: headers});
};

export const delete_membership_type = (id) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return membership_types.delete(`${id}/`, {headers: headers});
};

export const edit_membership_type = (data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return membership_types.post(`${data.get('id')}/`, data, {headers: headers})
};

export const create_membership = (customer_id, data) => {
    return customers.post(`${customer_id}/membership/`, data);
};

export const freeze_membership = (customer_id, data) => {
    return customers.post(`${customer_id}/membership/freeze/`, data);
};

export const get_trainers_visitations = (data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return axios.post('/api/v1/trainers_visitations/', data, {headers: headers});
};

export const get_services = () => {
    return axios.get('/api/v1/services/')
};

export const create_service = (title) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return axios.post('/api/v1/services/', {title: title}, {headers: headers});
};

export const create_payment = (data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return axios.post('/api/v1/payments/', data, {headers: headers});
};

export const get_payments = () => {
    return axios.get('/api/v1/payments/')
};

export const get_stats = (start_date, end_date) => {
    return axios.get(`/api/v1/stats/?start_date=${start_date}&end_date=${end_date}`)
};

export const edit_trainer = (data) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return trainers.put(`${data.get('id')}/`, data, {headers: headers})
};

export const delete_trainer = (id) => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return trainers.delete(`${id}/`, {headers: headers})
};

export const create_trainer = () => {
    const headers = { 'X-CSRFTOKEN': getCookie('csrftoken') };
    return trainers.post('/', {}, {headers: headers});
};

export const get_notifications = () => {
    return axios.get('/api/v1/notifications/');
};
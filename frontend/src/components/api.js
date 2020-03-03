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

export const new_customer = (data) => {
    return customers.post('/', data);
};

export const get_customers = () => {
    return customers.get('/');
};

export const get_customer = (id) => {
    return customers.get(`${id}/`);
};

export const change_customer = (id, data) => {
    return customers.post(`${id}/`, data, {headers: {'X-HTTP-Method-Override': 'PATCH'}});
};

export const get_customer_memberships = (id) => {
    return customers.get(`${id}/memberships/`);
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
    return axios.get('/api/v1/membership_types/');
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
}
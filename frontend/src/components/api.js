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

export const get_customers = () => {
    return customers.get('/');
};

export const get_customer = (id) => {
    return customers.get(`${id}/`);
};

export const get_customer_memberships = (id) => {
    return customers.get(`${id}/memberships/`);
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
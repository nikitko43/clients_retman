import React, {useState, useEffect} from 'react';
import Select from "react-select";

import CreatableSelect from 'react-select/creatable';

import {create_payment, create_service, get_services} from "../api";

const Purchases = ({customers, onNewPurchase}) => {
  const [service, setService] = useState();
  const [client, setClient] = useState();
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [send, setSend] = useState(false);
  const [type, setType] = useState('');

  const servicesToOptions = (data) => {
    return data.map((service) => {return {label: service.title, value: service.id}});
  };

  const customersToOptions = (data) => {
    return data.map((customer) => {return {label: `${customer.card_id} ${customer.full_name}`, value: customer.id}})
  };

  const getServices = () => {
    get_services().then((response) => {
      setServices(servicesToOptions(response.data));
      setIsLoading(false);
    }).catch();
  };

  const sendPayment = (type) => {
    create_payment({type: type, customer: client.value, service: service.value, value: value}).then((response) => {
      setService('');
      setClient('');
      setValue('');
      setType(type);
      setSend(true);
      onNewPurchase();
    }).catch((e) => alert('Ошибка'));
  };

  useEffect(() => { getServices() }, []);

  useEffect(() => { setClients(customersToOptions(customers)) }, [customers]);

  useEffect(() => {
    if (send) {
      setTimeout(() => {
        setSend(false);
      }, 1000)
    }
  }, [send]);

  const onValueChange = (e) => {
    if (e.target.value <= 99999){
      setValue(e.target.value);
    }
  };

  const createOption = (option) => {
    setIsLoading(true);
    create_service(option).then((response) => {
      getServices();
      setService(option);
    });
  };

  return (
    <div className="box purchase">
      <Select value={client} onChange={(option) => setClient(option)} options={clients} placeholder={'Клиент'}
              classNamePrefix={"purchase"} className={"has-margin-bottom-7"}/>
      <div className={"is-flex control"}>
        <CreatableSelect value={service} onChange={(option) => setService(option)} options={services} placeholder={'Услуга'}
                         onCreateOption={createOption} isDisabled={isLoading} isLoading={isLoading}
                         classNamePrefix={"purchase"} className={"has-margin-right-8 purchase-form-service"}
                         formatCreateLabel={(inputValue) => "Добавить \"" + inputValue + "\""}/>

        <input type={"number"} value={value} onChange={onValueChange} className={"purchase-value has-margin-right-8"} placeholder={'₽'}/>

        <button type='button' className={'button has-margin-right-8 ' + (send && (type === 'cash') ? 'purchase-completed' : '') }
                onClick={() => sendPayment('cash')}><i className="far fa-money-bill-alt" /></button>
        <button type='button' className={'button ' + (send && (type === 'card') ? 'purchase-completed' : '') }
                onClick={() => sendPayment('card')}><i className="far fa-credit-card" /></button>
      </div>
    </div>
  )
};


export default Purchases;
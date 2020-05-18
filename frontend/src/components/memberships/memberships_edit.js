import Select from "react-select";
import React, {useEffect, useState} from "react";
import {
  delete_membership,
  delete_membership_type, edit_membership,
  edit_membership_type,
  get_customer_memberships,
  get_customers
} from "../api";
import SimpleUpdateDeleteForm from "../common/simple_ud_form";
import moment from "moment";

const MembershipEdit = () => {
  const [client, setClient] = useState();
  const [clients, setClients] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [membership, setMembership] = useState();

  const loadCustomers = () => { get_customers().then(response => { setCustomers(response.data) }) };
  const loadMemberships = (id) => { get_customer_memberships(id).then(response => { setMemberships(response.data) })};

  useEffect(() => loadCustomers(), []);

  useEffect(() => { setClients(customersToOptions(customers)) }, [customers]);

  const customersToOptions = (data) => {
    return data.map((customer) => {return {label: `${customer.card_id} ${customer.full_name}`, value: customer.id}})
  };

  const onChangeClient = (option) => {
    setClient(option);
    setMembership();
    loadMemberships(option.value);
  };

  const membershipItem = membership ? memberships.find(item => item.id === membership) : undefined;

  const formFields = !membershipItem ? undefined : [
    {label: 'Дата начала абонемента', name: 'enrollment_date', value: membershipItem.enrollment_date},
    {label: 'Дата окончания абонемента', name: 'expiration_date', value: membershipItem.expiration_date},
    {label: 'Дата начала заморозки абонемента', name: 'freeze_start', value: membershipItem.freeze_start},
    {label: 'Дата окончания заморозки абонемента', name: 'freeze_end', value: membershipItem.freeze_end},
    {label: 'Стоимость абонемента', name: 'cost', value: membershipItem.cost, type: 'number'},
    {label: 'Осталось обычных посещений', name: 'available_visitations', value: membershipItem.available_visitations, type: 'number'},
    {label: 'Осталось персональных посещений', name: 'available_personal', value: membershipItem.available_personal, type: 'number'},
    {label: 'Осталось групповых посещений', name: 'available_group', value: membershipItem.available_group, type: 'number'}];

  const onMembershipTypeEdit = (e) => {
    e.preventDefault();

    edit_membership(client.value, new FormData(e.target)).then(response => {
      loadMemberships(client.value);
    }).catch(error => {
      alert('Ошибка')
    });
  };

  const onMembershipTypeDelete = (e, id) => {
    e.preventDefault();

    delete_membership(client.value, id).then(response => {
      loadMemberships(client.value);
      setMembership();
    }).catch(error => {
      alert('Ошибка')
    });

  };

  return (
    <div className={"container box"}>
      <div className="columns is-marginless">
        <div className="column is-one-quarter border-right">
          <Select value={client} onChange={onChangeClient} options={clients} placeholder={'Клиент'}
            classNamePrefix={"purchase"} className={"has-margin-bottom-7"}/>

          {memberships.map((item, i) => {
            const name = item.membership_type.name;
            return (
              <div className={"has-margin-top-8 is-flex" + (item.id === membership ? " has-text-weight-bold" : "")}
                        onClick={() => setMembership(item.id)}>
                <a>{name ? name : 'Абонемент'} с {moment(item.enrollment_date, 'DD/MM/YYYY HH:mm:ss').format('LL')}
                    до {moment(item.expiration_date, 'DD/MM/YYYY HH:mm:ss').format('LL')}</a>
              </div>
            );
          })}
        </div>
        <div className="column">

          {membership &&
            <div className={'has-margin-bottom-5 has-padding-bottom-5'}>
              <SimpleUpdateDeleteForm fields={formFields}
                                      editFunc={onMembershipTypeEdit} deleteFunc={onMembershipTypeDelete}
                                      itemID={membership} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MembershipEdit;
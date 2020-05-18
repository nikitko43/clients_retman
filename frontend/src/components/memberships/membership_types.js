import {useEffect, useState} from "react";
import {
  create_membership_type, delete_membership_type,
  delete_trainer,
  edit_membership_type,
  edit_trainer,
  get_membership_types,
  membership_types
} from "../api";
import BackArrow from "../common/back_arrow";
import SimpleUpdateDeleteForm from "../common/simple_ud_form";
import React from "react";

const MembershipTypes = () => {
  const [membershipType, setMembershipType] = useState();
  const [newMembershipType, setNewMembershipType] = useState();
  const [membershipTypes, setMemberhipTypes] = useState([]);

  const getMembershipTypes = () => {
    get_membership_types().then(response => {
      setMemberhipTypes(response.data);
    })
  };

  useEffect(() => {
    getMembershipTypes();
  }, []);

  useEffect(() => {
    if (newMembershipType) {
      setMembershipType(newMembershipType);
      setNewMembershipType();
    }
  }, [membershipTypes]);

  const onMembershipTypeEdit = (e) => {
    e.preventDefault();

    edit_membership_type(new FormData(e.target)).then(response => {
      getMembershipTypes();
    }).catch(error => {
      alert('Ошибка')
    });
  };

  const onMembershipTypeDelete = (e, id) => {
    e.preventDefault();

    delete_membership_type(id).then(response => {
      setMembershipType();
      getMembershipTypes();
    }).catch(error => {
      alert('Ошибка')
    });

  };

  const onMembershipTypeCreate = () => {
    create_membership_type().then(response => {
      setNewMembershipType(response.data.id);
      getMembershipTypes();
    });
  };

  const membershipTypeItem = membershipType ? membershipTypes.find(item => item.id === membershipType) : undefined;

  const formFields = !membershipTypeItem ? undefined : [
    {label: 'Название абонемента', name: 'name', value: membershipTypeItem.name},
    {label: 'Количество обычных посещений', name: 'visitations', value: membershipTypeItem.visitations, type: 'number'},
    {label: 'Безлимитные обычные посещения', name: 'unlimited_visitations', checked: membershipTypeItem.unlimited_visitations, type: 'checkbox'},
    {label: 'Количество персональных тренировок', name: 'personal', value: membershipTypeItem.personal, type: 'number'},
    {label: 'Безлимитные персональные тренировки', name: 'unlimited_personal', checked: membershipTypeItem.unlimited_personal, type: 'checkbox'},
    {label: 'Количество групповых тренировок', name: 'group', value: membershipTypeItem.group, type: 'number'},
    {label: 'Безлимитные групповые тренировки', name: 'unlimited_group', checked: membershipTypeItem.unlimited_group, type: 'checkbox'},
    {label: 'Действует месяцев', name: 'months', value: membershipTypeItem.months, type: 'number'},
    {label: 'Стоимость', name: 'cost', value: membershipTypeItem.cost, type: 'number'}];

  return (
    <div className={"container box"}>
      <div className="columns is-marginless">
        <div className="column is-one-quarter border-right">
          {membershipTypes.map((item, i) => {
            return (
              <div className={"has-margin-top-8 is-flex " + (item.id === membershipType ? "has-text-weight-bold" : "")}
                        onClick={() => setMembershipType(item.id)}>
                <a>{item.name}</a>
              </div>
            );
          })}
          <div onClick={() => onMembershipTypeCreate()} className={"has-margin-top-8"}>
            <a><i className="fas fa-plus has-margin-right-8" />Добавить тип абонемента</a>
          </div>
        </div>
        <div className="column">

          {membershipType &&
            <div className={'has-margin-bottom-5 has-padding-bottom-5'}>
              <SimpleUpdateDeleteForm fields={formFields}
                                      editFunc={onMembershipTypeEdit} deleteFunc={onMembershipTypeDelete}
                                      itemID={membershipType} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MembershipTypes;
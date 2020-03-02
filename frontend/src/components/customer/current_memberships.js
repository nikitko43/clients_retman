import React, {useEffect, useState} from 'react';
import moment from "moment";

moment.locale('ru');

const Membership = ({membership, active}) => {
  const name = membership.membership_type.name;

  const available = [[membership.available_visitations, " посещений"], [membership.available_group, " групповых"],
                     [membership.available_personal, " персональных"]].filter(i => i[0]).map(i => i[0]+i[1]).join(', ');

  return (
    <p className={active && "is-size-5"}>
      {name ? name : 'Абонемент'} с <b>{moment(membership.enrollment_date, 'DD/MM/YYYY HH:mm:ss').format('LL')} </b>
      до <b>{moment(membership.expiration_date, 'DD/MM/YYYY HH:mm:ss').format('LL')}</b>
      {membership.available_visitations || membership.available_group || membership.available_personal
        ?
        <span>
          {" "} (осталось {available})
        </span>
        :
        ''
      }
      {membership.freeze_start && ', заморозка с ' + moment(membership.freeze_start, 'DD/MM/YYYY HH:mm:ss').format('LL') +
       ' до ' + moment(membership.freeze_end, 'DD/MM/YYYY HH:mm:ss').format('LL')}
    </p>
  );
};

const CurrentMemberships = ({memberships}) => {
  const [opened, setOpened] = useState(false);
  const current_time = moment();
  const active_memberships = memberships.filter(i => {
    return moment(i.expiration_date, 'DD/MM/YYYY HH:mm:ss') >= current_time &&
      (i.membership_type.unlimited_group || i.membership_type.unlimited_personal || i.membership_type.unlimited_visitations ||
       i.available_visitations > 0 || i.available_personal > 0 || i.available_group > 0);
  });
  const rest = memberships.filter(i => moment(i.expiration_date, 'DD/MM/YYYY HH:mm:ss') < current_time);

  const toggleMemberships = () => {
    setOpened(!opened);
  };

  const color = active_memberships[0] && active_memberships[0].color;
  const colorClass = (color === 0 ? 'background-green' : (color === 1 ? 'background-green' : ''));

  return (
    <div className={"box " + colorClass}>
      {active_memberships.length ?
        active_memberships.map(membership => <Membership membership={membership} active />) :
        'Нет абонемента'
      }
      {rest.length ?
        <>
          <p className="has-margin-top-4 has-text-grey" onClick={toggleMemberships}>
            Прошлые абонементы
            <i className={"has-margin-left-5 " + (opened ? "fas fa-angle-up" : "fas fa-angle-down")} aria-hidden="true"/>
          </p>
          {opened &&
            <div className="has-margin-top-8">
            {rest.map(membership => <Membership membership={membership}/>)}
            </div>
          }
        </>
        :
        ''
      }
    </div>
  );
};

export default CurrentMemberships;
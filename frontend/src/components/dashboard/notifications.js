import React, {useEffect, useState} from "react";
import {get_notifications} from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    get_notifications().then(response => {
      setNotifications(response.data);
    });
  }, []);

  return (
    <article className="panel">
      <p className="panel-heading">
        Уведомления
      </p>
      <div className="has-padding-6">
        {notifications.map(item => {
          return (
            <div className={"notification-text"}>
              {item.text}
              {item.customer && <a href={`/customer/${item.customer}/`} className={"is-block"}>Перейти на страницу</a>}
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default Notifications;
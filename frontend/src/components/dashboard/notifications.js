import React, {useState, useEffect} from 'react';

const Notifications = (props) => {
  return (
    <>
      <article className="message notification-widget is-dark">
        <div className="message-body">
          <button className="delete is-small" aria-label="delete" />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </article>
    </>
  )
};

export default Notifications;
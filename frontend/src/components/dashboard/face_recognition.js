import React, {useState, useEffect} from 'react';
import SimpleForm from "../common/simple_form";
import Select from "react-select";

const FaceRecognition = ({customers}) => {
  const [notificationsSocket, setNotificationSocket] = useState();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(getWSAddress());

    socket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      setNotifications(notifications => ([data, ...notifications]));
    };

    socket.onclose = function(e) {
      console.error('Notifications socket was closed unexpectedly');
    };

    setNotificationSocket(socket)
  }, []);

  const onLabelSend = (guid, label) => {
    console.log(guid, label);
    console.log(JSON.stringify({'guid': guid, 'label': label}));
    notificationsSocket.send(JSON.stringify({guid: guid, label: label}));
  };

  const onNotificationClose = (guid) => {
    setNotifications(notifications => notifications.filter(item => item.guid !== guid));
  };

  return (
    <>
      {notifications.map((item, i) => {
        return <FaceRecognitionNotification customers={customers} data={item} labelSend={onLabelSend} key={item.guid}
                                            onClose={onNotificationClose} />
      })}
    </>
  );
};

const FaceRecognitionNotification = ({customers, data, labelSend, onClose}) => {
  const [client, setClient] = useState();
  const [clients, setClients] = useState([]);
  const [train, setTrain] = useState(false);

  const handleSubmit = (type) => {
    if (type === 'confirm') { labelSend(data.guid, client.value) }
    else if (type === 'skip') { labelSend(data.guid, null) }
    else if (type === 'staff') { labelSend(data.guid, 0) }
    onClose(data.guid);
  };

  const handleClose = () => {
    if (data.label) { onClose(data.guid) }
    else { handleSubmit('skip') }
  };

  const customersToOptions = (data) => {
    return data.map((customer) => {return {label: `${customer.card_id} ${customer.full_name}`, value: customer.id}})
  };

  useEffect(() => { setClients(customersToOptions(customers)) }, [customers]);

  const customer = data.label ? customers.find(item => item.id === data.label) : undefined;

  const sendForm = () => (
    <>
      <Select value={client} onChange={(option) => setClient(option)} options={clients} placeholder={'Клиент'}
              classNamePrefix={"purchase"} className={"has-margin-bottom-7"}/>
      <a className="button has-margin-right-8 has-margin-bottom-8 is-info" onClick={() => handleSubmit('confirm')}>
        Запомнить изображение
      </a>
      <a className="button has-margin-right-8" onClick={() => handleSubmit('staff')}>Сотрудник</a>
    </>
  );

  return (
    <>
      <article className="message notification-widget is-dark">
        <div className="message-body">
          <button className="delete" aria-label="delete" onClick={handleClose}/>
          <div className="is-flex">
            <img className="face-image" src={data.image_url} />
            <div>
              {customer ?
                (
                  train ?
                    sendForm()
                    :
                    <div className={"recognition-info"}>
                      <p className={"recognition-name"}>{customer.full_name}</p>
                      <a className={"button is-info"} href={`/customer/${customer.id}/`} target="_blank"
                         rel="noopener noreferrer">Перейти на страницу</a>
                      <a className={"button"} onClick={() => setTrain(true)}>Это ошибка</a>
                    </div>
                )
                :
                sendForm()
              }
            </div>
          </div>
        </div>
      </article>
    </>
  )
};

const getWSAddress = () => {
  if (location.protocol === "https:") {
    return 'wss://' + window.location.host + '/ws/notifications/'
  }
  return 'ws://' + window.location.host + '/ws/notifications/'
};

export default FaceRecognition;
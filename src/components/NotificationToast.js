import React from 'react';

const NotificationToast = ({ notification }) => {
  return (
    <div 
      className={`notification-toast ${
        notification.show ? 'notification-show' : 'notification-hide'
      }`}
      role="alert"
    >
      <span>{notification.message}</span>
    </div>
  );
};

export default NotificationToast;
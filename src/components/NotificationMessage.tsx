import { notification } from 'antd';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

const NotificationMessage: React.FC<NotificationProps> = ({ type, message, duration = 2 }) => {
  notification[type]({
    message,
    placement: "topRight",
    duration,
    className: 'custom-notification',
  });

  return null;
};
export default NotificationMessage;


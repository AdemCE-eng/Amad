import { useEffect, useState } from 'react';
import { watch } from './firebase';
import { mergeNotifications, notificationsForRecipient } from './notifications';

export function useUserNotifications(recipientId) {
  const [state, setState] = useState({ notifications: [], loaded: false });

  useEffect(() => {
    let current = [];
    let legacy = [];
    let currentLoaded = false;
    setState({ notifications: [], loaded: false });

    const publish = () => setState({
      notifications: mergeNotifications(current, legacy),
      loaded: currentLoaded,
    });
    const unsubscribeCurrent = watch(`/userNotifications/${recipientId}`, (value) => {
      current = notificationsForRecipient(value, recipientId);
      currentLoaded = true;
      publish();
    });
    const unsubscribeLegacy = recipientId === 'rashid'
      ? watch('/user/notifications', (value) => {
          legacy = notificationsForRecipient(value, recipientId, 'rashid');
          publish();
        })
      : null;

    return () => {
      unsubscribeCurrent();
      unsubscribeLegacy?.();
    };
  }, [recipientId]);

  return {
    userNotifications: state.notifications,
    notificationsLoaded: state.loaded,
    unreadNotificationCount: state.notifications.filter((item) => !item.read).length,
  };
}

import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import NestedPageHeader from '../components/ui/NestedPageHeader';
import { api } from '../lib/api';

export default function NotificationsView({ setActiveView }) {
  const { activeRole, userNotifications, notificationsLoaded } = useAppData();
  const [readError, setReadError] = useState(false);
  const attemptedRole = useRef(null);

  useEffect(() => {
    if (!notificationsLoaded || attemptedRole.current === activeRole) return;
    attemptedRole.current = activeRole;
    setReadError(false);
    if (!userNotifications.some((item) => !item.read)) return;
    api.markAllNotificationsRead(activeRole).catch(() => setReadError(true));
  }, [activeRole, notificationsLoaded, userNotifications]);

  return (
    <div className="flex flex-col h-full bg-ink overflow-y-auto" dir="rtl">
      <NestedPageHeader title="الإشعارات" onBack={() => setActiveView('home')} />

      {readError && (
        <p className="mx-4 mb-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
          تعذر تحديث حالة القراءة. ستبقى الإشعارات ظاهرة ويمكنك المحاولة لاحقًا.
        </p>
      )}

      <div className="flex flex-col gap-3 px-4 pb-8">
        {!notificationsLoaded && <p className="p-4 text-center text-zinc-400">جارٍ تحميل الإشعارات…</p>}
        {notificationsLoaded && userNotifications.length === 0 && (
          <p className="p-8 text-center text-zinc-400">لا توجد إشعارات جديدة.</p>
        )}
        {userNotifications.map((notification) => (
          <article key={notification.id} className="rounded-2xl p-4 shadow bg-ink-card">
            <div className="flex justify-between items-start gap-3">
              <h2 className="text-white font-semibold">{notification.title}</h2>
              <time className="text-xs text-zinc-400 shrink-0">
                {new Date(notification.timestamp).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
            <p className="text-zinc-300 mt-2">{notification.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

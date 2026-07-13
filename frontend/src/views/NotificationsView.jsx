import React, {useEffect, useState} from 'react';
import { ArrowRight } from "lucide-react";
import { api } from "../lib/api";

export default function NotificationsView({ setActiveView }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.getNotifications();
        setNotifications(response.notifications ?? []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    }

    loadNotifications();
  }, []);

  useEffect(() => {
    (async () => {
      await api.markAllNotificationsRead();
   })();
  }, []);

  notifications.sort((n1, n2) => (n2.createdAt - n1.createdAt));

  return (

    <div className="flex flex-col h-full bg-ink p-4 overflow-y-auto">
        
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white">
          Notifications
        </h1>
      
        <button
          onClick={() => setActiveView("home")}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      </div>
      

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-2xl p-4 shadow bg-ink-card"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-white font-semibold">
                {notification.title}
              </h2>

              
              <span className="text-xs text-zinc-400">
                {new Date(notification.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-zinc-300 mt-2">
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
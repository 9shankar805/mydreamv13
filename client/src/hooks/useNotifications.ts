import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface NotificationData {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
        soundEnabled: true,
        pushEnabled: true
  });

  // Check browser support and current permission
  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

    const updateNotificationSettings = (newSettings: any) => {
        setNotificationSettings(newSettings);
    }

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive notifications for important updates"
        });
        return true;
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You can enable notifications in your browser settings",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  // Show browser notification
  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && isSupported) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
    return null;
  };

  // Fetch notifications from server
  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/notifications/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();

        // Filter notifications by user ID and role to ensure proper targeting
        const userNotifications = data.filter((n: NotificationData) => 
          n.userId === user.id
        );

        // Check for new notifications and play sound
        const previousNotificationIds = notifications.map(n => n.id);
        const newNotifications = userNotifications.filter((n: NotificationData) => 
          !previousNotificationIds.includes(n.id) && !n.isRead
        );

        // Handle new notifications professionally
        if (newNotifications.length > 0) {
          // Only play sound for the most recent notification to avoid spam
          const latestNotification = newNotifications[0];
          playNotificationSound(latestNotification);

          // Show desktop notification for important updates
          if ('Notification' in window && Notification.permission === 'granted') {
            const isImportant = latestNotification.title.includes('Approved') || 
                               latestNotification.message.includes('approved') ||
                               latestNotification.type === 'delivery_assignment';

            if (isImportant) {
                new Notification(latestNotification.title, {
                  body: latestNotification.message,
                  icon: '/favicon.ico',
                  tag: `important-${latestNotification.id}`,
                  requireInteraction: true,
                  // vibrate: [300, 200, 300] // Removed as not supported in all browsers
                });

                // Play celebratory second sound
                setTimeout(() => {
                  const celebraryAudio = new Audio('/notification.mp3');
                  celebraryAudio.volume = 0.5;
                  celebraryAudio.play().catch(() => {
                    console.log('Could not play celebratory sound');
                  });
                }, 500);

                // Show toast for approval
                toast({
                  title: "🎉 " + latestNotification.title,
                  description: latestNotification.message,
                  duration: 8000
                });
              }
            }
          }

        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter((n: NotificationData) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/notifications/user/${user.id}/read-all`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Poll for new notifications
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  // Show new notification when received
  const showNewNotification = (notification: NotificationData) => {
    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Professional notification sound handling
    playNotificationSound(notification);

    // Show browser notification with proper mobile support
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationOptions = {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `notification-${notification.id}`,
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200], // Mobile vibration pattern
        data: {
          id: notification.id,
          userId: notification.userId,
          timestamp: Date.now()
        }
      };

      const browserNotification = new Notification(notification.title, notificationOptions);

      browserNotification.onclick = () => {
        window.focus();
        markAsRead(notification.id);
        browserNotification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  };

  // Professional sound handling with mobile support
  const playNotificationSound = (notification: NotificationData) => {
    // Prevent multiple sounds playing simultaneously
    if (isPlayingSound) return;

    setIsPlayingSound(true);

    try {
      const audio = new Audio('/notification.mp3');

      // Professional volume levels
      const isImportantNotification = notification.title.includes('Approved') || 
                                    notification.message.includes('approved') ||
                                    notification.type === 'delivery_assignment';

      audio.volume = isImportantNotification ? 0.7 : 0.5;

      // Mobile-friendly audio handling
      audio.preload = 'auto';

      // Handle mobile audio restrictions
      const playAudio = () => {
        audio.play()
          .then(() => {
            console.log('Professional notification sound played');
          })
          .catch((error) => {
            console.log('Audio playback restricted (mobile):', error);
            // Fallback to vibration on mobile
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          })
          .finally(() => {
            setTimeout(() => setIsPlayingSound(false), 1000);
          });
      };

      // For mobile, we need user interaction first
      if (isMobileDevice()) {
        // Store the notification to play sound on next user interaction
        sessionStorage.setItem('pendingNotificationSound', 'true');
        // Use vibration instead for immediate feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        setIsPlayingSound(false);
      } else {
        playAudio();
      }

    } catch (error) {
      console.log('Error playing notification sound:', error);
      setIsPlayingSound(false);
    }
  };

  // Detect mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Play pending sounds on user interaction (mobile)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (sessionStorage.getItem('pendingNotificationSound')) {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          console.log('Could not play pending notification sound');
        });
        sessionStorage.removeItem('pendingNotificationSound');
      }
    };

    // Listen for user interactions on mobile
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Add state for sound management
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleNotification = (notification: any) => {
    try {
      showNotification(notification.title, {
        body: notification.message,
        tag: `notification-${notification.id}`
      });

      // Show toast notification for desktop with special styling for approvals
      if (window.innerWidth >= 768) {
        const isApprovalNotification = notification.title.includes('Approved');
        toast({
          title: notification.title,
          description: notification.message,
          duration: isApprovalNotification ? 8000 : 5000 // Longer duration for approvals
        });
      }
    } catch (error) {
      console.error('Error in notification handler:', error);
    }
  };

  // Subscribe to role-based notifications
  useEffect(() => {
    if (!user?.id || !user?.role) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000); // Poll every 3 seconds

    // Initial fetch
    fetchNotifications();

    return () => clearInterval(interval);
  }, [user?.id, user?.role]);



  const clearNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  return {
    isSupported,
    permission,
    notifications,
    unreadCount,
    requestPermission,
    showNotification,
    showNewNotification,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    notificationSettings,
    updateNotificationSettings
  };
}
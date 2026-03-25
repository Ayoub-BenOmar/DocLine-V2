import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  icon?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications = this.notifications$.asObservable();

  constructor() {}

  show(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      ...notification,
      duration: notification.duration || 4000
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  success(title: string, message: string, duration = 4000) {
    return this.show({
      type: 'success',
      title,
      message,
      icon: '✓',
      duration
    });
  }

  error(title: string, message: string, duration = 5000) {
    return this.show({
      type: 'error',
      title,
      message,
      icon: '✕',
      duration
    });
  }

  warning(title: string, message: string, duration = 4000) {
    return this.show({
      type: 'warning',
      title,
      message,
      icon: '!',
      duration
    });
  }

  info(title: string, message: string, duration = 4000) {
    return this.show({
      type: 'info',
      title,
      message,
      icon: 'ℹ',
      duration
    });
  }

  remove(id: string) {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }

  clear() {
    this.notifications$.next([]);
  }
}


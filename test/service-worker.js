self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Agrega aquí la lógica que deseas ejecutar cuando el usuario hace clic en la notificación
});


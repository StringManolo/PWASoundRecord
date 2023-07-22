// En este archivo puedes agregar cualquier lógica adicional que desees para tu PWA.

let registration;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        registration = reg;
        console.log('Service Worker registrado');
      })
      .catch(error => console.log('Error al registrar el Service Worker:', error));
  });
}

// Solicita al usuario el acceso al micrófono
async function getMicrophone() {
  try {
    showNotification('Solicitando acceso al micrófono...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    detectClaps(stream);
  } catch (err) {
    alert('Error al acceder al micrófono:', err);
  }
}

// Solicita al usuario el acceso a las notificaciones
function showNotification(message) {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        if (registration) {
          registration.showNotification('Notificación de Audio', {
            body: message,
            icon: 'icon-16x16.png' 
          });
        }
      }
    });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    if (registration) {
      registration.showNotification('Notificación de Audio', {
        body: message,
        icon: 'icon-16x16.png' // Reemplaza con la ruta a tu icono de notificación
      });
    }
  }
}

// Detecta el sonido de 3 aplausos consecutivos en intervalos de 1 segundo y muestra una notificación con el mensaje "Encendiendo las luces"
function detectClaps(stream) {
  showNotification('Detectando aplausos...');
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const clapThreshold = 35; // Ajusta este valor según la intensidad de los aplausos.

  let clapCount = 0;
  let lastClapTime = 0;

  analyser.fftSize = 2048;

  function checkClap() {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    dataArray.forEach(value => (sum += value));

    const average = sum / bufferLength;
  
    if (average > clapThreshold) {
      const currentTime = Date.now();
      if (currentTime - lastClapTime < 1000) {
        clapCount++;
      } else {
        clapCount = 1;
      }

      if (clapCount === 3) {
        showNotification('Encendiendo las luces...');
        clapCount = 0;
      }

      lastClapTime = currentTime;
    }

    requestAnimationFrame(checkClap);
  }

  checkClap();
}


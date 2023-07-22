// En este archivo puedes agregar cualquier lógica adicional que desees para tu PWA.

// Solicita al usuario el acceso al micrófono
// app.js
async function getMicrophone() {
  try {
    // Mostrar notificación solicitando acceso al micrófono.
    showNotification('Solicitando acceso al micrófono...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    detectClaps(stream);
  } catch (err) {
    alert('Error al acceder al micrófono:', err);
  }
}

function showNotification(message) {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(message);
      }
    });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(message);
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

  const clapThreshold = 10; // Ajusta este valor según la intensidad de los aplausos.

  let clapCount = 0;
  let lastClapTime = 0;

  analyser.fftSize = 2048;

  function checkClap() {
    showNotification('Analizando audio...');

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
        showNotification('Encendiendo las luces');
        clapCount = 0;
      }

      lastClapTime = currentTime;
    }

    requestAnimationFrame(checkClap);
  }

  checkClap();
}


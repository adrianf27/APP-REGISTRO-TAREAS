Cuaderno de tareas


Ya tienes los 7 archivos listos. Aquí tienes cómo funciona todo:

Qué subir a GitHub — sube estos archivos a la misma carpeta del repo (junto al registro-tareas.html que ya tenías, sustituyéndolo por este nuevo):

manifest.json — la "ficha" de la app: nombre, icono, color, y que abra en modo pantalla completa (standalone) en vez de como pestaña del navegador.
service-worker.js — un scriptito que el navegador ejecuta en segundo plano, aparte de la página.
icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png — los iconos, en los tamaños que exige cada sistema (el "maskable" es para que Android lo recorte en círculo/redondeado sin que se corte mal).

Qué hace cada pieza al abrir la web desde el móvil:

El navegador lee <link rel="manifest"> en el HTML y encuentra manifest.json. Si cumple los requisitos (icono, HTTPS, service worker), te ofrece "Añadir a pantalla de inicio" — Chrome en Android incluso muestra un banner automático; en iPhone es manual desde el menú "Compartir → Añadir a pantalla de inicio".
Una vez instalada, se abre como una app normal: icono propio, sin barra de direcciones, con el color theme-color en la barra de estado.
El service-worker.js se registra la primera vez que visitas la página (con conexión) y guarda una copia del HTML, el manifest y los iconos en una caché del propio navegador. Así, si abres la app sin cobertura, sigue cargando igual — y como ahora mismo tus tareas viven en localStorage, seguirás pudiendo leerlas y editarlas sin conexión sin ningún problema extra.
Cada vez que abras la app con conexión, el service worker compara con la red y actualiza la caché en segundo plano, así que cuando subas cambios nuevos al repo, se van refrescando solos.

Importante: esto solo funciona servido por HTTPS (GitHub Pages ya lo da gratis) — si abres el HTML como archivo local (file://) para probarlo, el navegador bloquea el service worker por seguridad, así que la mejor forma de probarlo es directamente sobre la URL de GitHub Pages una vez publicado.

Cuando más adelante conectes la app a Supabase, el service-worker.js ya está preparado para dejar pasar esas peticiones directas a la red sin interferir en la caché.

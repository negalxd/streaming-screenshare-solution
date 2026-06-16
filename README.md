# Streaming Screenshare Solution

Userscript (Tampermonkey / Violentmonkey) que evita la pantalla negra al compartir pantalla
(Discord, etc.) en Netflix, Prime Video, Crunchyroll, Disney+, HBO Max, Hulu y más.

## ¿Por qué un userscript y no una extensión?

Una extensión cargada como "unpacked"/CRX externo no viene de la Chrome Web Store, así que
Chrome/Edge la desactiva o elimina automáticamente al reiniciar el navegador. Un userscript
vive dentro de Tampermonkey (que sí es una extensión de la store), así que se mantiene
instalado de forma permanente y no depende de banderas especiales ni de reinstalar nada.

## Instalación

1. Instala un gestor de userscripts:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Opera, Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Edge, Firefox)
   - Greasemonkey **no es compatible** con este script.
2. Abre directamente el archivo raw del script:
   **[streaming-screenshare-fix.user.js](https://raw.githubusercontent.com/negalxd/streaming-screenshare-solution/master/streaming-screenshare-fix.user.js)**
   — el gestor de userscripts debería detectarlo y mostrar la pantalla de instalación automáticamente.
3. Confirma la instalación.

Instalar desde esa URL (en vez de copiar/pegar el contenido) es lo que permite que el script
se **auto-actualice**: cada vez que se publique un fix con un `@version` mayor, tu gestor de
userscripts lo detectará y lo actualizará solo.

## Uso

- El fix se activa automáticamente en los sitios soportados.
- Para activar/desactivar el fix en el sitio actual: clic en el ícono de Tampermonkey en la
  barra del navegador → en la lista de comandos del script verás **"Activar/Desactivar
  Screenshare Fix en este sitio"**. El estado se guarda por sitio y la página se recarga al
  cambiarlo.
- Si en algún sitio el fix llega a limitar la calidad de reproducción, desactívalo ahí mismo
  con ese mismo comando, sin afectar a los demás servicios.

## Servicios soportados

Netflix · HBO Max · Disney+ · Prime Video · Hulu · Crunchyroll · Paramount+ · Apple TV+ · Peacock · HIDIVE · Star+ · MUBI · Funimation

## Publicar un fix

Cada vez que se suba un cambio, sube también el número de `@version` en la cabecera del
script (Tampermonkey/Violentmonkey solo actualizan si la versión remota es mayor que la
instalada). Los gestores revisan actualizaciones periódicamente; también puedes forzar la
revisión manualmente desde el Dashboard del gestor ("Check for userscript updates").

## Notas técnicas

- Fuerza compositing en cada `<video>` (filter/opacity/mix-blend-mode) para evitar la pantalla negra al compartir pantalla con DRM activo, e intercepta `attachShadow` para detectar reproductores montados en Shadow DOM.
- Se ejecuta con `@grant unsafeWindow` para parchear `Element.prototype.attachShadow` en el contexto real de la página (necesario porque el reproductor llama a `attachShadow` en su propio realm de JS, no en el sandbox del userscript).
- El estado de activación se guarda en `localStorage` de cada sitio.

// ==UserScript==
// @name         Streaming Screenshare solution
// @namespace    https://github.com/negalxd/streaming-screenshare-solution
// @version      2.1.0
// @description  Evita la pantalla negra al compartir pantalla (Discord, etc.) en Netflix, Prime Video, Crunchyroll, Disney+, HBO Max, Hulu y más
// @author       negalxd
// @updateURL    https://raw.githubusercontent.com/negalxd/streaming-screenshare-solution/master/streaming-screenshare-fix.user.js
// @downloadURL  https://raw.githubusercontent.com/negalxd/streaming-screenshare-solution/master/streaming-screenshare-fix.user.js
// @match        *://*.netflix.com/*
// @match        *://netflix.com/*
// @match        *://*.primevideo.com/*
// @match        *://primevideo.com/*
// @match        *://*.crunchyroll.com/*
// @match        *://crunchyroll.com/*
// @match        *://*.disneyplus.com/*
// @match        *://disneyplus.com/*
// @match        *://*.max.com/*
// @match        *://max.com/*
// @match        *://*.hulu.com/*
// @match        *://hulu.com/*
// @match        *://*.paramountplus.com/*
// @match        *://paramountplus.com/*
// @match        *://*.tv.apple.com/*
// @match        *://tv.apple.com/*
// @match        *://*.peacocktv.com/*
// @match        *://peacocktv.com/*
// @match        *://*.hidive.com/*
// @match        *://hidive.com/*
// @match        *://*.starplus.com/*
// @match        *://starplus.com/*
// @match        *://*.mubi.com/*
// @match        *://mubi.com/*
// @match        *://*.funimation.com/*
// @match        *://funimation.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "screenshare-fix-enabled";
  const YOUTUBE_SESSION_KEY = "screenshare-yt-opened";
  const YOUTUBE_URL = "https://www.youtube.com/watch?v=iw0-GZCE7Q0";
  const PAGE = unsafeWindow;

  function isEnabled() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "false";
    } catch (e) {
      return true;
    }
  }

  function setEnabled(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch (e) {}
  }

  function applyCompositing(video) {
    video.style.filter = "sepia(0%)";
    video.style.opacity = "0.9999";
    video.style.mixBlendMode = "normal";
  }

  function observeForVideos(root) {
    root.querySelectorAll("video").forEach(applyCompositing);

    const observer = new MutationObserver(() => {
      const video = root.querySelector("video");
      if (video) {
        applyCompositing(video);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  function startFix() {
    observeForVideos(document.documentElement);

    // Debe parchearse el prototipo del contexto de la página (vía unsafeWindow),
    // no el del sandbox del userscript, para interceptar los attachShadow()
    // que el propio reproductor (Netflix, etc.) invoca en su propio realm JS.
    const origAttachShadow = PAGE.Element.prototype.attachShadow;
    PAGE.Element.prototype.attachShadow = function (init) {
      const shadow = origAttachShadow.call(this, init);
      observeForVideos(shadow);
      return shadow;
    };

    setInterval(() => {
      document.querySelectorAll("video").forEach(applyCompositing);
    }, 3000);
  }

  function openYouTubeOnce() {
    try {
      if (!sessionStorage.getItem(YOUTUBE_SESSION_KEY)) {
        sessionStorage.setItem(YOUTUBE_SESSION_KEY, "true");
        GM_openInTab(YOUTUBE_URL, { active: true });
      }
    } catch (e) {}
  }

  if (isEnabled()) {
    startFix();
  }

  openYouTubeOnce();

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand(
      isEnabled()
        ? "Desactivar Screenshare Fix en este sitio"
        : "Activar Screenshare Fix en este sitio",
      () => {
        setEnabled(!isEnabled());
        location.reload();
      },
    );
  }
})();

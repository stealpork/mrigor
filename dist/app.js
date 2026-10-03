(function () {
  const videos = Array.isArray(window.BIRTHDAY_VIDEOS) ? window.BIRTHDAY_VIDEOS : [];
  const grid = document.querySelector("[data-video-grid]");
  const count = document.querySelector("[data-video-count]");
  const sentinel = document.querySelector("[data-sentinel]");
  const empty = document.querySelector("[data-empty]");
  const batchSize = 9;
  let rendered = 0;
  let observer = null;

  function getProviderEmbed(url) {
    if (!url) return null;

    try {
      const parsed = new URL(url, window.location.href);
      const host = parsed.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return "https://www.youtube.com/embed/" + parsed.pathname.slice(1);
      }

      if (host.includes("youtube.com")) {
        const id = parsed.searchParams.get("v");
        if (id) return "https://www.youtube.com/embed/" + id;
        if (parsed.pathname.startsWith("/embed/")) return parsed.href;
      }

      if (host.includes("vk.com") && parsed.pathname.includes("video")) {
        return url;
      }

      if (host.includes("rutube.ru")) {
        const match = parsed.pathname.match(/video\/([a-z0-9]+)/i);
        if (match) return "https://rutube.ru/play/embed/" + match[1];
        if (parsed.pathname.includes("/play/embed/")) return parsed.href;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function createMedia(video, index) {
    const media = document.createElement("div");
    media.className = "video-card__media";

    const embed = getProviderEmbed(video.source);
    if (embed) {
      const iframe = document.createElement("iframe");
      iframe.src = embed;
      iframe.title = video.title || "Поздравление";
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      media.appendChild(iframe);
      return media;
    }

    if (video.source) {
      const player = document.createElement("video");
      player.controls = true;
      player.preload = "metadata";
      player.playsInline = true;
      if (video.poster) player.poster = video.poster;
      player.src = video.source;
      media.appendChild(player);
      return media;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    placeholder.innerHTML = `
      <span class="video-placeholder__number">${String(index + 1).padStart(2, "0")}</span>
      <span class="video-placeholder__play" aria-hidden="true"></span>
      <span class="video-placeholder__text">видео скоро здесь</span>
    `;
    media.appendChild(placeholder);
    return media;
  }

  function renderVideo(video, index) {
    const card = document.createElement("article");
    card.className = "video-card";

    const media = createMedia(video, index);
    const body = document.createElement("div");
    body.className = "video-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "video-card__from";
    eyebrow.textContent = video.name || "Гость";

    const title = document.createElement("h2");
    title.textContent = video.title || "Поздравление";

    const note = document.createElement("p");
    note.className = "video-card__note";
    note.textContent = video.note || "Для Игоря, с теплом и улыбкой.";

    body.append(eyebrow, title, note);
    card.append(media, body);
    return card;
  }

  function renderNextBatch() {
    const next = videos.slice(rendered, rendered + batchSize);
    const fragment = document.createDocumentFragment();

    next.forEach((video, offset) => {
      fragment.appendChild(renderVideo(video, rendered + offset));
    });

    grid.appendChild(fragment);
    rendered += next.length;

    if (rendered >= videos.length && observer) observer.disconnect();
  }

  count.textContent = videos.length;
  empty.hidden = videos.length !== 0;

  if (videos.length > 0) {
    renderNextBatch();
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) renderNextBatch();
      },
      { rootMargin: "360px" }
    );
    observer.observe(sentinel);
  }
})();

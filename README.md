# Видеоальбом для Игоря

Сайт лежит в `dist/`. Видео добавляются в `dist/data/videos.js`.

Пример записи:

```js
{
  name: "Аня",
  title: "С днем рождения!",
  note: "Очень короткая подпись под роликом.",
  source: "videos/anya.mp4",
  poster: "posters/anya.jpg"
}
```

В `source` можно указать:

- локальный файл, например `videos/anya.mp4`;
- ссылку YouTube вида `https://www.youtube.com/watch?v=...`;
- ссылку Rutube вида `https://rutube.ru/video/...`;
- готовую embed-ссылку VK/Rutube/YouTube.

Количество записей в массиве не ограничено версткой. Страница добавляет карточки порциями по 3, чтобы не создавать все видеоплееры сразу.

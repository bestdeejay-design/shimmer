# Shimmer

**English** · [Русский](README.ru.md)

[![Читать онлайн](https://img.shields.io/badge/%D0%A7%D0%B8%D1%82%D0%B0%D1%82%D1%8C-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD-3b82f6?style=for-the-badge&logo=readthedocs&logoColor=white)](https://bestdeejay-design.github.io/shimmer/)

> Death is not the end. Consciousness does not die — it resonates.
> The question is only: who will hear it.

**Shimmer** is a transmedia sci-fi saga about consciousness after death, the
Psi-Stream, and two souls that find each other across a thousand years.

## The Universe

### What Is the Shimmer?

Shimmer is the state of consciousness after physical death where the person
continues to exist in the Psi-Stream. It is not an afterlife, not heaven, not
reincarnation — it is the **trace** a consciousness leaves behind in the
living fabric of the Stream.

When a body dies, the person inside does not notice the transition. They are
still *here* — only the body is no longer required. They can see, hear, feel —
not through organs, but directly, through the Stream.

A shimmering consciousness is like a candle flame in total darkness. It stays
alight as long as it has fuel:

- **Memories** — the richer the life, the longer the Shimmer.
- **Love** — being remembered by connected consciousnesses sustains it.
- **Will** — the desire to remain. Some hold on longer because they refuse to
  fade.

### Galactic Clock

The galaxy completes a full rotation once every **12,000 years**, divided into
12 **Galactic Hours** — 1,000 years each. The Psi-Stream responds to this
rotation like an ocean to the Moon:

- Each Hour has its own "tide" of the Stream.
- Each Hour births its own **Architect** — the one who resonates loudest in
  that time segment.
- After 1,000 years, an ordinary Shimmer fades into the deep Stream.
- After 12,000 years, when the cycle returns to the same phase, **every
  Shimmer of that Hour resumes** — not reincarnation, but **resonance**.

### The Architects

**Lira** is an Architect at the end of her 1,000-year Shimmer. She spent
almost all of it building a Path for **Kai** — a boy from a desert world
where the Shimmer is a forgotten knowledge and death means true oblivion.
Kai's dreams are not madness — they are contact.

Their meeting in the Shimmer is the rarest and greatest happiness the Stream
can offer: two shimmering consciousnesses that found each other.

## The Books

### Book of Kai
Kai lives on a desert world where the Shimmer is forgotten. People die for
real — buried in sand, forgotten in a generation. His dreams are bridges to
a voice that has been waiting for a thousand years.

- **Status**: Complete — 12 chapters.
- **Language**: Russian.

### Book of Lira
Lira's story — from life to Shimmer to the creation of the Path. What she
sacrificed, what she built, and who she was before she became a legend.

- **Status**: In progress (prologue + chapter 1).
- **Language**: Russian.

### Lore Files
Seven reference documents covering the Psi-Stream, Shimmer mechanics, the
Galactic Clock, the Architects, and the structure of the universe.

## The Reader

The saga is published as an **mdBook** reader with custom features:

| Feature | Description |
|---|---|
| Tap / swipe navigation | Previous / next chapter by tapping or swiping the edges |
| Swipe to close sidebar | Swipe left dismisses the table of contents with an overlay |
| Progress bar | Bottom bar showing chapter progress; click to seek |
| Auto-hide header | Header hides on scroll (Kindle style) |
| Reading progress | Saved to `localStorage` with a "Continue" banner |
| Fade-in animation | Chapters transition in smoothly |
| Offline support | Service Worker caches every page |
| Reading percentage | Per-chapter scroll progress |
| Settings | Font size (14–26), line height (1.4–2.2), max width (580–860), theme (Auto/Light/Rust/Coal/Navy/Ayu), background (normal/sepia/night), print |

All settings persist in `localStorage` under `shimmer-settings`.

### Tech Stack

- **mdBook** v0.5.4 — static site generator
- **GitHub Pages** — hosting
- **Custom JS/CSS** — `custom/custom.js` + `custom/custom.css`
- **Service Worker** — offline cache

## Try It

[**Read Shimmer online**](https://bestdeejay-design.github.io/shimmer/)

## Project Structure

```
shimmer/
├── files/
│   ├── kai/       # Book of Kai — 12 chapters
│   ├── lira/      # Book of Lira — prologue + chapter 1
│   ├── lore/      # 7 lore reference files
│   ├── SUMMARY.md # Table of contents
│   └── sw.js      # Service Worker
├── custom/
│   ├── custom.js  # Reader features
│   └── custom.css # Custom styles
├── archive/       # Previous versions
├── book.toml      # mdBook config
└── .github/workflows/deploy.yml
```

## License

MIT — see [LICENSE](LICENSE).

---

*The galaxy turns. The Stream listens. The Shimmer waits.*

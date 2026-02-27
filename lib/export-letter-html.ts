/**
 * Generates a self-contained HTML file: closed envelope → click → open → letter unfolds.
 * All CSS/JS inline for standalone use.
 */

import type { SavedLetterState, DecoElement } from "./letter-store"

const INK_HEX: Record<string, string> = {
  brown: "#4a3728",
  navy: "#2a3a5c",
  black: "#3a3330",
}

const WASHI_HEX: Record<string, string> = {
  pink: "#f5cdd2",
  green: "#c2dcc8",
  yellow: "#f5e5a8",
  blue: "#c0d4e8",
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function decorationToHtml(deco: DecoElement): string {
  const { type, data, x, y, rotation = 0 } = deco
  const style = `position:absolute;left:${x}px;top:${y}px;transform:rotate(${rotation}deg);`
  if (type === "washi") {
    const color = WASHI_HEX[data.color] || WASHI_HEX.pink
    return `<div class="deco-washi" style="${style}background:${color};width:112px;height:28px;border-radius:4px;opacity:0.85;box-shadow:0 1px 4px rgba(0,0,0,0.08);"></div>`
  }
  if (type === "sticker") {
    const stickerType = data.stickerType || "heart"
    const svgs: Record<string, string> = {
      heart: '<path d="M20 35 C10 25 2 18 2 12 C2 6 7 2 12 2 C16 2 19 5 20 7 C21 5 24 2 28 2 C33 2 38 6 38 12 C38 18 30 25 20 35Z" fill="#e8a0a0" stroke="#d48080" stroke-width="0.5" opacity="0.85"/>',
      star: '<path d="M20 3 L24 15 L37 15 L27 23 L30 36 L20 28 L10 36 L13 23 L3 15 L16 15Z" fill="#f0d080" stroke="#d4b060" stroke-width="0.5" opacity="0.85"/>',
      flower: '<circle cx="20" cy="12" r="6" fill="#f0c4c8" opacity="0.8"/><circle cx="28" cy="18" r="6" fill="#f0c4c8" opacity="0.8"/><circle cx="26" cy="28" r="6" fill="#f0c4c8" opacity="0.8"/><circle cx="14" cy="28" r="6" fill="#f0c4c8" opacity="0.8"/><circle cx="12" cy="18" r="6" fill="#f0c4c8" opacity="0.8"/><circle cx="20" cy="20" r="5" fill="#f0e0a0"/>',
      butterfly: '<ellipse cx="13" cy="15" rx="10" ry="8" fill="#b8d4c0" opacity="0.8" transform="rotate(-20 13 15)"/><ellipse cx="27" cy="15" rx="10" ry="8" fill="#b8d4c0" opacity="0.8" transform="rotate(20 27 15)"/><line x1="20" y1="10" x2="20" y2="34" stroke="#7a6b5d" stroke-width="1"/>',
      sun: '<circle cx="20" cy="20" r="8" fill="#f0d890" opacity="0.85"/><line x1="20" y1="20" x2="20" y2="6" stroke="#e8c060" stroke-width="2" stroke-linecap="round" opacity="0.7"/><line x1="20" y1="20" x2="20" y2="34" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="6" y2="20" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="34" y2="20" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="8" y2="8" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="32" y2="32" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="8" y2="32" stroke="#e8c060" stroke-width="2" opacity="0.7"/><line x1="20" y1="20" x2="32" y2="8" stroke="#e8c060" stroke-width="2" opacity="0.7"/>',
    }
    const svg = svgs[stickerType] || svgs.heart
    return `<div class="deco-sticker" style="${style}"><svg viewBox="0 0 40 40" width="40" height="40">${svg}</svg></div>`
  }
  if (type === "photo" && data.src) {
    return `<div class="deco-photo" style="${style}"><div class="polaroid-wrap"><img src="${escapeHtml(data.src)}" alt="Photo" style="width:100%;height:100%;object-fit:cover;display:block;"/></div></div>`
  }
  return ""
}

function letterContentHtml(letter: SavedLetterState): string {
  const ink = INK_HEX[letter.inkColor] || INK_HEX.brown
  const fontClass = letter.fontStyle === "handwriting" ? "letter-handwriting" : "letter-serif"
  const pages = [
    { date: letter.date, greeting: letter.greeting, text: letter.text, signature: letter.signature },
    ...(letter.additionalPages || []).map((p) => ({ date: "", greeting: "", text: p.text, signature: "" })),
  ]
  const pagesHtml = pages
    .map(
      (p) => `
    <div class="letter-page ${fontClass}">
      ${p.date ? `<div class="letter-date" style="color:${ink}">${escapeHtml(p.date)}</div>` : ""}
      ${p.greeting ? `<div class="letter-greeting" style="color:${ink}">${escapeHtml(p.greeting)}</div>` : ""}
      <div class="letter-body" style="color:${ink}">${escapeHtml(p.text).replace(/\n/g, "<br/>")}</div>
      ${p.signature ? `<div class="letter-signature" style="color:${ink}">${escapeHtml(p.signature)}</div>` : ""}
    </div>`
    )
    .join("")
  const decosHtml = (letter.decorations || [])
    .map(decorationToHtml)
    .join("")
  return `
  <div class="letter-paper">
    <div class="letter-pages-wrap">${pagesHtml}</div>
    <div class="letter-decorations">${decosHtml}</div>
  </div>`
}

export function buildInteractiveLetterHtml(letter: SavedLetterState): string {
  const letterContent = letterContentHtml(letter)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your Letter</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: #faf7f5; font-family: Georgia, serif; color: #3a3330; display: flex; align-items: center; justify-content: center; padding: 24px; }
.stage { position: relative; width: 100%; max-width: 420px; min-height: 320px; cursor: pointer; perspective: 900px; }
.envelope-wrap { position: relative; width: 100%; transition: transform 0.4s ease; transform-style: preserve-3d; }
.stage.opened .envelope-wrap { transform: scale(0.92); opacity: 0; pointer-events: none; transition: transform 0.5s ease, opacity 0.4s ease; }
.envelope { position: relative; width: 100%; aspect-ratio: 4/3; max-height: 280px; background: #fef3ed; border-radius: 12px; box-shadow: 0 8px 32px rgba(58,51,48,0.12); overflow: hidden; transform-style: preserve-3d; }
.envelope-flap { position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(180deg, #f9e8dd 0%, #f0ddd0 100%); clip-path: polygon(0 0, 50% 85%, 100% 0); transform-origin: top center; transition: transform 0.65s ease; border-bottom: 1px solid #e5ddd8; backface-visibility: hidden; }
.stage.opened .envelope-flap { transform: rotateX(-150deg); }
.envelope-body { position: absolute; bottom: 0; left: 0; right: 0; height: 55%; background: #fef3ed; border: 1px solid #e5ddd8; border-bottom: none; border-radius: 0 0 12px 12px; }
.letter-reveal { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s ease 0.4s; }
.stage.opened .letter-reveal { opacity: 1; pointer-events: auto; }
.letter-folded { position: relative; width: 92%; max-width: 380px; border-radius: 8px; overflow: hidden; transform-origin: center top; transform: scaleY(0.08); opacity: 0; transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s, opacity 0.35s ease 0.5s; box-shadow: 0 4px 24px rgba(58,51,48,0.1); }
.stage.opened .letter-folded { transform: scaleY(1); opacity: 1; }
.letter-paper { position: relative; width: 100%; min-height: 400px; padding: 24px 32px 32px; background: #fef9f6; border-radius: 8px; box-shadow: 0 4px 24px rgba(58,51,48,0.08); }
.letter-pages-wrap { position: relative; z-index: 2; }
.letter-page { margin-bottom: 24px; }
.letter-page:last-child { margin-bottom: 0; }
.letter-date { text-align: right; font-size: 14px; opacity: 0.7; margin-bottom: 8px; }
.letter-greeting { font-size: 18px; margin-bottom: 12px; }
.letter-body { white-space: pre-wrap; font-size: 16px; line-height: 1.7; }
.letter-serif .letter-body { font-style: italic; }
.letter-handwriting { font-family: cursive, serif; letter-spacing: 0.02em; }
.letter-signature { text-align: right; font-size: 18px; margin-top: 16px; }
.letter-decorations { position: absolute; left: 0; top: 0; right: 0; bottom: 0; pointer-events: none; z-index: 5; }
.deco-sticker svg { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1)); }
.polaroid-wrap { width: 128px; padding: 8px 8px 32px 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.polaroid-wrap img { width: 100%; height: auto; display: block; }
.hint { text-align: center; margin-top: 16px; font-size: 14px; color: #8a817c; }
</style>
</head>
<body>
<div class="stage" id="stage" role="button" tabindex="0" aria-label="Click to open envelope">
  <div class="envelope-wrap">
    <div class="envelope">
      <div class="envelope-flap"></div>
      <div class="envelope-body"></div>
    </div>
  </div>
  <div class="letter-reveal">
    <div class="letter-folded">${letterContent}</div>
  </div>
</div>
<p class="hint">Click the envelope to open your letter</p>
<script>
(function(){
  var stage = document.getElementById('stage');
  function open() {
    stage.classList.add('opened');
    stage.removeEventListener('click', open);
    stage.removeAttribute('tabindex');
  }
  stage.addEventListener('click', open);
  stage.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
})();
</script>
</body>
</html>`
}

export function downloadLetterAsHtml(letter: SavedLetterState, filename = "letter.html"): void {
  const html = buildInteractiveLetterHtml(letter)
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

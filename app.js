// ================== ROULETTE LOGIC ==================
const canvas = document.getElementById("wheel");
const ctx    = canvas.getContext("2d");

const spinBtn  = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");

const resultTitle = document.getElementById("resultTitle");
const resultDesc  = document.getElementById("resultDesc");
const ctaBox      = document.getElementById("ctaBox");
const ctaPrimary  = document.getElementById("ctaPrimary");
const spinCountEl = document.getElementById("spinCount");

let spins = 0;

// Define roulette items with label, description and CTA data
const items = [
  {
    label: "BitradeX（仮想通貨）",
    desc: "ボラが欲しい日。迷うならまず口座を作って“触る”。情報収集より行動が早い人が勝つ局面が多い。",
    ctaText: "BitradeXで口座開設",
    url: "https://www.bitradex.com/ja/account/register?inviteCode=GCM9Y6",
  },
  {
    label: "XM（海外FX）",
    desc: "まずは安心して始めたい日。ボーナスと日本語サポートを使って“環境に慣れる”のが最短ルート。",
    ctaText: "XMで口座開設",
    url: "https://clicks.affstrack.com/c?c=1036417&l=ja&p=1",
  },
  {
    label: "Miltonmarkets（海外FX）",
    desc: "回転させたい日。スプレッドとボーナスのバランスで“攻める”選択肢。",
    ctaText: "Miltonmarketsへ",
    url: "https://portal.miltonmarkets.com/ja/links/go/2589",
  },
  {
    label: "EBC（海外FX）",
    desc: "コスト重視の日。短期ほどスプレッドが効く。余計な支払いを減らして手残りを増やす。",
    ctaText: "EBCで口座開設",
    url: "https://www.toebc.com/hagakure358",
  },
  {
    label: "XS.com（マルチアセット）",
    desc: "FXだけじゃ飽きない日。指数・コモディティもまとめて触って、得意な値動きを探す。",
    ctaText: "XS.comへ",
    url: "https://my.xs.com/ja/links/go/4125",
  },
  {
    label: "TradersTrust（ハイレバ）",
    desc: "攻めの日。ただし守りが前提。ロットを上げる前に、損切りと資金管理の型を決める。",
    ctaText: "TradersTrustへ",
    url: "https://my.traders-trust.com/ja/links/go/2006",
  },
  {
    label: "Vantage（海外FX）",
    desc: "バランスの日。条件を崩さずに、手数とボーナスを両方取りに行く。",
    ctaText: "Vantageへ",
    url: "https://www.vantagetradings.com/open-live-account/?affid=MTAzMDI4OQ==",
  },
];

// Prepare canvas for high-DPI devices
const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
canvas.width  = 520 * DPR;
canvas.height = 520 * DPR;
canvas.style.width  = "520px";
canvas.style.height = "520px";
ctx.scale(DPR, DPR);

const W = 520;
const H = 520;
const cx = W / 2;
const cy = H / 2;
const radius = 220;

let angle = -Math.PI / 2; // start with pointer at top
let spinning = false;

function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function drawWheel() {
  ctx.clearRect(0, 0, W, H);
  // Outer glow ring
  const ring = ctx.createRadialGradient(cx, cy, radius - 40, cx, cy, radius + 30);
  ring.addColorStop(0, "rgba(255,255,255,.06)");
  ring.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = ring;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 22, 0, Math.PI * 2);
  ctx.fill();

  const seg = (Math.PI * 2) / items.length;
  for (let i = 0; i < items.length; i++) {
    const a0 = angle + i * seg;
    const a1 = a0 + seg;
    // Alternating luxe colors
    const isEven = i % 2 === 0;
    const grad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
    grad.addColorStop(0, isEven ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.06)");
    grad.addColorStop(1, isEven ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.02)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, a0, a1);
    ctx.closePath();
    ctx.fill();
    // Separator line
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * radius, cy + Math.sin(a0) * radius);
    ctx.stroke();
    // Label
    const mid = (a0 + a1) / 2;
    ctx.save();
    ctx.translate(cx + Math.cos(mid) * (radius * 0.66), cy + Math.sin(mid) * (radius * 0.66));
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.font = "700 15px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(items[i].label, 0, 0, 200);
    ctx.restore();
  }
  // center cap
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,.40)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.stroke();
  // inner badge
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.08)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.font = "800 13px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SPIN", cx, cy);
  // Subtle vignette
  const vignette = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,.35)");
  ctx.fillStyle = vignette;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function getSelectedIndex() {
  const seg = (Math.PI * 2) / items.length;
  const normalized = (-(angle + Math.PI / 2) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
  return Math.floor(normalized / seg) % items.length;
}

function showResult(idx) {
  const it = items[idx];
  resultTitle.textContent = it.label;
  resultDesc.textContent  = it.desc;
  ctaPrimary.textContent = it.ctaText;
  ctaPrimary.href = it.url;
  ctaBox.classList.remove("hidden");
}

function spin() {
  if (spinning) return;
  spinning = true;
  spins += 1;
  spinCountEl.textContent = `spins: ${spins}`;
  const start = angle;
  const spinsCount = 6 + Math.random() * 3;
  const targetExtra = Math.random() * Math.PI * 2;
  const target = start + spinsCount * Math.PI * 2 + targetExtra;
  const duration = 2200 + Math.random() * 700;
  const t0 = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - t0) / duration);
    const e = easeOutCubic(t);
    angle = lerp(start, target, e);
    drawWheel();
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      const idx = getSelectedIndex();
      showResult(idx);
    }
  }
  requestAnimationFrame(frame);
}

function reset() {
  if (spinning) return;
  angle = -Math.PI / 2;
  resultTitle.textContent = "まだ回してない";
  resultDesc.textContent  = "迷ってるなら回して決める。決めたら行動する。これだけで勝率が上がる。";
  ctaBox.classList.add("hidden");
  drawWheel();
}

spinBtn.addEventListener("click", spin);
resetBtn.addEventListener("click", reset);
drawWheel();

// ================== STICKY CTA & EXIT MODAL ==================
const ctaRoulette = document.getElementById("ctaRoulette");
ctaRoulette.addEventListener("click", () => {
  const el = document.getElementById("roulette");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Exit intent logic
let exitShown = false;
const exitModal = document.getElementById("exitModal");
const showExit = () => {
  if (exitShown) return;
  exitShown = true;
  exitModal.style.display = "block";
};
document.getElementById("exitClose").onclick = () => {
  exitModal.style.display = "none";
};
// Desktop: detect mouse leaving top of page
document.addEventListener("mouseout", (e) => {
  if (exitShown) return;
  if (!e.relatedTarget && e.clientY <= 0) showExit();
});
// Scroll detection: show near bottom
window.addEventListener("scroll", () => {
  if (exitShown) return;
  const scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
  if (scrolled > 0.82) showExit();
});

// ================== FAQ Chatbot ==================
const BOT = {
  links: {
    line: "https://lin.ee/2FzSpbW",
    discord: "https://discord.gg/U9EmTGdRcb",
    youtube: "https://www.youtube.com/channel/UCxqDxNLp1QjwobtXvoSzUAw",
  },
  faq: [
    {
      q: "ボーナスが強い海外FXは？",
      keywords: ["ボーナス","口座開設","入金","海外fx","証拠金"],
      a: "ボーナス重視なら『口座開設ボーナス』『入金ボーナス』『出金条件』の3点で見よう。まずは候補を2〜3社に絞って、条件を公式で確認するのが最短。",
      related: [
        { title: "海外FXのボーナス比較の見方", url: "/articles/guides/bonus-howto.html" },
      ],
    },
    {
      q: "低スプレッドでスキャルピング向きは？",
      keywords: ["低スプレッド","スキャル","約定","手数料","ecm","ecn"],
      a: "短期売買はスプレッド＋手数料＋約定のセット。数字だけで選ぶと事故る。口座タイプ（STP/ECN）までセットで決めると迷いが消える。",
      related: [
        { title: "スプレッドと手数料の本当の見方", url: "/articles/guides/spread-fee.html" },
      ],
    },
    {
      q: "仮想通貨取引所はどこがいい？",
      keywords: ["仮想通貨","取引所","現物","先物","レバレッジ","手数料"],
      a: "仮想通貨は『取扱い銘柄』『手数料』『流動性』『出金のしやすさ』が核心。初心者はまず現物→慣れたら先物、が安全。",
      related: [
        { title: "仮想通貨取引所の選び方", url: "/articles/guides/crypto-exchange.html" },
      ],
    },
  ],
};
const botFab   = document.getElementById("botFab");
const botPanel = document.getElementById("botPanel");
const botClose = document.getElementById("botClose");
const botLog   = document.getElementById("botLog");
const botInput = document.getElementById("botInput");
const botSend  = document.getElementById("botSend");

function addMsg(role, text) {
  const div = document.createElement("div");
  div.style.padding = "10px 12px";
  div.style.borderRadius = "14px";
  div.style.maxWidth = "92%";
  div.style.lineHeight = "1.7";
  if (role === "user") {
    div.style.marginLeft = "auto";
    div.style.background = "rgba(255,255,255,.08)";
    div.textContent = text;
  } else {
    div.style.background = "rgba(25,195,125,.12)";
    div.innerHTML = text;
  }
  botLog.appendChild(div);
  botLog.scrollTop = botLog.scrollHeight;
}

function scoreMatch(query, item) {
  const q = query.toLowerCase();
  let s = 0;
  item.keywords.forEach((k) => {
    if (q.includes(k.toLowerCase())) s += 2;
  });
  q.split(/\s+/).forEach((w) => {
    if (w && item.q.toLowerCase().includes(w)) s += 1;
  });
  return s;
}

function answer(query) {
  const scored = BOT.faq
    .map((item) => ({ item, score: scoreMatch(query, item) }))
    .sort((a, b) => b.score - a.score);
  const top = scored[0];
  if (!top || top.score === 0) {
    addMsg(
      "bot",
      `目的だけ教えて。<br>例）ボーナス重視 / 低スプレッド / 仮想通貨 / コピートレード<br><br>すぐ答える：<a href="${BOT.links.line}" target="_blank" rel="noopener" style="color:#19c37d;font-weight:900;">公式LINE</a> / <a href="${BOT.links.discord}" target="_blank" rel="noopener" style="color:#8aa2ff;font-weight:900;">Discord</a>`
    );
    return;
  }
  const rel = (top.item.related || [])
    .map((r) => `<li><a href="${r.url}" style="color:#fff;text-decoration:underline;">${r.title}</a></li>`)
    .join("");
  addMsg(
    "bot",
    `${top.item.a}<br><br><div style="color:#cfcfe6;font-weight:800;margin-bottom:6px;">関連：</div><ul style="margin:0 0 10px 18px;padding:0;color:#cfcfe6;">${rel}</ul><div style="display:flex;gap:8px;flex-wrap:wrap;"><a href="${BOT.links.line}" target="_blank" rel="noopener" style="padding:8px 10px;border-radius:12px;background:linear-gradient(135deg,#19c37d,#0f7b52);color:#07140f;font-weight:900;text-decoration:none;">公式LINE</a><a href="${BOT.links.discord}" target="_blank" rel="noopener" style="padding:8px 10px;border-radius:12px;background:linear-gradient(135deg,#5865F2,#2b36b6);color:#fff;font-weight:900;text-decoration:none;">Discord</a></div><div style="margin-top:8px;color:#8b8ba7;font-size:12px;">※最終判断は自己責任。条件は必ず公式で確認。</div>`
  );
}

botFab.onclick = () => {
  botPanel.style.display = "block";
  if (!exitShown) {
    addMsg("bot", "聞きたいことを一言でOK。目的に合わせて迷いを消す。");
  }
};
botClose.onclick = () => {
  botPanel.style.display = "none";
};
botSend.onclick = () => {
  const q = botInput.value.trim();
  if (!q) return;
  addMsg("user", q);
  botInput.value = "";
  answer(q);
};
botInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") botSend.click();
});
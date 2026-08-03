# BizCard QR Kod Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kartvizitin altına, `qrcode.react` ile render edilen ve projenin GitHub Pages canlı adresine yönlenen bir QR kod eklemek.

**Architecture:** `index.html`'deki mevcut React/ReactDOM/Babel (UMD) bloğu değiştirilmez. Ayrı bir `<script type="module">` + `<script type="importmap">` çifti eklenir; bu, `qrcode.react`'i esm.sh üzerinden, kendi izole React/ReactDOM ES modül kopyasıyla (ana sayfanın UMD React'inden bağımsız) yükleyip `#qr-slot` DOM düğümüne render eder.

**Tech Stack:** Düz HTML/CSS/JS, React 18 (UMD, mevcut) + React 18 (ESM, sadece QR modülü için, esm.sh CDN üzerinden), `qrcode.react@4`.

## Global Constraints

- Tek dosya, kurulum yok: hiçbir npm/build adımı eklenmez; her şey CDN script tag'leri üzerinden yüklenir (spec: Teknik Yaklaşım).
- QR'ın kodladığı sabit değer: `https://secilsarigl.github.io/bizcard-miuul/` (spec: Veri).
- QR panelinde başlık/açıklama metni yok, sade tasarım (spec: Yerleşim ve Stil).
- Mevcut kartın işlevleri (Rehbere Ekle, E-posta, sosyal linkler) hiçbir şekilde değiştirilmez veya bozulmaz (spec: Test Planı).
- Hata yönetimi minimaldir: CDN yüklenemezse `#qr-slot` sessizce boş kalır, ana kart etkilenmez (spec: Hata Yönetimi).

---

### Task 1: QR panelini ve modül script'ini index.html'e ekle

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: `#qr-slot` id'li bir `<div>` (DOM'da, `.qr-panel` sınıflı bir kapsayıcı içinde), `LIVE_URL = "https://secilsarigl.github.io/bizcard-miuul/"` sabiti (module script içinde, module script dışından erişilmez — kapsam sadece bu script).
- Consumes: Yok (mevcut Babel/React bloğundan bağımsız).

- [ ] **Step 1: CSS — body'yi dikey flex'e çevir ve `.qr-panel` sınıfını ekle**

`index.html` içindeki mevcut body kuralını bul:

```css
  body{
    margin:0;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:32px 16px;
    font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
    background:radial-gradient(circle at top left, var(--bg-2), var(--bg-1));
  }
```

Şununla değiştir (yeni: `flex-direction:column;` ve `gap:20px;` eklendi — şu an tek çocuk olduğu için mevcut görünümü bozmaz, ikinci panel eklenince onu kartın altına dizecek):

```css
  body{
    margin:0;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:20px;
    padding:32px 16px;
    font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
    background:radial-gradient(circle at top left, var(--bg-2), var(--bg-1));
  }
```

`.footer-note` kuralının hemen altına (kapanış `</style>` etiketinden önce) yeni bir kural ekle:

```css
  .qr-panel{
    width:100%;
    max-width:380px;
    background:var(--card-bg);
    border-radius:var(--radius);
    box-shadow:0 15px 40px rgba(0,0,0,.25);
    padding:20px;
    display:flex;
    align-items:center;
    justify-content:center;
  }
```

- [ ] **Step 2: HTML — QR panelini ve import map'i ekle**

`<div id="root"></div>` satırının hemen altına ekle:

```html
  <div id="root"></div>

  <div class="qr-panel">
    <div id="qr-slot"></div>
  </div>
```

Sayfanın `<head>` bölümünde, `</head>` kapanışından hemen önce import map'i ekle (module script'in `"react"` / `"react-dom/client"` bare specifier'larını çözmesi için gerekli):

```html
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom/client": "https://esm.sh/react-dom@18/client"
    }
  }
  </script>
```

- [ ] **Step 3: JS — QR'ı render eden module script'i ekle**

Mevcut `</script>` (Babel bloğunun kapanışı) ile `</body>` arasına, yeni bir `<script type="module">` bloğu ekle:

```html
  <script type="module">
    import React from "react";
    import { createRoot } from "react-dom/client";
    import { QRCodeSVG } from "https://esm.sh/qrcode.react@4?external=react,react-dom";

    const LIVE_URL = "https://secilsarigl.github.io/bizcard-miuul/";
    const slot = document.getElementById("qr-slot");

    if (slot) {
      createRoot(slot).render(React.createElement(QRCodeSVG, { value: LIVE_URL, size: 150 }));
    }
  </script>
```

- [ ] **Step 4: Yapısal doğrulama (otomatik test altyapısı yok — grep tabanlı kontrol)**

Run:
```bash
grep -c 'id="qr-slot"' index.html
grep -c 'qrcode.react' index.html
grep -c 'secilsarigl.github.io/bizcard-miuul' index.html
grep -c 'type="importmap"' index.html
```
Expected: her komut `1` veya daha büyük bir sayı döndürmeli (0 dönerse ilgili adım eksik demektir).

- [ ] **Step 5: Tarayıcıda manuel doğrulama**

`index.html` dosyasını bir tarayıcıda aç (yerel dosya olarak veya `python -m http.server` ile). Doğrula:
- Kartın hemen altında, beyaz bir panel içinde QR kodu görünüyor.
- Kartın mevcut işlevleri (Rehbere Ekle, E-posta, sosyal linkler) hâlâ çalışıyor.
- Tarayıcı konsolunda QR ile ilgili bir hata yok.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add QR code panel pointing to GitHub Pages URL

Renders qrcode.react's QRCodeSVG into an isolated ES module React
instance, separate from the page's existing UMD React setup, so the
demo card's existing behavior is untouched.
EOF
)"
git push
```

---

### Task 2: GitHub Pages'i etkinleştir ve canlı adresi doğrula

**Files:** Yok (repo ayarı, kod değişikliği değil).

**Interfaces:**
- Consumes: Task 1'in push edilmiş `index.html`'i (repo kökünde, `master` branch).
- Produces: Çalışan bir GitHub Pages sitesi, `https://secilsarigl.github.io/bizcard-miuul/`.

- [ ] **Step 1: Pages'i `master` branch / kök dizinden etkinleştir**

Run:
```bash
gh api -X POST repos/secilsarigl/bizcard-miuul/pages -f "source[branch]=master" -f "source[path]=/"
```
Expected: JSON yanıtında `"status":"building"` veya `"status":null` ve `"html_url":"https://secilsarigl.github.io/bizcard-miuul/"` görünür. Zaten etkinse `422` hatası alınır — bu durumda Step 2'ye geç.

- [ ] **Step 2: Pages durumunu kontrol et**

Run:
```bash
gh api repos/secilsarigl/bizcard-miuul/pages --jq '.status, .html_url'
```
Expected: `status` alanı `"built"` olana kadar birkaç dakika içinde tekrar dene (GitHub Pages ilk build birkaç dakika sürebilir).

- [ ] **Step 3: Canlı adresi doğrula**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://secilsarigl.github.io/bizcard-miuul/
```
Expected: `200`.

- [ ] **Step 4: QR'ın gerçekten bu adrese yönlendiğini doğrula**

Bir telefonla (veya tarayıcının QR okuma özelliğiyle) Task 1'de eklenen QR kodu okut. Açılan adresin `https://secilsarigl.github.io/bizcard-miuul/` olduğunu ve kartvizitin orada doğru göründüğünü doğrula.

- [ ] **Step 5: Commit gerekmiyor**

Bu görev yalnızca repo ayarı içerir, kod değişikliği yoktur — commit adımı yok.

---
name: bizcard-conventions
description: Use when adding, editing, or reviewing components in BizCard's index.html, or when wiring the "Kartı Kaydet" (save card) or "Toplantı Talep Et" (request meeting) actions to a webhook endpoint.
---

# BizCard Conventions

## Overview
BizCard'ın bileşen yazım kuralları ve webhook veri sözleşmesi için tek referans.

## Bileşen Kuralları

1. **Kurulum yok, tek HTML dosyası** — React/ReactDOM/Babel CDN üzerinden yüklenir, npm/build adımı yok. Tüm bileşenler `index.html` içindeki `<script type="text/babel">` bloğunda tanımlanır; ayrı `.jsx`/`.tsx` dosyalarına bölünmez.
2. **Sadece fonksiyon bileşeni** — class component yazılmaz; state/efekt gerekiyorsa hook kullanılır (`useState`, `useMemo` vb.).
3. **Demo veri `src/data/card.js`'de** — kart içeriği (isim, unvan, iletişim, sosyal linkler) component kodundan ayrı tutulur. Bu dosya modül sistemi kullanmaz (import/export yok); bir global değişkene atama yapar ve `index.html`'e Babel script'inden **önce** düz bir `<script src="src/data/card.js"></script>` ile yüklenir.

Örnek `src/data/card.js`:
```js
window.BIZCARD_DATA = {
  initials: "SS",
  name: "Seçil Sarıgül",
  title: "Computer Vision Mühendisi",
  phone: "+90 543 854 31 38",
  phoneHref: "+905438543138",
  email: "secil.sarigl@gmail.com",
  tagline: "BizCard projesi kapsamında geliştirildi",
  socials: [
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Instagram", href: "#", icon: "instagram" },
  ],
};
```

`index.html` içinde kullanımı:
```html
<script src="src/data/card.js"></script>
<script type="text/babel">
  const PROFILE = window.BIZCARD_DATA;
  // ...bileşenler PROFILE'ı kullanır
</script>
```

> Not: `index.html` şu an demo veriyi hâlâ inline (`PROFILE` objesi doğrudan Babel script'inde) tutuyor. Bu kurala geçiş için verinin `src/data/card.js`'e taşınması gerekiyor — henüz yapılmadı.

## Webhook Veri Sözleşmesi

İki eylem, bir webhook endpoint'ine JSON POST eder. Ortak zarf (envelope):

```json
{
  "event": "card.save | meeting.request",
  "timestamp": "ISO 8601 UTC",
  "payload": { }
}
```

### 1. Kartı Kaydet — `event: "card.save"`
Ziyaretçi kartı kendi rehberine/CRM'sine kaydetmek istediğinde tetiklenir.

```json
{
  "event": "card.save",
  "timestamp": "2026-08-02T15:04:00Z",
  "payload": {
    "card": {
      "name": "Seçil Sarıgül",
      "title": "Computer Vision Mühendisi",
      "phone": "+905438543138",
      "email": "secil.sarigl@gmail.com"
    },
    "source": {
      "userAgent": "string",
      "referrer": "string | null"
    }
  }
}
```

### 2. Toplantı Talep Et — `event: "meeting.request"`
Ziyaretçi kart sahibinden toplantı talep ettiğinde tetiklenir.

```json
{
  "event": "meeting.request",
  "timestamp": "2026-08-02T15:06:00Z",
  "payload": {
    "requester": {
      "name": "string",
      "email": "string",
      "phone": "string | null"
    },
    "message": "string | null",
    "preferredDate": "ISO 8601 date | null",
    "cardOwner": {
      "name": "Seçil Sarıgül",
      "email": "secil.sarigl@gmail.com"
    }
  }
}
```

## Alan Kuralları
- `timestamp` her zaman ISO 8601, UTC.
- Telefon alanları E.164 formatında (`+` ile başlayan, boşluksuz).
- Opsiyonel alanlar `null` olarak gönderilir, alan hiç eksik bırakılmaz.
- `event` bir discriminator'dır; yeni bir eylem eklenince yeni `event` değeri + `payload` şekli tanımlanır, mevcut şekiller geriye dönük uyumluluk için değiştirilmez.

## Notlar
- Backend teknolojisi henüz seçilmedi (bkz. CLAUDE.md → Teknoloji Yığını: TBD); endpoint URL'si ve auth mekanizması backend seçildiğinde bu dosyaya eklenmeli.

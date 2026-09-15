# BizCard

Kullanıcıların bilgilerini girerek dijital kartvizit ve QR kod oluşturabileceği bir web uygulaması.

**Canlı demo:** https://bizcard-miuul-chi.vercel.app/

## Proje Hakkında

BizCard, uçtan uca çalışan, gösterilebilir bir ürün örneği olarak geliştiriliyor — küçük ama tam bir sistem (frontend + backend + veri akışı) kurma pratiği.

**Hedef kitle:** Serbest çalışanlar, KOBİ sahipleri, etkinlik/networking katılımcıları ve fiziksel kartvizit yerine dijital çözüm arayan bireyler.

## Durum

Proje erken aşamada. Şu an demo bir dijital kartvizit arayüzü (`index.html`) mevcut; backend teknolojisi henüz seçilmedi.

## Yapı

- `web/index.html` — kurulum gerektirmeyen, React/ReactDOM/Babel CDN üzerinden çalışan demo kartvizit arayüzü
- `mobile/` — Expo/React Native ile yazılmış mobil uygulama (Expo Go uyumlu, native kişiler izni dahil)
- `.claude/skills/bizcard-conventions/` — bileşen yazım kuralları ve webhook veri sözleşmesi referansı
- `CLAUDE.md` — proje bağlamı, hedefler ve sonraki adımlar

Mobil uygulamayı çalıştırmak için: `cd mobile && npx expo start`, ardından açılan QR kodu Expo Go uygulamasıyla tara.

## "Kartı Kaydet" vs "Telefonuma Ekle"

Mobil uygulamada kartvizit sahibini rehbere ekleyen iki farklı eylem var:

- **Telefonuma Ekle** (`AddToContactsPanel`) — tek dokunuşlu, bağımsız bir buton. Sadece kartvizit sahibinin bilgilerini (ad, e-posta, telefon) ziyaretçinin rehberine ekler; form yok, backend'e bir şey gönderilmez.
- **Kartı Kaydet** (`CardActionsForm`) — önce ziyaretçinin adı/e-postası ve Gizlilik Politikası onayı isteniyor. Onaylandıktan sonra hem kartvizit sahibi rehbere ekleniyor hem de `card.save` event'i n8n webhook'una gönderiliyor (yani kart sahibine "şu kişi kartı kaydetti" bilgisi/lead kaydı ulaşıyor).

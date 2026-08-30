# BizCard

## Proje Özeti
BizCard, kullanıcıların bilgilerini girerek dijital kartvizit ve QR kod oluşturabileceği bir web uygulaması. Bu proje aynı zamanda Seçil'in portföyünde "uçtan uca çalışan, gösterilebilir bir ürün" örneği olarak yer alacak — küçük ama tam bir sistem (frontend + backend + veri akışı) kurma pratiği.

## Bu Proje Neden Var (Portföy Bağlamı)
- Amaç sadece "çalışan bir kartvizit uygulaması" değil, iş başvurularında gösterilebilecek, uçtan uca düşünme sürecini kanıtlayan bir örnek.
- İleride bu projeye QR kod üzerinden görüntü işleme (örn. kartvizitten bilgi okuma/OCR) gibi bir CV modülü eklenirse, kimya + bilgisayar mühendisliği kesişimini gösterecek bir vitrine dönüşebilir. Şimdilik bu bir olasılık, zorunlu değil.

## Hedef Kitle
- Serbest çalışanlar / freelancerlar
- KOBİ sahipleri ve girişimciler
- Etkinlik/networking katılımcıları (fuar, konferans vb.)
- Fiziksel kartvizit yerine dijital çözüm arayan bireyler

## Hedef Sektörler
- Danışmanlık ve profesyonel hizmetler
- Bilişim/Teknoloji
- Eğitim
- Emlak
- Etkinlik organizasyonu

Not: Bu liste ilk varsayımdır, ürünü gerçek kullanıcılarla test ettikçe güncellenmeli.

## Durum Notu
Proje erken aşamada ama artık boş değil: `index.html` içinde, kurulum gerektirmeyen, React/ReactDOM/Babel CDN üzerinden çalışan tek dosyalık bir demo dijital kartvizit mevcut ve kartın altında, canlı Vercel adresine (https://bizcard-miuul-chi.vercel.app/) yönlendiren bir QR kod paneli var. Backend henüz seçilmedi (TBD).

Proje artık bir monorepo: `web/` altında değişmeden duran statik web demosu, `mobile/` altında ise Expo/React Native ile yazılmış, Expo Go üzerinde çalışan bir mobil uygulama var. Mobil uygulama web ile aynı özellik setini sunar; ek olarak native kişiler (contacts) izni ister ve "Kartı Kaydet"/"Kişilerime Ekle" eylemlerinde kartviziti doğrudan cihaz rehberine ekler.

## Teknoloji Yığını
- **Web** (`web/`): Statik HTML + React/ReactDOM/Babel (CDN üzerinden, build adımı yok).
- **Mobil** (`mobile/`): Expo (JavaScript, blank template) + React Native core bileşenleri. Bağımlılıklar: `expo-contacts` (native kişiler izni), `expo-linear-gradient`, `react-native-svg` + `react-native-qrcode-svg` (QR kod), `@react-native-community/datetimepicker`, `@expo/vector-icons`. Tümü Expo Go uyumlu; custom native kod veya config-plugin yok.
- **Backend:** Henüz seçilmedi (TBD) — form eylemleri şu an sadece `console.log` üretir.

## Geliştirme Komutları
- **Web:** Kurulum gerekmez; `web/index.html` dosyasını doğrudan bir tarayıcıda aç.
- **Mobil:** `cd mobile && npx expo start` — açılan QR kodu Expo Go uygulamasıyla tarayarak veya bir emülatörle çalıştır.

## Klasör Yapısı
```
BizCard/
  web/
    index.html          — statik web demosu (değişmedi)
  mobile/
    App.js
    src/
      data/card.js       — PROFILE verisi
      components/        — Avatar, ContactList, SocialLinks, ProfileCard,
                            CardActionsForm, AddToContactsPanel,
                            PrivacyPolicyModal, QRPanel
      lib/
        contacts.js       — expo-contacts izin + rehbere ekleme
        events.js         — card.save / meeting.request event üretimi
```

## Sonraki Adımlar
- [x] Teknoloji yığınına karar ver (web: statik HTML, mobil: Expo/React Native)
- [x] Proje iskeletini oluştur (mobile/ Expo scaffold)
- [x] Build/test/lint komutlarını tanımla
- [x] Bu dosyayı gerçek mimari ve konvansiyonlarla güncelle
- [ ] (İleri aşama) QR/OCR modülü ekleme fikrini değerlendir — CV alanına köprü olabilir
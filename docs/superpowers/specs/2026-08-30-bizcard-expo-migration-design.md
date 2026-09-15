# BizCard: Expo Mobil Uygulaması Ekleme (Monorepo Taşıma)

## Bağlam ve Amaç

BizCard şu an tek bir statik `index.html` dosyası (React/ReactDOM/Babel CDN üzerinden çalışan, build adımı olmayan bir web demosu) ve bu dosyayı barındıran bir Vercel deploy'undan oluşuyor. QR kod paneli, canlı Vercel URL'sine (`https://bizcard-miuul-chi.vercel.app/`) yönleniyor.

Bu spec, projeyi bir **monorepo**'ya dönüştürerek yanına bir **Expo/React Native mobil uygulaması** ekler. Web sürümü aynen korunur (Vercel + QR kod akışı bozulmaz); mobil uygulama web ile aynı özellik setini (tam parite) sunar ve ek olarak **native contacts (kişiler) izni** ister — "Kartı Kaydet" ve "Kişilerime Ekle" eylemleri artık dosya indirmek yerine kullanıcının telefon rehberine doğrudan kayıt ekler. Uygulama **Expo Go** üzerinden, herhangi bir native build/prebuild adımı gerekmeden çalışabilmelidir.

## Kapsam Dışı

- Backend/webhook entegrasyonu (CLAUDE.md'de TBD; hem web hem mobil tarafta form eylemleri hâlâ sadece `console.log` üretir).
- Otomatik test altyapısı (mevcut projede de yok).
- EAS Build / standalone binary üretimi, app store dağıtımı.
- Web ve mobil arasında kod paylaşımı için ortak bir paket/workspace kurulumu (örn. Yarn workspaces) — iki proje bağımsız kod tabanları olarak kalır, sadece veri şekli (PROFILE) ve webhook event şeması kavramsal olarak birebir örtüşür.

## Repo Yapısı

```
BizCard/
  web/
    index.html                 ← mevcut içerik aynen taşınır, değiştirilmez
  mobile/
    app.json
    package.json
    App.js
    src/
      data/
        card.js                 ← PROFILE verisi, ES module export
      components/
        Avatar.js
        ContactList.js
        SocialLinks.js
        CardActionsForm.js
        AddToContactsPanel.js
        PrivacyPolicyModal.js
        ProfileCard.js
        QRPanel.js
      lib/
        contacts.js              ← expo-contacts: izin isteme + rehbere ekleme
        events.js                ← card.save / meeting.request event üretimi (console.log)
  docs/superpowers/...
  CLAUDE.md
  README.md
```

`web/` taşıması sadece dosya konumunu değiştirir; `index.html` içeriği bit-bit aynı kalır. Vercel projesinin **Root Directory** ayarının `web` olarak güncellenmesi gerekir — bu, Vercel dashboard üzerinden elle yapılması gereken bir adımdır ve bu spec'in kapsamı dışındadır (kullanıcı tarafından yapılacak); eğer repo kökünde bir `vercel.json` bulunursa, `web/` alt dizinini işaret edecek şekilde güncellenir.

## Mobil Mimari

- Tek ekran, navigation kütüphanesi yok: `App.js` doğrudan `ProfileCard` + `AddToContactsPanel` + `QRPanel` + `PrivacyPolicyModal`'ı bir `ScrollView` içinde render eder (web'deki `App` bileşeninin birebir karşılığı).
- Tüm bileşenler fonksiyon bileşenidir (web konvansiyonuyla tutarlı), `View`/`Text`/`TouchableOpacity`/`TextInput`/`Modal`/`ScrollView` + `StyleSheet.create` kullanılır.
- **İkonlar:** `@expo/vector-icons` (Expo Go'da hazır gelir, ek kurulum gerekmez). Feather set: `phone`, `mail`, `plus`, `calendar`, `user-plus`. FontAwesome: `linkedin`, `github`.
- **Gradient header:** `expo-linear-gradient`.
- **QR panel:** `react-native-qrcode-svg` + `react-native-svg`, aynı `LIVE_URL` sabitini (`https://bizcard-miuul-chi.vercel.app/`) gösterir.
- **Tarih seçimi:** `@react-native-community/datetimepicker`.
- **Onay (consent) kutusu:** native `Switch` (React Native core, ekstra paket gerektirmez) — web'deki checkbox'ın işlevsel karşılığı.
- **Gizlilik politikası modalı:** RN'in yerleşik `Modal` bileşeni + `ScrollView` içinde `Text` başlık/paragraf/liste öğeleriyle, web'deki `PrivacyPolicyModal` içeriğinin birebir metin karşılığı.

Tüm paketler **Expo Go uyumlu**dur; hiçbiri custom native kod veya config-plugin gerektirmez — `npx expo start` ile Expo Go üzerinden doğrudan çalışır.

## Contacts (Kişiler) İzni Akışı

`expo-contacts` paketi kurulur. **`app.json`'a özel izin metni ekleyen bir config plugin eklenmez** — bu, native prebuild gerektirir ve Expo Go uyumluluğunu kırar. Bunun yerine Expo Go'nun içinde zaten bundled gelen varsayılan izin metni kullanılır.

`src/lib/contacts.js`:
```js
import * as Contacts from 'expo-contacts';

export async function addOwnerToDeviceContacts(profile) {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    return { added: false, reason: 'permission-denied' };
  }

  const [lastName, ...rest] = profile.name.split(' ');
  const firstName = rest.join(' ');

  await Contacts.addContactAsync({
    [Contacts.Fields.FirstName]: firstName,
    [Contacts.Fields.LastName]: lastName,
    [Contacts.Fields.Company]: profile.title,
    [Contacts.Fields.PhoneNumbers]: [
      { label: 'mobile', number: profile.phoneHref },
    ],
    [Contacts.Fields.Emails]: [
      { label: 'work', email: profile.email },
    ],
  });

  return { added: true };
}
```

İzin reddedilirse (`status !== 'granted'`) kullanıcıya bir `Alert.alert(...)` ile kısa bir bilgilendirme gösterilir ("Rehbere eklemek için kişiler izni gerekiyor."); işlem sessizce başarısız olmaz.

## "Kartı Kaydet" Davranış Değişikliği (Web → Mobil Uyarlaması)

Web'de "Kartı Kaydet" butonu `.vcf` dosyası indirir (`downloadVCard` — tarayıcıya özgü bir kavram, RN'de doğrudan karşılığı yok). Mobilde bu buton **aynı `addOwnerToDeviceContacts` fonksiyonunu** çağırır — yani "Kartı Kaydet" ve "Kişilerime Ekle" mobilde aynı native rehbere-ekleme davranışını tetikler.

Form (`CardActionsForm`) davranışı korunur:
- Ziyaretçi adı, e-postası (zorunlu) ve tercih edilen tarih (sadece "Toplantı Talep Et" için zorunlu) toplanır.
- "Kartı Kaydet" gönderiminde: `addOwnerToDeviceContacts(profile)` çağrılır + `card.save` event'i `console.log`'a yazılır.
- "Toplantı Talep Et" gönderiminde: sadece `meeting.request` event'i `console.log`'a yazılır (contacts'a dokunmaz).
- Gönderim sırasında butonlar disable edilir (mevcut web davranışıyla aynı, 800ms debounce).

## Webhook Event Uyarlaması (`src/lib/events.js`)

Ortak zarf (envelope) `bizcard-conventions` ile birebir aynı kalır:
```json
{ "event": "card.save | meeting.request", "timestamp": "ISO 8601 UTC", "payload": { } }
```

`payload.source` alanı web'e özgü (`userAgent`, `referrer`) olduğundan mobilde şu şekilde uyarlanır:
```json
"source": {
  "platform": "ios | android",
  "referrer": null
}
```
(`Platform.OS` kullanılarak.) `card`, `savedBy`, `requester`, `cardOwner`, `preferredDate` alanları web ile birebir aynı şekildedir. Bu, `bizcard-conventions` SKILL.md'sinde **yeni bir event şekli** olarak görülmemeli — mevcut `card.save`/`meeting.request` şemasının platforma göre `source` alanı farklılaşan aynı sözleşmesidir. Gerçek bir backend/webhook entegre edildiğinde bu ayrım netleştirilecek.

## PROFILE Verisi (`mobile/src/data/card.js`)

Web'deki inline `PROFILE` objesiyle birebir aynı veriler, ES module export olarak:
```js
export const PROFILE = {
  initials: "SS",
  name: "Seçil Sarıgül",
  title: "Computer Vision Mühendisi",
  phone: "+90 543 854 31 38",
  phoneHref: "+905438543138",
  email: "secil.sarigl@gmail.com",
  tagline: "BizCard projesi kapsamında geliştirildi",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/secil-sarigul/", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/secilsarigl", icon: "github" },
  ],
};
```
Not: `bizcard-conventions` SKILL.md, web tarafı için de veri ayrıştırmasını öngörüyor (`src/data/card.js`, henüz uygulanmadı) ama bu web dosyasının global `window.BIZCARD_DATA` deseni mobildeki ES module deseninden farklıdır — ikisi ayrı konvansiyonlardır, bu spec sadece mobil tarafı kapsar.

## Bağımlılıklar (mobile/package.json)

- `expo-contacts`
- `expo-linear-gradient`
- `react-native-svg`, `react-native-qrcode-svg`
- `@react-native-community/datetimepicker`
- `@expo/vector-icons` (Expo SDK ile zaten gelir, ayrıca `expo install` gerekmeyebilir — kurulum sırasında doğrulanacak)

Hepsi `npx expo install <paket>` ile SDK-uyumlu versiyonlarla kurulacak.

## Dokümantasyon Güncellemeleri

- **CLAUDE.md**: "Teknoloji Yığını" (artık TBD değil — web: statik HTML/React CDN, mobil: Expo/React Native/JavaScript), "Klasör Yapısı" (yukarıdaki ağaç), "Geliştirme Komutları" (`cd mobile && npx expo start` — Expo Go ile QR kod okutarak veya emülatörle açma; web tarafı için komut yok, statik dosya) bölümleri gerçek bilgiyle doldurulur. "Sonraki Adımlar" listesindeki ilgili maddeler işaretlenir/güncellenir.
- **README.md**: Yapı bölümüne `web/` ve `mobile/` klasörleri eklenir, mobil uygulamayı Expo Go ile çalıştırma adımı kısaca belirtilir.

## Test/Doğrulama Planı

Otomatik test yok (mevcut projede de yok). Manuel doğrulama:
1. `npx expo start` ile mobil uygulamayı Expo Go üzerinden (fiziksel cihaz veya emülatör) açma.
2. Kartın (avatar, isim, unvan, telefon/e-posta, sosyal linkler) doğru render edildiğini görsel olarak doğrulama.
3. "Kartı Kaydet" ve "Toplantı Talep Et" formlarını doldurup gönderme; console'da (Expo dev tools / Metro log) doğru `card.save`/`meeting.request` event JSON'unun basıldığını doğrulama.
4. "Kişilerime Ekle" ve "Kartı Kaydet" ile contacts izni isteme: izin verildiğinde kişinin gerçekten cihaz rehberine eklendiğini, reddedildiğinde uyarı gösterildiğini doğrulama.
5. QR panelinin göründüğünü ve doğru URL'i kodladığını doğrulama.
6. Web tarafının (`web/index.html`) taşımadan sonra hiçbir davranış değişikliği olmadan aynı şekilde çalıştığını (yerel olarak dosyayı açarak) doğrulama.

## Açık Riskler / Notlar

- `expo-contacts`'ın Expo Go'daki varsayılan izin metni İngilizce/genel bir metindir (Türkçe özelleştirme yapılamaz — bu, config plugin + prebuild gerektirir ve Expo Go uyumluluğunu bozar). Bu, bilinçli bir ödünleşimdir.
- Vercel Root Directory güncellemesi bu spec'in kapsamı dışında, kullanıcı tarafından yapılacak bir dashboard adımıdır; uygulama tarafında sadece dosya taşınır ve varsa `vercel.json` güncellenir.

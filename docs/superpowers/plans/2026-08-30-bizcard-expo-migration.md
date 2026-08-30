# BizCard Expo Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Expo/React Native mobile app (`mobile/`) with full feature parity to the existing web BizCard demo, plus a native contacts-permission flow, while keeping the web app (`web/`) unchanged and the mobile app runnable in Expo Go with no prebuild.

**Architecture:** Monorepo split — `web/index.html` (untouched, moved as-is) and a new `mobile/` Expo app built from bottom-up presentational components (Avatar, ContactList, SocialLinks) composed into `ProfileCard`, plus `AddToContactsPanel` (native contacts), `CardActionsForm` (visitor form wired to contacts + console-logged webhook events), `PrivacyPolicyModal`, and `QRPanel`, all assembled in `App.js`.

**Tech Stack:** Expo (JavaScript, blank template), React Native core components, `expo-contacts`, `expo-linear-gradient`, `react-native-svg` + `react-native-qrcode-svg`, `@react-native-community/datetimepicker`, `@expo/vector-icons` — all Expo Go compatible, no config plugins, no prebuild.

**Spec:** [docs/superpowers/specs/2026-08-30-bizcard-expo-migration-design.md](../specs/2026-08-30-bizcard-expo-migration-design.md)

## Global Constraints

- Web içeriği (`index.html`) bit-bit aynı kalmalı — sadece `web/` altına taşınır, hiçbir satırı değişmez.
- Mobil uygulama **Expo Go uyumlu** olmalı: hiçbir custom native kod veya config-plugin eklenmeyecek (özellikle `expo-contacts` için app.json'a izin metni plugin'i eklenmeyecek).
- Dil: **JavaScript** (TypeScript değil).
- Otomatik test altyapısı yok; doğrulama Expo Go üzerinden manuel yapılır.
- Tüm bağımlılıklar `npx expo install <paket>` ile (SDK-uyumlu versiyon için) kurulur.
- Webhook/backend entegrasyonu yok — form eylemleri sadece `console.log` üretir, aynı `{event, timestamp, payload}` zarfını kullanır.
- "Kartı Kaydet" ve "Kişilerime Ekle" mobilde aynı `addOwnerToDeviceContacts` fonksiyonunu çağırır (dosya indirme yok).

---

### Task 1: Web uygulamasını `web/` klasörüne taşı

**Files:**
- Move: `index.html` → `web/index.html`

**Interfaces:**
- Consumes: yok.
- Produces: `web/index.html` (içerik değişmeden), sonraki hiçbir task'ın bağımlılığı değil.

- [ ] **Step 1: Dosyayı taşı**

```bash
mkdir web
git mv index.html web/index.html
```

- [ ] **Step 2: Doğrula**

`web/index.html` dosyasını bir tarayıcıda aç (dosya yolunu doğrudan tarayıcıya sürükle veya `file://` ile aç). Beklenen: kart, form, QR panel ve "Telefonuma Ekle" paneli taşımadan önceki gibi birebir aynı görünüyor ve çalışıyor (hiçbir davranış değişmedi).

Repo kökünde `vercel.json` yoksa (bu depoda yok), ek bir yapılandırma adımı gerekmez — Vercel projesinin **Root Directory** ayarının `web` olarak güncellenmesi kullanıcı tarafından Vercel dashboard'unda ayrıca yapılacaktır (bu adımın kapsamı dışında).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Move web app into web/ directory for monorepo split"
```

---

### Task 2: Expo mobil projesini oluştur ve bağımlılıkları kur

**Files:**
- Create: `mobile/` (tüm Expo iskelet dosyaları — `App.js`, `app.json`, `package.json`, vb.)

**Interfaces:**
- Consumes: yok.
- Produces: çalışan bir Expo Go iskeleti; sonraki tüm task'lar `mobile/` içinde çalışır ve bu adımda kurulan paketleri kullanır: `expo-contacts`, `expo-linear-gradient`, `react-native-svg`, `react-native-qrcode-svg`, `@react-native-community/datetimepicker`, `@expo/vector-icons`.

- [ ] **Step 1: Expo projesini oluştur**

```bash
npx create-expo-app@latest mobile --template blank
```

- [ ] **Step 2: Gerekli paketleri kur**

```bash
cd mobile
npx expo install expo-contacts expo-linear-gradient react-native-svg react-native-qrcode-svg @react-native-community/datetimepicker
```

`mobile/package.json` içinde `expo` bağımlılığının (dolayısıyla `@expo/vector-icons`'ın) zaten mevcut olduğunu doğrula:

```bash
cat package.json | grep expo
```

Eğer `@expo/vector-icons` `node_modules` içinde yoksa (`ls node_modules/@expo/vector-icons` boş dönerse), ek olarak kur:

```bash
npx expo install @expo/vector-icons
```

- [ ] **Step 3: Doğrula**

```bash
npx expo start
```

Terminaldeki QR kodu Expo Go uygulamasıyla (veya emülatörle) tara. Beklenen: varsayılan şablon ekranı ("Open up App.js to start working on your app!") hatasız açılıyor.

Sunucuyu durdur (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add mobile
git commit -m "Scaffold Expo mobile app and install required dependencies"
```

---

### Task 3: PROFILE verisi ve App.js'e sağlık kontrolü bağlantısı

**Files:**
- Create: `mobile/src/data/card.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: yok.
- Produces: `PROFILE` objesi (`{ initials, name, title, phone, phoneHref, email, tagline, socials: [{label, href, icon}] }`) — sonraki tüm bileşen task'ları bu şekli kullanır.

- [ ] **Step 1: PROFILE verisini oluştur**

`mobile/src/data/card.js`:
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

- [ ] **Step 2: App.js'i PROFILE'ı gösterecek şekilde güncelle**

`mobile/App.js`:
```jsx
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{PROFILE.name}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
});
```

- [ ] **Step 3: Doğrula**

```bash
cd mobile
npx expo start
```

Expo Go'da aç. Beklenen: koyu lacivert arka plan üzerinde "Seçil Sarıgül" yazısı görünüyor.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/data/card.js mobile/App.js
git commit -m "Add PROFILE data and wire it into App.js"
```

---

### Task 4: Avatar bileşeni (gradient header)

**Files:**
- Create: `mobile/src/components/Avatar.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `PROFILE` (Task 3).
- Produces: `Avatar({ initials, name, title })` — Task 7 (ProfileCard) bu bileşeni kullanır.

- [ ] **Step 1: Avatar bileşenini oluştur**

`mobile/src/components/Avatar.js`:
```jsx
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function Avatar({ initials, name, title }) {
  return (
    <LinearGradient
      colors={['#38bdf8', '#818cf8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { fontSize: 34, fontWeight: '700', color: '#818cf8', letterSpacing: 1 },
  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '500', color: '#fff', opacity: 0.9 },
});
```

- [ ] **Step 2: App.js'e bağla**

`mobile/App.js` içindeki `<Text style={styles.name}>{PROFILE.name}</Text>` satırını kaldır, importları ve render'ı güncelle:
```jsx
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';
import { Avatar } from './src/components/Avatar';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Avatar initials={PROFILE.initials} name={PROFILE.name} title={PROFILE.title} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center' },
});
```

- [ ] **Step 3: Doğrula**

`npx expo start` ile Expo Go'da aç. Beklenen: mavi-mor gradient bir header içinde beyaz daire avatar ("SS"), isim ve unvan görünüyor.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/Avatar.js mobile/App.js
git commit -m "Add Avatar component with gradient header"
```

---

### Task 5: ContactList bileşeni

**Files:**
- Create: `mobile/src/components/ContactList.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `PROFILE.phone`, `PROFILE.phoneHref`, `PROFILE.email`.
- Produces: `ContactList({ phone, phoneHref, email })` — Task 7 (ProfileCard) bu bileşeni kullanır.

- [ ] **Step 1: ContactList bileşenini oluştur**

`mobile/src/components/ContactList.js`:
```jsx
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function ContactList({ phone, phoneHref, email }) {
  const items = [
    { key: 'phone', icon: 'phone', label: phone, onPress: () => Linking.openURL(`tel:${phoneHref}`) },
    { key: 'mail', icon: 'mail', label: email, onPress: () => Linking.openURL(`mailto:${email}`) },
  ];

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <TouchableOpacity key={item.key} style={styles.row} onPress={item.onPress}>
          <View style={styles.iconWrap}>
            <Feather name={item.icon} size={18} color="#818cf8" />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14, marginBottom: 24, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14, color: '#0f172a' },
});
```

- [ ] **Step 2: App.js'e bağla**

`mobile/App.js` içinde `Avatar`'dan sonra, beyaz bir gövde içine `ContactList` ekle:
```jsx
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';
import { Avatar } from './src/components/Avatar';
import { ContactList } from './src/components/ContactList';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Avatar initials={PROFILE.initials} name={PROFILE.name} title={PROFILE.title} />
          <View style={styles.body}>
            <ContactList phone={PROFILE.phone} phoneHref={PROFILE.phoneHref} email={PROFILE.email} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center' },
  card: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  body: { padding: 28 },
});
```

- [ ] **Step 3: Doğrula**

Expo Go'da aç. Beklenen: header altında telefon ve e-posta satırları ikonlarla görünüyor; telefon satırına dokununca telefon araması ekranı, e-posta satırına dokununca mail uygulaması açılmaya çalışılıyor (simülatörde/gerçek cihazda desteklenen ölçüde).

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/ContactList.js mobile/App.js
git commit -m "Add ContactList component with tap-to-call/email"
```

---

### Task 6: SocialLinks bileşeni

**Files:**
- Create: `mobile/src/components/SocialLinks.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `PROFILE.socials` (`[{ label, href, icon }]`, `icon` ∈ `{"linkedin", "github"}`).
- Produces: `SocialLinks({ socials })` — Task 7 (ProfileCard) bu bileşeni kullanır.

- [ ] **Step 1: SocialLinks bileşenini oluştur**

`mobile/src/components/SocialLinks.js`:
```jsx
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ICONS = { linkedin: 'linkedin', github: 'github' };

export function SocialLinks({ socials }) {
  return (
    <View style={styles.row}>
      {socials.map((s) => (
        <TouchableOpacity
          key={s.label}
          style={styles.circle}
          onPress={() => Linking.openURL(s.href)}
          accessibilityLabel={s.label}
        >
          <FontAwesome name={ICONS[s.icon]} size={17} color="#64748b" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingTop: 18 },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

- [ ] **Step 2: App.js'e bağla**

`ContactList`'in altına `SocialLinks` ekle:
```jsx
import { SocialLinks } from './src/components/SocialLinks';
// ...
<ContactList phone={PROFILE.phone} phoneHref={PROFILE.phoneHref} email={PROFILE.email} />
<SocialLinks socials={PROFILE.socials} />
```

- [ ] **Step 3: Doğrula**

Expo Go'da aç. Beklenen: iletişim satırlarının altında LinkedIn ve GitHub ikonlu iki daire görünüyor; dokununca ilgili profil tarayıcıda açılıyor.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/SocialLinks.js mobile/App.js
git commit -m "Add SocialLinks component"
```

---

### Task 7: ProfileCard kompozisyonu

**Files:**
- Create: `mobile/src/components/ProfileCard.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `Avatar` (Task 4), `ContactList` (Task 5), `SocialLinks` (Task 6), `PROFILE`.
- Produces: `ProfileCard({ profile, onOpenPolicy })` — Task 9 bu bileşeni `CardActionsForm` eklemek için değiştirecek; `App.js` (Task 8, 10, 11) bu bileşeni kullanır.

- [ ] **Step 1: ProfileCard bileşenini oluştur**

`mobile/src/components/ProfileCard.js`:
```jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { ContactList } from './ContactList';
import { SocialLinks } from './SocialLinks';

export function ProfileCard({ profile, onOpenPolicy }) {
  return (
    <View style={styles.card}>
      <Avatar initials={profile.initials} name={profile.name} title={profile.title} />
      <View style={styles.body}>
        <ContactList phone={profile.phone} phoneHref={profile.phoneHref} email={profile.email} />
        <SocialLinks socials={profile.socials} />
        {profile.tagline ? <Text style={styles.footerNote}>{profile.tagline}</Text> : null}
        <TouchableOpacity onPress={onOpenPolicy}>
          <Text style={styles.policyLink}>Gizlilik Politikası</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  body: { padding: 28 },
  footerNote: { textAlign: 'center', fontSize: 11, color: '#64748b', opacity: 0.7, marginTop: 18 },
  policyLink: { textAlign: 'center', fontSize: 11, color: '#818cf8', textDecorationLine: 'underline', marginTop: 10 },
});
```

- [ ] **Step 2: App.js'i ProfileCard kullanacak şekilde sadeleştir**

`mobile/App.js`:
```jsx
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';
import { ProfileCard } from './src/components/ProfileCard';

export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard profile={PROFILE} onOpenPolicy={() => setIsPolicyOpen(true)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center', gap: 20 },
});
```

(`isPolicyOpen` henüz bir modal'a bağlı değil — Task 10'da `PrivacyPolicyModal` eklenince kullanılacak; bu ara durumda "Gizlilik Politikası" linkine dokunmanın görünür bir etkisi olmaması beklenir.)

- [ ] **Step 3: Doğrula**

Expo Go'da aç. Beklenen: görünüm Task 6 sonundakiyle birebir aynı (artık `ProfileCard` içinde birleştirilmiş halde), "Gizlilik Politikası" linki görünüyor (henüz işlevsiz).

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/ProfileCard.js mobile/App.js
git commit -m "Compose ProfileCard from Avatar, ContactList and SocialLinks"
```

---

### Task 8: Contacts izni + AddToContactsPanel

**Files:**
- Create: `mobile/src/lib/contacts.js`
- Create: `mobile/src/components/AddToContactsPanel.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `PROFILE` şekli (`name`, `title`, `phoneHref`, `email`).
- Produces: `addOwnerToDeviceContacts(profile) => Promise<{ added: boolean, reason?: string }>` — Task 9 (`CardActionsForm`) bu fonksiyonu da kullanır. `AddToContactsPanel({ profile })`.

- [ ] **Step 1: contacts.js'i oluştur**

`mobile/src/lib/contacts.js`:
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
    [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: profile.phoneHref }],
    [Contacts.Fields.Emails]: [{ label: 'work', email: profile.email }],
  });

  return { added: true };
}
```

- [ ] **Step 2: AddToContactsPanel bileşenini oluştur**

`mobile/src/components/AddToContactsPanel.js`:
```jsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { addOwnerToDeviceContacts } from '../lib/contacts';

export function AddToContactsPanel({ profile }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handlePress() {
    setIsSaving(true);
    try {
      const result = await addOwnerToDeviceContacts(profile);
      if (!result.added) {
        Alert.alert('İzin gerekli', 'Rehbere eklemek için kişiler izni gerekiyor.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Kartviziti Telefonuma Ekle</Text>
      <Text style={styles.desc}>{profile.name} kişisini tek dokunuşla rehberine ekle.</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isSaving}>
        <Feather name="user-plus" size={16} color="#fff" />
        <Text style={styles.buttonText}>Telefonuma Ekle</Text>
      </TouchableOpacity>
      <Text style={styles.footerNote}>Ad, e-posta ve telefon rehberine kaydedilecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  desc: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  footerNote: { fontSize: 11, color: '#64748b', opacity: 0.7, marginTop: 10 },
});
```

- [ ] **Step 3: App.js'e bağla**

`ProfileCard`'ın altına ekle:
```jsx
import { AddToContactsPanel } from './src/components/AddToContactsPanel';
// ...
<ProfileCard profile={PROFILE} onOpenPolicy={() => setIsPolicyOpen(true)} />
<AddToContactsPanel profile={PROFILE} />
```

- [ ] **Step 4: Doğrula**

Expo Go'da aç, "Telefonuma Ekle" butonuna dokun.
- İlk seferde bir izin isteği (contacts permission) çıkmalı.
- **İzin verirsen:** cihazın Kişiler/Contacts uygulamasını aç, "Seçil Sarıgül" adında yeni bir kişinin eklendiğini doğrula (isim, unvan şirket alanında, telefon, e-posta doğru).
- **İzni reddedersen:** "İzin gerekli" başlıklı bir uyarı (Alert) görünmeli, rehbere hiçbir şey eklenmemeli.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/lib/contacts.js mobile/src/components/AddToContactsPanel.js mobile/App.js
git commit -m "Add native contacts permission flow and AddToContactsPanel"
```

---

### Task 9: events.js + CardActionsForm

**Files:**
- Create: `mobile/src/lib/events.js`
- Create: `mobile/src/components/CardActionsForm.js`
- Modify: `mobile/src/components/ProfileCard.js`

**Interfaces:**
- Consumes: `addOwnerToDeviceContacts` (Task 8), `profile` şekli, `onOpenPolicy` (Task 7).
- Produces: `buildCardSaveEvent(profile, visitor)`, `buildMeetingRequestEvent(profile, visitor, preferredDate)`, `logEvent(event)`; `CardActionsForm({ profile, onOpenPolicy })`.

- [ ] **Step 1: events.js'i oluştur**

`mobile/src/lib/events.js`:
```js
import { Platform } from 'react-native';

export function buildCardSaveEvent(profile, visitor) {
  return {
    event: 'card.save',
    timestamp: new Date().toISOString(),
    payload: {
      card: {
        name: profile.name,
        title: profile.title,
        phone: profile.phoneHref,
        email: profile.email,
      },
      source: {
        platform: Platform.OS,
        referrer: null,
      },
      savedBy: {
        name: visitor.name,
        email: visitor.email,
      },
    },
  };
}

export function buildMeetingRequestEvent(profile, visitor, preferredDate) {
  return {
    event: 'meeting.request',
    timestamp: new Date().toISOString(),
    payload: {
      requester: {
        name: visitor.name,
        email: visitor.email,
        phone: null,
      },
      message: null,
      preferredDate,
      cardOwner: {
        name: profile.name,
        email: profile.email,
      },
    },
  };
}

export function logEvent(event) {
  console.log(event);
}
```

- [ ] **Step 2: CardActionsForm bileşenini oluştur**

`mobile/src/components/CardActionsForm.js`:
```jsx
import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { addOwnerToDeviceContacts } from '../lib/contacts';
import { buildCardSaveEvent, buildMeetingRequestEvent, logEvent } from '../lib/events';

export function CardActionsForm({ profile, onOpenPolicy }) {
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  function validate(action) {
    if (!visitorName.trim() || !visitorEmail.trim()) {
      Alert.alert('Eksik bilgi', 'Adınızı ve e-posta adresinizi girin.');
      return false;
    }
    if (!consent) {
      Alert.alert('Onay gerekli', 'Devam etmek için Gizlilik Politikası onayı gerekiyor.');
      return false;
    }
    if (action === 'meeting' && !preferredDate) {
      Alert.alert('Tarih gerekli', 'Lütfen toplantı için bir tarih seçin.');
      return false;
    }
    return true;
  }

  async function handleSubmit(action) {
    if (isSubmittingRef.current) return;
    if (!validate(action)) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const visitor = { name: visitorName.trim(), email: visitorEmail.trim() };

    if (action === 'save') {
      const result = await addOwnerToDeviceContacts(profile);
      if (!result.added) {
        Alert.alert('İzin gerekli', 'Rehbere eklemek için kişiler izni gerekiyor.');
      }
      logEvent(buildCardSaveEvent(profile, visitor));
    } else {
      logEvent(buildMeetingRequestEvent(profile, visitor, preferredDate.toISOString().slice(0, 10)));
    }

    setVisitorName('');
    setVisitorEmail('');
    setPreferredDate(null);
    setConsent(false);

    setTimeout(() => {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }, 800);
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Adınız</Text>
        <TextInput style={styles.input} value={visitorName} onChangeText={setVisitorName} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>E-posta adresiniz</Text>
        <TextInput
          style={styles.input}
          value={visitorEmail}
          onChangeText={setVisitorEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Tercih ettiğiniz tarih (toplantı için)</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
          <Text>{preferredDate ? preferredDate.toLocaleDateString('tr-TR') : 'Tarih seçin'}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={preferredDate || new Date()}
            mode="date"
            minimumDate={new Date()}
            onChange={(_event, selectedDate) => {
              setShowPicker(Platform.OS === 'ios');
              if (selectedDate) setPreferredDate(selectedDate);
            }}
          />
        )}
      </View>
      <View style={styles.consentRow}>
        <Switch value={consent} onValueChange={setConsent} />
        <Text style={styles.consentText}>
          <Text style={styles.link} onPress={onOpenPolicy}>Gizlilik Politikası</Text>
          {"'nı okudum, kişisel verilerimin işlenmesini kabul ediyorum."}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit('save')}
          disabled={isSubmitting}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.buttonText}>Kartı Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit('meeting')}
          disabled={isSubmitting}
        >
          <Feather name="calendar" size={16} color="#fff" />
          <Text style={styles.buttonText}>Toplantı Talep Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12, marginBottom: 22, width: '100%' },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
    color: '#0f172a',
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  consentText: { flex: 1, fontSize: 12, color: '#64748b' },
  link: { color: '#818cf8', textDecorationLine: 'underline' },
  actions: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
```

- [ ] **Step 3: ProfileCard'a bağla**

`mobile/src/components/ProfileCard.js` içinde `ContactList` ile `SocialLinks` arasına ekle:
```jsx
import { CardActionsForm } from './CardActionsForm';
// ...
<ContactList phone={profile.phone} phoneHref={profile.phoneHref} email={profile.email} />
<CardActionsForm profile={profile} onOpenPolicy={onOpenPolicy} />
<SocialLinks socials={profile.socials} />
```

- [ ] **Step 4: Doğrula**

Expo Go'da aç:
- Formu boş gönder → "Eksik bilgi" uyarısı çıkmalı.
- Ad/e-posta doldur, onay switch'ini açmadan gönder → "Onay gerekli" uyarısı çıkmalı.
- Ad/e-posta/onay ile "Toplantı Talep Et"e bas, tarih seçmeden → "Tarih gerekli" uyarısı çıkmalı.
- Tüm alanları doldurup "Kartı Kaydet"e bas → contacts izni akışı tetiklenmeli (Task 8'deki gibi) ve Metro terminalinde `card.save` event JSON'u (doğru `card`/`source.platform`/`savedBy` alanlarıyla) görünmeli.
- Tüm alanları (tarih dahil) doldurup "Toplantı Talep Et"e bas → Metro terminalinde `meeting.request` event JSON'u (doğru `requester`/`preferredDate`/`cardOwner` alanlarıyla) görünmeli, contacts tetiklenmemeli.
- Gönderim sonrası butonların ~800ms disable kaldığını gözle.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/lib/events.js mobile/src/components/CardActionsForm.js mobile/src/components/ProfileCard.js
git commit -m "Add visitor form with contacts save and console-logged webhook events"
```

---

### Task 10: PrivacyPolicyModal

**Files:**
- Create: `mobile/src/components/PrivacyPolicyModal.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: `isPolicyOpen` state ve `setIsPolicyOpen` (Task 7'de App.js'e eklendi).
- Produces: `PrivacyPolicyModal({ isOpen, onClose })`.

- [ ] **Step 1: PrivacyPolicyModal bileşenini oluştur**

`mobile/src/components/PrivacyPolicyModal.js`:
```jsx
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const SECTIONS = [
  {
    title: '1. Veri Sorumlusu',
    body: 'Bu dijital kartvizit uygulaması Seçil Sarıgül tarafından, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü ("GDPR") kapsamında veri sorumlusu sıfatıyla işletilmektedir. İletişim: secil.sarigl@gmail.com',
  },
  {
    title: '2. Toplanan Kişisel Veriler',
    body: '"Kartı Kaydet" ve "Toplantı Talep Et" formu: ad soyad, e-posta adresi ve (toplantı talebinde) tercih edilen tarih. "Kişilerime Ekle" özelliği kart sahibinin bilgilerini (ad, e-posta, telefon) doğrudan cihazınızın kişiler uygulamasına ekler; bu işlem cihazınızda gerçekleşir, hiçbir veri sunucuya gönderilmez.',
  },
  {
    title: '3. İşleme Amaçları',
    body: 'Kişisel verileriniz; kartvizit kaydetme talebinizi ve toplantı talebinizi işleme almak, talebinizle ilgili sizinle iletişime geçmek amacıyla işlenir.',
  },
  {
    title: '4. Hukuki Sebep',
    body: 'Veriler, formu göndermeden önce işaretlediğiniz onay kutusuyla verdiğiniz açık rızaya dayanılarak (KVKK m. 5/1; GDPR m. 6/1-a) işlenmektedir.',
  },
  {
    title: '5. Verilerin Aktarımı',
    body: 'Bu proje şu an bir demo/portföy çalışmasıdır: form gönderiminde toplanan veriler yalnızca cihaz konsoluna kaydedilmekte olup üçüncü bir sunucuya veya hizmete aktarılmamaktadır. İleride bir backend/webhook entegrasyonu devreye alındığında bu politika güncellenecek ve aktarım burada açıkça belirtilecektir.',
  },
  {
    title: '6. Saklama Süresi',
    body: 'Verileriniz, talebinizin işlenmesi ve olası iletişim için gereken süre boyunca saklanır; bu süre sonunda silinir veya anonim hale getirilir.',
  },
  {
    title: '7. Haklarınız',
    body: 'KVKK m. 11 ve GDPR m. 15-22 uyarınca; verinizin işlenip işlenmediğini öğrenme, işleme amacını öğrenme, aktarıldığı üçüncü kişileri bilme, düzeltilmesini/silinmesini isteme, düzeltme-silme taleplerinin üçüncü kişilere bildirilmesini isteme, otomatik analiz sonucuna itiraz etme, zararın giderilmesini talep etme haklarına sahipsiniz. (GDPR) Ayrıca verilerinizin taşınabilirliğini talep etme, rızanızı geri çekme ve bir denetim otoritesine şikâyette bulunma haklarına da sahipsiniz.',
  },
  {
    title: '8. Çerezler',
    body: 'Bu uygulama çerez veya benzeri izleme teknolojileri kullanmamaktadır.',
  },
  {
    title: '9. Başvuru',
    body: 'Yukarıdaki haklarınızı kullanmak için secil.sarigl@gmail.com adresinden bizimle iletişime geçebilirsiniz.',
  },
];

export function PrivacyPolicyModal({ isOpen, onClose }) {
  return (
    <Modal visible={isOpen} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Gizlilik Politikası ve Kişisel Verilerin Korunmasına İlişkin Aydınlatma Metni
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Kapat">
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            <Text style={styles.updated}>Son güncelleme: 25.08.2026</Text>
            {SECTIONS.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  panel: { width: '100%', maxHeight: '85%', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0f172a' },
  closeButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 18, color: '#64748b', lineHeight: 18 },
  body: { padding: 20 },
  updated: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  sectionBody: { fontSize: 13, lineHeight: 20, color: '#0f172a' },
});
```

- [ ] **Step 2: App.js'e bağla**

`mobile/App.js`:
```jsx
import { PrivacyPolicyModal } from './src/components/PrivacyPolicyModal';
// ...
export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard profile={PROFILE} onOpenPolicy={() => setIsPolicyOpen(true)} />
        <AddToContactsPanel profile={PROFILE} />
      </ScrollView>
      <PrivacyPolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Doğrula**

Expo Go'da aç, hem "ProfileCard" altındaki "Gizlilik Politikası" linkine hem de formdaki onay metni içindeki linke dokun → tam ekrana yakın bir modal, 9 bölümlük KVKK/GDPR metniyle açılmalı; × butonuna basınca kapanmalı.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/PrivacyPolicyModal.js mobile/App.js
git commit -m "Add privacy policy modal"
```

---

### Task 11: QRPanel

**Files:**
- Create: `mobile/src/components/QRPanel.js`
- Modify: `mobile/App.js`

**Interfaces:**
- Consumes: yok (sabit `LIVE_URL`).
- Produces: `QRPanel()`.

- [ ] **Step 1: QRPanel bileşenini oluştur**

`mobile/src/components/QRPanel.js`:
```jsx
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const LIVE_URL = 'https://bizcard-miuul-chi.vercel.app/';

export function QRPanel() {
  return (
    <View style={styles.panel}>
      <QRCode value={LIVE_URL} size={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

- [ ] **Step 2: App.js'e bağla**

`AddToContactsPanel`'ın altına ekle:
```jsx
import { QRPanel } from './src/components/QRPanel';
// ...
<AddToContactsPanel profile={PROFILE} />
<QRPanel />
```

- [ ] **Step 3: Doğrula**

Expo Go'da aç. Beklenen: en altta beyaz bir panel içinde QR kod görünüyor. Başka bir telefonla QR kodu tara → `https://bizcard-miuul-chi.vercel.app/` adresine yönlenmeli.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/components/QRPanel.js mobile/App.js
git commit -m "Add QR panel pointing to the live web demo"
```

---

### Task 12: Dokümantasyon güncellemesi (CLAUDE.md, README.md)

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: yok (sadece dokümantasyon metni).
- Produces: yok.

- [ ] **Step 1: CLAUDE.md'yi güncelle**

`CLAUDE.md` içinde şu bölümleri güncelle (TBD placeholder'larını kaldır):

`## Durum Notu` bölümünün sonuna ekle:
```
Proje artık bir monorepo: `web/` altında değişmeden duran statik web demosu, `mobile/` altında ise Expo/React Native ile yazılmış, Expo Go üzerinde çalışan bir mobil uygulama var. Mobil uygulama web ile aynı özellik setini sunar; ek olarak native kişiler (contacts) izni ister ve "Kartı Kaydet"/"Kişilerime Ekle" eylemlerinde kartviziti doğrudan cihaz rehberine ekler.
```

`## Teknoloji Yığını` bölümünü değiştir:
```
## Teknoloji Yığını
- **Web** (`web/`): Statik HTML + React/ReactDOM/Babel (CDN üzerinden, build adımı yok).
- **Mobil** (`mobile/`): Expo (JavaScript, blank template) + React Native core bileşenleri. Bağımlılıklar: `expo-contacts` (native kişiler izni), `expo-linear-gradient`, `react-native-svg` + `react-native-qrcode-svg` (QR kod), `@react-native-community/datetimepicker`, `@expo/vector-icons`. Tümü Expo Go uyumlu; custom native kod veya config-plugin yok.
- **Backend:** Henüz seçilmedi (TBD) — form eylemleri şu an sadece `console.log` üretir.
```

`## Geliştirme Komutları` bölümünü değiştir:
```
## Geliştirme Komutları
- **Web:** Kurulum gerekmez; `web/index.html` dosyasını doğrudan bir tarayıcıda aç.
- **Mobil:** `cd mobile && npx expo start` — açılan QR kodu Expo Go uygulamasıyla tarayarak veya bir emülatörle çalıştır.
```

`## Klasör Yapısı` bölümünü değiştir:
```
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
```

`## Sonraki Adımlar` listesindeki ilgili maddeleri işaretle:
```
## Sonraki Adımlar
- [x] Teknoloji yığınına karar ver (web: statik HTML, mobil: Expo/React Native)
- [x] Proje iskeletini oluştur (mobile/ Expo scaffold)
- [x] Build/test/lint komutlarını tanımla
- [x] Bu dosyayı gerçek mimari ve konvansiyonlarla güncelle
- [ ] (İleri aşama) QR/OCR modülü ekleme fikrini değerlendir — CV alanına köprü olabilir
```

- [ ] **Step 2: README.md'yi güncelle**

`## Yapı` bölümünü değiştir:
```
## Yapı

- `web/index.html` — kurulum gerektirmeyen, React/ReactDOM/Babel CDN üzerinden çalışan demo kartvizit arayüzü
- `mobile/` — Expo/React Native ile yazılmış mobil uygulama (Expo Go uyumlu, native kişiler izni dahil)
- `.claude/skills/bizcard-conventions/` — bileşen yazım kuralları ve webhook veri sözleşmesi referansı
- `CLAUDE.md` — proje bağlamı, hedefler ve sonraki adımlar

Mobil uygulamayı çalıştırmak için: `cd mobile && npx expo start`, ardından açılan QR kodu Expo Go uygulamasıyla tara.
```

- [ ] **Step 3: Doğrula**

`CLAUDE.md` ve `README.md`'yi baştan sona oku; hiçbir "TBD" veya "henüz seçilmedi" ifadesinin artık geçerli/güncel bilgiyle çeliştiğini görmediğinden emin ol (backend hâlâ TBD olarak kalabilir, bu doğru — sadece web/mobil teknoloji seçimi netleşti).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "Update CLAUDE.md and README.md for the web/mobile monorepo structure"
```

---

### Task 13: Uçtan uca manuel doğrulama

**Files:** Yok (sadece doğrulama, kod değişikliği yok).

**Interfaces:**
- Consumes: Task 1–12'nin tüm çıktıları.
- Produces: yok (final kabul kontrolü).

- [ ] **Step 1: Web tarafını doğrula**

`web/index.html` dosyasını tarayıcıda aç. Beklenen: kart, form, "Telefonuma Ekle" paneli, QR kod, KVKK modalı — hepsi taşımadan önceki gibi birebir çalışıyor.

- [ ] **Step 2: Mobil tarafını uçtan uca doğrula**

```bash
cd mobile
npx expo start
```

Expo Go'da sırayla doğrula:
1. Kart (avatar, isim, unvan, telefon/e-posta, sosyal linkler) doğru render ediliyor.
2. "Kartı Kaydet" ve "Toplantı Talep Et" formlarını doldurup gönder; Metro konsolunda doğru `card.save`/`meeting.request` JSON'unun basıldığını doğrula.
3. "Kartı Kaydet" ve "Kişilerime Ekle" ile contacts izni akışını test et: izin verildiğinde kişi gerçekten cihaz rehberine ekleniyor, reddedildiğinde uyarı gösteriliyor.
4. QR panelinin göründüğünü ve doğru URL'i kodladığını doğrula (başka bir cihazla tarayarak).
5. Gizlilik Politikası modalının açılıp kapandığını doğrula.

- [ ] **Step 3: Sonucu not al**

Herhangi bir adım beklenenden farklı davranırsa, ilgili task'a geri dönüp düzelt ve bu task'ı tekrar çalıştır. Hepsi beklendiği gibi çalışıyorsa bu task'ı tamamlanmış işaretle (commit gerekmez, kod değişikliği yok).

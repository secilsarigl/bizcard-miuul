# BizCard — QR Kod Tasarımı

## Amaç
Dijital kartvizitin altına, kartın canlı (deploy edilmiş) adresine yönlenen bir QR kod eklemek. Böylece kartı fiziksel olarak paylaşırken (örn. bir ekranda göstererek) karşı taraf telefonuyla QR'ı okutup canlı sayfaya ulaşabilir.

## Kapsam
- `qrcode.react` kütüphanesi ile QR kodu render etmek.
- QR kodu kartın hemen altına, ayrı bir panel içinde yerleştirmek.
- QR, projenin canlı deploy adresini (GitHub Pages) işaret eder.
- Kapsam dışı: QR içeriğinin dinamikleştirilmesi (örn. vCard verisini QR'a gömmek), QR indirme/paylaşma özellikleri, stil varyasyonları.

## Teknik Yaklaşım

`index.html` tek dosya, kurulum yok kuralına (bkz. `bizcard-conventions` skill) uyularak, mevcut React/ReactDOM/Babel (UMD) bloğuna dokunulmadan ayrı bir `<script type="module">` eklenir.

`qrcode.react` npm paketi UMD/global tarayıcı derlemesi yayınlamıyor (yalnızca ESM/CJS). Bu nedenle:

- `QRCodeSVG` bileşeni `https://esm.sh/qrcode.react@4?bundle` adresinden ES modülü olarak import edilir.
- `?bundle` parametresi, paketin kendi React/ReactDOM bağımlılıklarını da paketler; bu izole kopya, sayfanın ana UMD React örneğiyle **paylaşılmaz** ama çakışmaz da — çünkü kendi ayrı DOM köküne (`#qr-slot`) render edilir ve ana kartın React ağacıyla hiç etkileşmez.
- Bu modül script'i, ana Babel script'inden bağımsız çalışır; ikisi arasında veri paylaşımı yoktur (QR hedefi sabit bir string).

## Yerleşim ve Stil

- `index.html` içinde `.card` div'inin hemen altına, `<div id="qr-slot"></div>` içeren yeni bir panel eklenir (örn. `.qr-panel` sınıfı).
- Panel stili karttakiyle tutarlı: beyaz arkaplan (`--card-bg`), `--radius` (20px), hafif gölge (karttakinin daha hafif bir versiyonu), `max-width:380px` ile kartla yatayda hizalı, `margin-top` ile karttan ayrık.
- İçerik: yalnızca ortalanmış QR kodu (~150px), başlık veya açıklama metni yok (sade tasarım kararı).

## Veri

QR'ın kodladığı değer sabit bir sabittir:

```js
const LIVE_URL = "https://secilsarigl.github.io/bizcard-miuul/";
```

Bu değer kart verisinden (PROFILE objesi) bağımsızdır ve kullanıcı girişine dayanmaz.

## Hata Yönetimi

Kritik değildir. `esm.sh` CDN'i yüklenemezse (ağ hatası vb.) `#qr-slot` boş kalır; ana kartvizit (React/Babel UMD bloğu) bundan etkilenmeden normal çalışmaya devam eder. Ekstra try/catch, loading state veya fallback UI eklenmez — mevcut kod tabanında da böyle bir hata yönetimi pattern'i yok.

## Deploy

Proje GitHub'da `secilsarigl/bizcard-miuul` reposunda public olarak duruyor. QR'ın işaret ettiği canlı adresin çalışması için GitHub Pages, bu repo üzerinde `master` branch / kök dizin (`/`) kaynağından etkinleştirilmelidir. Bu, implementasyon planının bir adımı olacak.

Sonuç adres: `https://secilsarigl.github.io/bizcard-miuul/`

## Test Planı

Manuel doğrulama (otomatik test altyapısı yok, tek dosyalık statik proje):
1. `index.html`'i tarayıcıda aç, kartın altında QR kodunun göründüğünü doğrula.
2. Mevcut kart işlevlerinin (Rehbere Ekle, E-posta, sosyal linkler) QR eklendikten sonra bozulmadığını doğrula.
3. GitHub Pages etkinleştirildikten sonra, bir telefonla QR'ı okutup `https://secilsarigl.github.io/bizcard-miuul/` adresine yönlendiğini doğrula.

## İlgili Dosyalar
- `index.html` — QR paneli ve modül script'i buraya eklenecek.
- `.claude/skills/bizcard-conventions/SKILL.md` — bileşen kuralları referansı (tek dosya, fonksiyon bileşeni kuralı QR modülü için de geçerli).

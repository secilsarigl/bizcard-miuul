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
Proje erken aşamada ama artık boş değil: `index.html` içinde, kurulum gerektirmeyen, React/ReactDOM/Babel CDN üzerinden çalışan tek dosyalık bir demo dijital kartvizit mevcut ve kartın altında, canlı GitHub Pages adresine (https://secilsarigl.github.io/bizcard-miuul/) yönlendiren bir QR kod paneli var. Backend/teknoloji yığını ise henüz seçilmedi (TBD). Aşağıdaki bölümler (Teknoloji Yığını, Geliştirme Komutları, Klasör Yapısı) backend/build tarafı netleşene kadar bilinçli olarak placeholder bırakıldı; kod eklendikçe bu dosyayı gerçek mimari, komutlar ve klasör yapısıyla güncelle, sahte/varsayımsal bilgiyle doldurma.

## Teknoloji Yığını
Henüz seçilmedi (TBD). Değerlendirilebilecek adaylar:
- Python (FastAPI/Flask) — data engineering/ML tarafına geçişte tutarlılık sağlar
- JavaScript/TypeScript (React/Next.js) — modern frontend/fullstack deneyimi katar

Karar verirken şunu düşün: Hedefin ML/data engineering pozisyonlarıysa, Python tabanlı bir backend (FastAPI) tercih emek CV'ne daha tutarlı bir hikaye katar.

## Geliştirme Komutları
Henüz tanımlı değil. Teknoloji yığını seçildiğinde ve proje iskeleti oluşturulduğunda buraya eklenecek.

## Klasör Yapısı
Henüz oluşturulmadı. Teknoloji seçildikten sonra doldurulacak.

## Sonraki Adımlar
- [ ] Teknoloji yığınına karar ver (kariyer hedefiyle uyumlu seç)
- [ ] Proje iskeletini oluştur
- [ ] Build/test/lint komutlarını tanımla
- [ ] Bu dosyayı gerçek mimari ve konvansiyonlarla güncelle
- [ ] (İleri aşama) QR/OCR modülü ekleme fikrini değerlendir — CV alanına köprü olabilir
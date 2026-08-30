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

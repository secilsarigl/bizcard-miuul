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

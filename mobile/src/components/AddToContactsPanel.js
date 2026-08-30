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

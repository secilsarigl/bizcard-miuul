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

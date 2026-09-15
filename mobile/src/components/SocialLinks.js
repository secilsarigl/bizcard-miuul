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

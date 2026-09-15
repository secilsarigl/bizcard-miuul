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

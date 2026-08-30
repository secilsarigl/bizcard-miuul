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

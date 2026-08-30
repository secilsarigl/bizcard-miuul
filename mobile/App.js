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

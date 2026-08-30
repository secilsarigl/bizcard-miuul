import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';
import { Avatar } from './src/components/Avatar';
import { ContactList } from './src/components/ContactList';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Avatar initials={PROFILE.initials} name={PROFILE.name} title={PROFILE.title} />
          <View style={styles.body}>
            <ContactList phone={PROFILE.phone} phoneHref={PROFILE.phoneHref} email={PROFILE.email} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center' },
  card: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  body: { padding: 28 },
});

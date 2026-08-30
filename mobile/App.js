import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { PROFILE } from './src/data/card';
import { ProfileCard } from './src/components/ProfileCard';
import { AddToContactsPanel } from './src/components/AddToContactsPanel';
import { PrivacyPolicyModal } from './src/components/PrivacyPolicyModal';
import { QRPanel } from './src/components/QRPanel';

export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard profile={PROFILE} onOpenPolicy={() => setIsPolicyOpen(true)} />
        <AddToContactsPanel profile={PROFILE} />
        <QRPanel />
      </ScrollView>
      <PrivacyPolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, alignItems: 'center', gap: 20 },
});

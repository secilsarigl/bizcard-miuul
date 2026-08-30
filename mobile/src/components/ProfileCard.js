import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { ContactList } from './ContactList';
import { CardActionsForm } from './CardActionsForm';
import { SocialLinks } from './SocialLinks';

export function ProfileCard({ profile, onOpenPolicy }) {
  return (
    <View style={styles.card}>
      <Avatar initials={profile.initials} name={profile.name} title={profile.title} />
      <View style={styles.body}>
        <ContactList phone={profile.phone} phoneHref={profile.phoneHref} email={profile.email} />
        <CardActionsForm profile={profile} onOpenPolicy={onOpenPolicy} />
        <SocialLinks socials={profile.socials} />
        {profile.tagline ? <Text style={styles.footerNote}>{profile.tagline}</Text> : null}
        <TouchableOpacity onPress={onOpenPolicy}>
          <Text style={styles.policyLink}>Gizlilik Politikası</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  body: { padding: 28 },
  footerNote: { textAlign: 'center', fontSize: 11, color: '#64748b', opacity: 0.7, marginTop: 18 },
  policyLink: { textAlign: 'center', fontSize: 11, color: '#818cf8', textDecorationLine: 'underline', marginTop: 10 },
});

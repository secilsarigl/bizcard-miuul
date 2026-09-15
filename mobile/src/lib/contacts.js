import * as Contacts from 'expo-contacts';
import { Alert } from 'react-native';

export async function addOwnerToDeviceContacts(profile) {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    return { added: false, reason: 'permission-denied' };
  }

  const [firstName, ...rest] = profile.name.split(' ');
  const lastName = rest.join(' ');

  await Contacts.addContactAsync({
    [Contacts.Fields.FirstName]: firstName,
    [Contacts.Fields.LastName]: lastName,
    [Contacts.Fields.Company]: profile.title,
    [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: profile.phoneHref }],
    [Contacts.Fields.Emails]: [{ label: 'work', email: profile.email }],
  });

  return { added: true };
}

export async function saveOwnerToContactsWithFeedback(profile) {
  try {
    const result = await addOwnerToDeviceContacts(profile);
    if (result.added) {
      Alert.alert('Eklendi', 'Kartvizit rehberinize eklendi.');
    } else {
      Alert.alert('İzin gerekli', 'Rehbere eklemek için kişiler izni gerekiyor.');
    }
  } catch (error) {
    Alert.alert('Hata', 'Rehbere eklenirken bir sorun oluştu.');
  }
}

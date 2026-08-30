import * as Contacts from 'expo-contacts';

export async function addOwnerToDeviceContacts(profile) {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    return { added: false, reason: 'permission-denied' };
  }

  const [lastName, ...rest] = profile.name.split(' ');
  const firstName = rest.join(' ');

  await Contacts.addContactAsync({
    [Contacts.Fields.FirstName]: firstName,
    [Contacts.Fields.LastName]: lastName,
    [Contacts.Fields.Company]: profile.title,
    [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: profile.phoneHref }],
    [Contacts.Fields.Emails]: [{ label: 'work', email: profile.email }],
  });

  return { added: true };
}

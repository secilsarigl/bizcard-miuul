import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const LIVE_URL = 'https://bizcard-miuul-chi.vercel.app/';

export function QRPanel() {
  return (
    <View style={styles.panel}>
      <QRCode value={LIVE_URL} size={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

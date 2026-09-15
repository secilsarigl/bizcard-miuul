import { Platform } from 'react-native';

// n8n local instance (Docker, bkz. n8n/Kurulum Rehberi). Expo Go telefonda
// çalıştığı için "localhost" PC'yi değil telefonun kendisini işaret eder —
// aşağıya PC'nin LAN IP adresini yaz (Windows: `ipconfig` > IPv4 Address).
// Örn: "http://192.168.1.23:5678/webhook/bizcard"
const WEBHOOK_URL = 'http://YOUR_PC_LAN_IP:5678/webhook/bizcard';

export function buildCardSaveEvent(profile, visitor) {
  return {
    event: 'card.save',
    timestamp: new Date().toISOString(),
    payload: {
      card: {
        name: profile.name,
        title: profile.title,
        phone: profile.phoneHref,
        email: profile.email,
      },
      source: {
        platform: Platform.OS,
        referrer: null,
      },
      savedBy: {
        name: visitor.name,
        email: visitor.email,
      },
    },
  };
}

export function buildMeetingRequestEvent(profile, visitor, preferredDate) {
  return {
    event: 'meeting.request',
    timestamp: new Date().toISOString(),
    payload: {
      requester: {
        name: visitor.name,
        email: visitor.email,
        phone: null,
      },
      message: null,
      preferredDate,
      cardOwner: {
        name: profile.name,
        email: profile.email,
      },
    },
  };
}

export function logEvent(event) {
  console.log(event);
}

export async function sendEvent(event) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      console.error('Webhook isteği başarısız:', response.status);
    }
    return response.ok;
  } catch (error) {
    console.error("Webhook'a ulaşılamadı:", error);
    return false;
  }
}

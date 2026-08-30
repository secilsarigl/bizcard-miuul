import { Platform } from 'react-native';

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

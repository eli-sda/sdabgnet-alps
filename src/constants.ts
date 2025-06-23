export const SITE = 'https://new.sdabg.net';
export const OLD_SITE = 'https://sdabg.net';

export type AddType = 'services' | 'buySell' | 'other';
export const ADD_TYPES: AddType[] = ['services', 'buySell', 'other'];

export const TYPE_LABELS: Record<AddType, string> = {
  services: 'Услуги/Работа',
  buySell: 'Покупко-Продажби/Наем',
  other: 'Друго'
};

export const ERROR_SENDING_MESSAGE =
  'Възникна грешка при изпращането. Моля, използвайте имейла долу в страницата.';

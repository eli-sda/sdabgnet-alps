import React from 'react';
import { NavLink } from 'react-router-dom';
export type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'google play' | 'app store' | 'tik tok' | 'telegram';
};

const faIconClasses: Record<string, string> = {
  сайт: 'fas fa-globe-americas',
  facebook: 'fab fa-facebook-f',
  youtube: 'fab fa-youtube',
  instagram: 'fab fa-instagram',
  'google play': 'fab fa-google-play',
  'app store': 'fab fa-app-store',
  'tik tok': 'fab fa-tiktok',
  telegram: 'fab fa-telegram-plane'
};

export const getFaIconClass = (type: string) => faIconClasses[type];

/** Transliterates Cyrillic characters to Latin equivalents. */
function cyrillicToLatin(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: '', ю: 'yu', я: 'ya',
    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ж: 'Zh', З: 'Z', И: 'I', Й: 'Y',
    К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
    Ф: 'F', Х: 'H', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Sht', Ъ: 'A', Ь: '', Ю: 'Yu', Я: 'Ya'
  };
  return text.split('').map(c => map[c] || c).join('');
}

/** Generates a valid HTML id from a title (supports Cyrillic). */
export const generateId = (title: string): string =>
  cyrillicToLatin(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Parses markdown-style links [text](url) in a string and renders them as <a> (external) or <NavLink> (internal). */
export const parseLinksMd = (text: string): React.ReactNode[] => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, linkText, linkUrl] = match;
    const external = linkUrl.startsWith('http');
    if (external) {
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="u-theme--link-hover--dark"
        >
          {linkText}
        </a>
      );
    } else {
      parts.push(
        <NavLink
          key={match.index}
          to={linkUrl}
          className="u-theme--link-hover--dark"
        >
          {linkText}
        </NavLink>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

export const newLinesWithLinks = (text: string): React.ReactNode[] =>
  text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {parseLinksMd(line)}
      {i < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

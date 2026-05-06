# Welcome Dialog & Site Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-visit welcome dialog directing users to the About/site-guide page, and create a comprehensive site navigation guide page under About.

**Architecture:** React component with MUI Dialog (no custom styles), localStorage persistence via custom hook (following existing `useChangelog` pattern), and a new About subpage using ALPS utility classes and components.

**Tech Stack:** React 18, TypeScript, Material-UI, React Router v6, localStorage, ALPS library components

---

## Important Pre-Execution Note

**BEFORE EXECUTING THIS PLAN:**

The project uses TypeScript path aliases in `tsconfig.app.json`:
```json
"paths": {
  "alps-library/*": ["../../alps-elisda/src/*"],
  "src/*": ["./src/*"]
}
```

You MUST organize the project structure so that `sdabgnet-alps` is located at a path where `../../alps-elisda/src/*` correctly resolves to the alps-library source files. Otherwise, imports like `import { Caption } from 'alps-library/atoms/text/Caption'` will fail.

---

## File Structure

**New files:**
- `src/components/welcomeDialog/WelcomeDialog.tsx` — Dialog component (no SCSS)
- `src/hooks/useWelcomeDialog.ts` — Hook for localStorage persistence
- `src/pages/about/SiteGuide.tsx` — Site guide page component (no SCSS)

**Modified files:**
- `src/layout/Layout.tsx:1,9,14` — Add WelcomeDialog import, hook, and render
- `src/routes.tsx:61` — Add 'site-guide' to about route options
- `src/Router.tsx:72,270` — Import SiteGuide and add route
- `src/utils/Navigation.tsx:385-403` — Add site-guide to About subnav

---

### Task 1: Create useWelcomeDialog Hook

**Files:**
- Create: `src/hooks/useWelcomeDialog.ts`

- [ ] **Step 1: Write the hook implementation**

```typescript
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'welcomeDialogSeen';

export const useWelcomeDialog = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(true); // Default true to avoid flash

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    setHasSeenWelcome(seen === 'true');
  }, []);

  const markAsSeen = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenWelcome(true);
  };

  return { hasSeenWelcome, markAsSeen };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No type errors for `src/hooks/useWelcomeDialog.ts`

---

### Task 2: Create WelcomeDialog Component

**Files:**
- Create: `src/components/welcomeDialog/WelcomeDialog.tsx`

- [ ] **Step 1: Write dialog component (no SCSS file)**

```typescript
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Button as AlpsButton } from 'src/alps/atoms/Button';
import routes from 'src/routes';

type WelcomeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const WelcomeDialog = ({ isOpen, onClose }: WelcomeDialogProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Добре дошли!</DialogTitle>
      <DialogContent>
        <p>
          Добре дошли в обновения сайт на Адвентната българска мреж@.
        </p>
        <p>
          Използвайте страницата{' '}
          <NavLink to={routes.about('site-guide')} onClick={handleClose}>
            Ориентация в сайта
          </NavLink>
          , за да се запознаете с промените и да се ориентирате по-лесно.
        </p>
      </DialogContent>
      <DialogActions>
        <AlpsButton label="Разбрах" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
```

Note: No custom SCSS file. The component uses default MUI Dialog styles. If needed, dialog title styling is already defined globally in `src/styles/_dialog-title.scss`.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No type errors for `src/components/welcomeDialog/WelcomeDialog.tsx`

---

### Task 3: Integrate WelcomeDialog into Layout

**Files:**
- Modify: `src/layout/Layout.tsx:1,9,14`

- [ ] **Step 1: Add imports at top of file**

Add after existing imports (around line 1):
```typescript
import { WelcomeDialog } from 'src/components/welcomeDialog/WelcomeDialog';
import { useWelcomeDialog } from 'src/hooks/useWelcomeDialog';
```

- [ ] **Step 2: Use hook inside Layout component**

Add after line 8 (inside Layout function, before return):
```typescript
const { hasSeenWelcome, markAsSeen } = useWelcomeDialog();
```

- [ ] **Step 3: Render dialog in JSX**

Add after `<Header />` (around line 13-14):
```typescript
<WelcomeDialog isOpen={!hasSeenWelcome} onClose={markAsSeen} />
```

Expected result:
```typescript
import { Outlet } from 'react-router-dom';
import { Sabbath } from 'alps-library/organisms/asides/sabbath/Sabbath';
import { Main } from 'alps-library/templates/Main';
import { ResourceUnavailableNotice } from 'src/components/resourceNotification/ResourceUnavailableNotice';
import { WelcomeDialog } from 'src/components/welcomeDialog/WelcomeDialog';
import { useWelcomeDialog } from 'src/hooks/useWelcomeDialog';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  const { hasSeenWelcome, markAsSeen } = useWelcomeDialog();

  return (
    <div className="l-wrap">
      <div className="l-wrap__content l-content" role="document">
        <Header />
        <WelcomeDialog isOpen={!hasSeenWelcome} onClose={markAsSeen} />
        <ResourceUnavailableNotice />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </div>
      <Sabbath />
    </div>
  );
};
export default Layout;
```

- [ ] **Step 4: Verify dev server runs**

Run: `npm run dev`
Expected: Dev server starts, no console errors

- [ ] **Step 5: Test in browser**

1. Open http://localhost:5173
2. Clear localStorage for localhost:5173
3. Refresh page
4. Verify dialog appears with "Добре дошли!" title
5. Click "Разбрах"
6. Verify dialog closes
7. Refresh page
8. Verify dialog does NOT appear again

---

### Task 4: Update Routes Configuration

**Files:**
- Modify: `src/routes.tsx:61`

- [ ] **Step 1: Add 'site-guide' to about route type**

Change line 61 from:
```typescript
about: (item?: 'team' | 'banner' | 'feedback') =>
```

To:
```typescript
about: (item?: 'team' | 'banner' | 'feedback' | 'site-guide') =>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No type errors

---

### Task 5: Create Site Guide Page Component

**Files:**
- Create: `src/pages/about/SiteGuide.tsx`

- [ ] **Step 1: Write page component (no SCSS file, uses ALPS utility classes)**

```typescript
import { NavLink } from 'react-router-dom';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';

const SiteGuide = () => {
  const breadcrumbsUrls = [routes.about(), routes.about('site-guide')];

  return (
    <Page
      title={getTitle(routes.about('site-guide'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-spacing--double">
        <Caption>
          Ето кратко описание на структурата на сайта, за да можете лесно да
          намерите търсената информация.
        </Caption>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">
            На <NavLink to={routes.home}>началната страница</NavLink> ще намерите:
          </h2>
          <ul className="u-spacing u-space--top">
            <li>
              <strong>Реклами</strong> с бърз достъп до съботно-училищния урок за седмицата
            </li>
            <li>
              <strong>Библейски стих за деня</strong> с коментар (презарежда се
              автоматично всеки ден)
            </li>
            <li>
              <strong>
                Скорошни адвентни събития
              </strong>{' '}
              и такива, за които можете да се запишете
            </li>
            <li>
              <strong>Последни обяви</strong> от трите категории{' '}
              <NavLink to={routes.advertisement()}>обяви</NavLink> и връзки към
              тях
            </li>
            <li>
              <strong>Последните предавания и издания</strong> на{' '}
              <NavLink to={`${routes.home}#media`}>адвентни медии</NavLink> - телевизии,
              радио, издателство
            </li>
          </ul>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">
            Навигация
          </h2>
          <ul className="u-spacing u-space--top">
            <li>
              Най-отдолу на всяка страница има линк към стария сайт и имейл и
              тел. за контакт.
            </li>
            <li>
              Използвайте бутона <i className="fas fa-arrow-up"></i>, за да се
              върнете в началото на страницата, която разглеждате.
            </li>
            <li>
              Чрез цветната лента в дясно можете да отворите менюто бързо.
            </li>
            <li>
              Всички връзки към външни страници (други сайтове) са обозначени с
              тази иконка <i className="fa fa-external-link u-space--quarter--left"></i>
            </li>
          </ul>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">
            Църковен живот
          </h2>
          <ul className="u-spacing u-space--top">
            <li>
              <strong>
                <NavLink to={routes.churchLife('lessons')}>
                  Съботно училище
                </NavLink>
              </strong>{' '}
              - съдържа уроци за 3 различни възрастови групи, като към всеки урок
              има възможност да се отвори по-стар урок от тримесечието. Има
              отделна страница за{' '}
              <NavLink to={routes.churchLife('lessons-search')}>
                търсене на уроци
              </NavLink>{' '}
              от по-стари тримесечия, както и линк към детските уроци от стария
              сайт.
            </li>
            <li>
              В{' '}
              <strong>
                <NavLink to={routes.churchLife('events')}>
                  календара със събития
                </NavLink>
              </strong>{' '}
              можете да намерите събития от 2025г. до текущата година. За
              повечето от тях има връзки с повече информация и да планирате
              участието си в тях.
            </li>
            <li>
              <strong>
                <NavLink to={routes.commune()}>Общуване</NavLink>
              </strong>{' '}
              - включва{' '}
              <NavLink to={routes.commune('pastor-online')}>
                Пастор онлайн
              </NavLink>{' '}
              и линкове към Facebook групи за молитва и дискусии.
            </li>
            <li>
              <strong>
                <NavLink to={routes.churchLife('poetry')}>Поезия</NavLink>
              </strong>{' '}
              - духовни стихотворения и творчество.
            </li>
            <li>
              <strong>
                <NavLink to={routes.advertisement()}>Обяви</NavLink>
              </strong>{' '}
              - разделени на три категории:{' '}
              <NavLink to={routes.advertisement('services')}>
                услуги и работа
              </NavLink>
              ,{' '}
              <NavLink to={routes.advertisement('buySell')}>
                покупко-продажби и наеми
              </NavLink>
              ,{' '}
              <NavLink to={routes.advertisement('other')}>
                други
              </NavLink>
            </li>
            <li>
              <strong>
                <NavLink to={routes.churchLife('testimonies')}>
                  Опитностите
                </NavLink>
              </strong>{' '}(истории на вярата) са разделени на 4: видеа, видео-поредици, аудиокниги и истории от съботното-училищните уроци
            </li>
            <li>
              <strong>
                <NavLink to={routes.churchLife('donations')}>Дарения</NavLink>
              </strong>{' '}
              - информация за начини за подкрепа на адвентната работа.
            </li>
          </ul>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">
            БГ справочник
          </h2>
          <ul className="u-spacing u-space--top">
            <li>
              <strong>
                <NavLink to={routes.info('bibles')}>Библии</NavLink>
              </strong>{' '}
              - различни преводи и версии на Библията
            </li>
            <li>
              <strong>
                <NavLink to={routes.info('biblical')}>Библейски учения и курсове</NavLink>
              </strong>{' '}
              - линкове към курсове върху библейски тематики, видео поредици и основните вярвания на адвентистите
            </li>
            <li>
              <strong>
                <NavLink to={routes.churches}>Църкви</NavLink>
              </strong>{' '}
              - линкове към български адвентни църкви
            </li>
            
            <li>
              <strong>
                <NavLink to={routes.info('sunset')}>
                  Календар на залезите
                </NavLink>
              </strong>{' '}
              в петък и събота за населено място в България
            </li>
          </ul>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">Медии</h2>
          <p className="u-space--top">
            В менюто <strong><NavLink to={routes.media()}>Медии</NavLink></strong>{' '}
            ще намерите връзки към български и чужди адвентни сайтове и приложения.
          </p>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">Ресурси</h2>
          <p className="u-space--top">
            Всички ресурси за изтегляне ще намерите в менюто{' '}
            <strong>
              <NavLink to={routes.resources()}>Ресурси</NavLink>
            </strong>
            , като вече имате възможност и да слушате онлайн аудио проповеди, музика,
        книги.
          </p>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">Здраве</h2>
          <p className="u-space--top">
            Менюто <strong><NavLink to={routes.health()}>Здраве</NavLink></strong>{' '}
            е ново, в което ще намерите информация за{' '}
            <NavLink to={routes.health('new-start')}>програмата NEW START</NavLink>, сайтове
            с ресурси свързани със здравето,{' '}
            <NavLink to={routes.health('recipes')}>рецепти</NavLink> и{' '}
            <NavLink to={routes.health('institutions')}>
              адвентни български здравни институции
            </NavLink>.
          </p>
        </div>

        <div className="u-space--double--top">
          <h2 className="u-theme--color--darker u-font--primary--m">За нас</h2>
          <ul className="u-spacing u-space--top">
            <li>
              <strong>
                <NavLink to={routes.about('team')}>Екип</NavLink>
              </strong>{' '}
              - хората зад сайта.
            </li>
            <li>
              <strong>
                <NavLink to={routes.about('banner')}>Банер</NavLink>
              </strong>{' '}
              - банер на сайта за споделяне.
            </li>
            <li>
              <strong>
                <NavLink to={routes.about('feedback')}>Отзиви</NavLink>
              </strong>{' '}
              - отзиви от потребителите.
            </li>
            <li>
              <strong>
                <NavLink to={routes.changelog}>Какво ново</NavLink>
              </strong>{' '}
              - последни промени и подобрения.
            </li>
          </ul>
        </div>
      </section>
    </Page>
  );
};

export default SiteGuide;
```

Note: No SCSS file. Uses only ALPS utility classes from `public/css/main_alps_3.12.2.css` and classes defined in `src/App.scss`:
- `u-spacing--double` - double spacing
- `u-space--double--top` - double top margin
- `u-space--top` - top margin
- `u-space--half--top` - half top margin
- `u-space--quarter--left` - quarter left margin
- `u-theme--color--darker` - theme darker color
- `u-font--primary--m` - primary font medium size

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No type errors

---

### Task 6: Add Route for Site Guide Page

**Files:**
- Modify: `src/Router.tsx:72,270`

- [ ] **Step 1: Add lazy import after About import**

Add after line 72 (after `const About = lazy(...)`):
```typescript
const SiteGuide = lazy(() => import('./pages/about/SiteGuide'));
```

- [ ] **Step 2: Add route definition**

Add after line 267 (after the About route, around line 270):
```typescript
<Route path={routes.about('site-guide')} element={<SiteGuide />} />
```

Expected result around line 267-272:
```typescript
{/* За нас */}
<Route path={routes.about()} element={<About />} />
<Route path={routes.about('site-guide')} element={<SiteGuide />} />
<Route path={routes.about('team')} element={<Team />} />
<Route path={routes.about('banner')} element={<Banner />} />
<Route path={routes.about('feedback')} element={<Feedback />} />
```

- [ ] **Step 3: Verify dev server runs**

Run: `npm run dev`
Expected: No errors

- [ ] **Step 4: Test navigation**

1. Navigate to http://localhost:5173/about/site-guide
2. Verify page renders with title "Ориентация в сайта"
3. Verify breadcrumbs work
4. Verify all NavLinks render correctly
5. Click a few NavLinks to verify they navigate properly
6. Click link in WelcomeDialog
7. Verify it navigates to site-guide page and closes dialog

---

### Task 7: Add Site Guide to About Page Navigation

**Files:**
- Modify: `src/utils/Navigation.tsx:385-403`

- [ ] **Step 1: Add site-guide menu item to About subnav**

In the About navigation section (lines 383-403), add a new item to the subnav array after the opening bracket (around line 386):

```typescript
{
  type: 'primary',
  text: 'Ориентация в сайта',
  url: routes.about('site-guide'),
  faIconClass: 'fas fa-map-signs'
},
```

Expected result:
```typescript
{
  text: 'За нас',
  url: routes.about(),
  subnav: [
    {
      type: 'primary',
      text: 'Ориентация в сайта',
      url: routes.about('site-guide'),
      faIconClass: 'fas fa-map-signs'
    },
    {
      type: 'primary',
      text: 'Екип',
      url: routes.about('team'),
      faIconClass: 'fas fa-users'
    },
    {
      type: 'primary',
      text: 'Банер',
      url: routes.about('banner')
    },
    {
      type: 'primary',
      text: 'Отзиви',
      url: routes.about('feedback'),
      faIconClass: 'fas fa-comment-dots'
    }
  ]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Test navigation menu**

1. Navigate to http://localhost:5173/about
2. Verify "Ориентация в сайта" appears in the About subpages list
3. Verify it has the map-signs icon
4. Click it
5. Verify navigation to site-guide page works

---

### Task 8: Manual Testing & Verification

**Files:** None (testing only)

- [ ] **Step 1: Full flow test - first visit**

1. Clear browser localStorage for localhost
2. Navigate to http://localhost:5173
3. Verify WelcomeDialog appears
4. Click "Ориентация в сайта" link in dialog
5. Verify navigation to /about/site-guide
6. Verify dialog closes
7. Navigate to home
8. Verify dialog does NOT reappear

- [ ] **Step 2: Test site guide content**

1. Navigate to /about/site-guide
2. Verify all sections render correctly
3. Verify all NavLinks are styled correctly
4. Click "началната страница" link in first h2
5. Verify it navigates to home page
6. Go back to site-guide
7. Click multiple NavLinks from different sections
8. Verify all navigations work
9. Verify icons display (fa-arrow-up, fa-external-link)
10. Verify breadcrumbs work
11. Verify ALPS utility classes apply proper styling

- [ ] **Step 3: Test from About page**

1. Navigate to /about
2. Verify "Ориентация в сайта" appears first in subpages list
3. Verify map-signs icon displays
4. Click it
5. Verify navigation works

- [ ] **Step 4: Responsive testing**

1. Test on mobile viewport (375px width)
2. Verify dialog is readable
3. Verify site-guide page is readable
4. Verify navigation links are clickable on mobile
5. Test on tablet viewport (768px width)
6. Verify layout adapts properly

- [ ] **Step 5: Production build test**

Run: `npm run build && npm run preview`
Expected:
- Build succeeds with no errors
- Preview server starts
- All functionality works in production build
- Dialog appears on first visit
- Navigation works correctly

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Welcome dialog on first visit — Task 1-3
- ✅ Dialog text: "Добре дошли в обновения сайт..." — Task 2
- ✅ Link to About/site-guide page — Task 2
- ✅ localStorage persistence (don't show again) — Task 1
- ✅ Site guide page with full structure description — Task 5
- ✅ Caption appropriate for orientation guide page — Task 5
- ✅ "началната страница" is the NavLink, not "Реклами" — Task 5
- ✅ All major sections covered: Home, Navigation, Църковен живот, БГ справочник, Медии, Ресурси, Здраве, За нас — Task 5
- ✅ NavLinks to all mentioned pages — Task 5
- ✅ Navigation integration — Task 7

**No placeholders:**
- ✅ All code is complete
- ✅ No TBD/TODO markers
- ✅ All paths are absolute and correct
- ✅ No "add appropriate..." comments

**Type consistency:**
- ✅ `hasSeenWelcome` boolean used consistently
- ✅ `markAsSeen` function signature matches usage
- ✅ Route types updated in routes.tsx
- ✅ All imports use correct TypeScript paths

**Pattern consistency:**
- ✅ Follows existing Dialog pattern (MessageDialog) — no custom SCSS
- ✅ Follows existing hook pattern (useChangelog)
- ✅ Follows existing Page pattern (Feedback.tsx) — no blockType, uses Caption
- ✅ Uses existing ALPS components (Caption, AlpsButton)
- ✅ Uses ALPS utility classes (u-spacing--, u-space--, u-theme--color--)
- ✅ Uses NavLink from react-router-dom
- ✅ Uses MUI Dialog like other dialogs in codebase
- ✅ Uses useCallback for event handlers like MessageDialog

**No git commits:**
- ✅ All commit steps removed from plan
- ✅ Tasks focus only on implementation and testing

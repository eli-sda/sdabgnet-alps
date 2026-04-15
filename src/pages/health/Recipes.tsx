import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';

const Recipes = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), routes.health('recipes')];

  const [recipes, setRecipes] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/json/recipes.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setRecipes(data))
      .catch((err) => {
        console.error('Failed to load recipes.json', err);
        setRecipes([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.health('recipes'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <MediaListSection sections={recipes} doubleSpace />
    </Page>
  );
};

export default Recipes;

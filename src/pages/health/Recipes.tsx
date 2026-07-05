import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';
import { LinksBlock } from '../links/LinksBlock';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { AccordionItem } from 'src/alps/molecules/components/accordion/AccordionItem';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { useScrollToHash } from 'src/hooks/useScrollToHash';

interface ReelRecipe {
  id: string;
  title: string;
  description?: string;
  image: string;
  reelUrl: string;
}

const Recipes = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), routes.health('recipes')];

  const [recipes, setRecipes] = useState<LinksData[]>([]);
  const [reels, setReels] = useState<ReelRecipe[]>([]);
  useScrollToHash();

  useEffect(() => {
    fetch('/json/recipes.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setRecipes(data))
      .catch((err) => {
        console.error('Failed to load recipes.json', err);
        setRecipes([]);
      });
  }, []);

  useEffect(() => {
    fetch('/json/recipes-reels.json')
      .then((res) => res.json())
      .then((data: ReelRecipe[]) => setReels(data))
      .catch((err) => {
        console.error('Failed to load recipes-reels.json', err);
        setReels([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.health('recipes'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-spacing">
        <Pullquote
          quote="Нека храната бъде вашето лекарство, и вашето лекарство да бъде храната ви!"
          author="Хипократ"
        />
        <MediaListSection sections={recipes} doubleSpace />

        {reels.length > 0 && (
          <Accordion>
            <AccordionItem
              id="reels"
              heading={
                <div>
                  <h3>Рецепти от фейсбук ленти</h3>
                  <h4>
                    <em>Рецептите са долу в описанието на всяко видеото</em>
                  </h4>
                </div>
              }
            >
              <div className="u-spacing">
                {reels.map((reel) => (
                  <LinksBlock
                    key={reel.id}
                    title={reel.title}
                    picture={reel.image}
                    colorDescription={reel.description}
                    buttons={[
                      {
                        label: 'Виж рецептата',
                        url: reel.reelUrl,
                        small: true,
                        isExternal: true
                      }
                    ]}
                  />
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </section>
    </Page>
  );
};

export default Recipes;

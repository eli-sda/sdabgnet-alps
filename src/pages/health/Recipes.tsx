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
  description: string;
  image: string;
  reelUrl: string;
}
const reelsFromKeys = ['Banya'];
const reelsLabels: Record<string, string> = {
  Banya: '„Център за здраве", с. Баня'
};

const Recipes = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), routes.health('recipes')];

  const [recipes, setRecipes] = useState<LinksData[]>([]);
  const [reels, setReels] = useState<Map<string, ReelRecipe[]>>(new Map());
  useScrollToHash({ enabled: recipes.length > 0 });

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
    reelsFromKeys.forEach((key) => {
      fetch(`/json/recipes-reels-${key}.json`)
        .then((res) => res.json())
        .then((data: ReelRecipe[]) =>
          setReels((prev) => new Map(prev).set(key, data))
        )
        .catch((err) => {
          console.error(`Failed to load recipes-reels-${key}.json`, err);
        });
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

        {reels.size > 0 && (
          <Accordion>
            {reelsFromKeys.map((key) => {
              const items = reels.get(key);
              if (!items?.length) return null;
              return (
                <AccordionItem
                  key={key}
                  id={`reels-${key}`}
                  heading={
                    <div>
                      <h3>Рецепти от {reelsLabels[key] ?? key}</h3>
                      <h4>
                        <em>
                          Натиснете &quot;Вижте повече&quot; под всяко видео, за
                          да видите рецептата в описанието
                        </em>
                      </h4>
                    </div>
                  }
                >
                  <div className="u-spacing">
                    {items.map((reel) => (
                      <LinksBlock
                        key={reel.id}
                        title={reel.title}
                        description={reel.description}
                        picture={reel.image}
                        buttons={[
                          {
                            label: 'Виж във Facebook',
                            url: reel.reelUrl,
                            small: true,
                            isExternal: true
                          }
                        ]}
                      />
                    ))}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </Page>
  );
};

export default Recipes;

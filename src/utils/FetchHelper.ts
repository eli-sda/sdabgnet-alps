import { client, clientVreses } from 'src/sanityClient';
import { PageMetaMap, PageMetaType } from './PageMeta';
import {
  AdvertisementsMap,
  AdvertisementType
} from 'src/contexts/AdvertisementsContext';
import { QuestionType } from 'src/contexts/QuestionsContext';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

export const loadPagesMeta = async (): Promise<PageMetaMap> => {
  const query = `*[_type == "page"] {
      title,
      "path": path.current,
      description,
      keyWords,
      headerImage,
      image,
      "imageUrl": headerImage.asset->url
    }`;

  // Fetch the page meta data from Sanity
  const data: PageMetaType[] = await client.fetch(query);
  const metaMap: PageMetaMap = {};

  data.forEach((meta) => {
    if (!meta.path) return;
    metaMap[meta.path] = meta;
  });
  return metaMap;
};

export const loadAdvertisements = async (): Promise<AdvertisementsMap> => {
  const adQuery = `*[_type == "advertisement"] | order(date desc) {
    _id,
    type,
    date,
    name,
    place,
    email,
    phone,
    hasViber,
    text,
    image
  }`;

  const advertisements: AdvertisementType[] = await clientVreses.fetch(adQuery);
  const adsMap: AdvertisementsMap = {};

  advertisements.forEach((ad) => {
    if (!ad.type) return;

    if (!adsMap[ad.type]) {
      adsMap[ad.type] = [];
    }

    adsMap[ad.type].push(ad);
  });

  return adsMap;
};

export const loadQuestions = async (): Promise<QuestionType[]> => {
  const questionsQuery = `*[_type == "questionAnswer"] | order(_createdAt desc) {
   name,
   text,
   answer
}`;

  const questions: QuestionType[] = await clientVreses.fetch(questionsQuery);

  return questions;
};

export const loadPlaylists = async (type: string): Promise<PlaylistType[]> => {
  const playlistQuery = `*[
    isResource == true
    ${type === 'image' ? '' : '&& _type == "playlist"'}
    && type == "${type}"
  ] | order(_createdAt desc) {
    _id,
    // isResource,
    // type,
    // isResource,
    // type,
    author,
    title,
    // keyWords,
    // image,
    ${
      type === 'image'
        ? `"path": select(isResource == true => "images/" + fileName, true => URL)`
        : `"items": items[_type == "reference"]->{
            _id,
            // isResource,
            author,
            title,
            description,
            size,
            // keyWords,
            "path": select(
              isResource == true => ^.slug.current + "/" + fileName,
              true => URL
            )
          }`
    }
  }`;

  return await client.fetch(playlistQuery);
};

import { ButtonProps } from 'src/alps/atoms/Button';
import { LinkItem } from 'src/utils/Links';

export type ExternalPageLink = {
  url: string;
  title: string;
  description: string;
  img: string;
  buttons?: ButtonProps[];
  links?: LinkItem[];
};

import { ButtonProps } from "src/alps/atoms/Button";

export type ExternalPageLink = {
  url: string;
  title: string;
  description: string;
  img: string;
  buttons?: ButtonProps[];
};

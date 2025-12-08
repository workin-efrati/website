export type Article = {
  title: string;
  start: number;
  end: number;
};

export type Parsha = {
  name: string;
  page_start: number;
  page_end: number;
  articles: Article[];
};

export type TorahBook = {
  name: string;
  page_start: number;
  page_end: number;
  parashot: Parsha[];
};

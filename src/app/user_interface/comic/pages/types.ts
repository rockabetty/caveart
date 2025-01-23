export interface ComicPage {
  id?: number;
  comic_id?: number;
  title?: string;
  meta_description?: string;
  mouseover_text?: string;
  high_res_image_url?: string;
  low_res_image_url?: string;
  embedCode?: string;
  imageSource?: "upload" | "url" | "embed";
  author_comment: string;
  enable_html_author_comment?: boolean;
  release_on: Date;
  chapter_id?: number;
  tags?: string[];
  transcript?: string;
  viewCount?: number;
  likeCount?: number;
};

export interface NewPageSubmission extends ComicPage = {
  newPageNumber: number;
  image?: FileList | File;
};

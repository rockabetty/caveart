export interface ComicPage {
  id?: number;
  title?: string;
  mouseoverText?: string;
  imageUrl?: string;
  embedCode?: string;
  imageSource?: "upload" | "url" | "embed";
  imageUrl?: string;
  embedCode?: string;
  authorComment: string;
  enableHtmlAuthorComment?: boolean;
  releaseOn: Date;
  chapterId?: number;
  tags?: string[];
  transcript?: string;
  viewCount?: number;
  likeCount?: number;
};

export interface NewPageSubmission extends ComicPage = {
  newPageNumber: number;
  image?: FileList | File;
};

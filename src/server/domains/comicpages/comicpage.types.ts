export type ComicPageCompressionRequest = {
  page_id: number;
  original_url: string;
  comic_id: number;
  page_number: number;
};

export type ComicPage = {
	page_number: number;
	img: string;
	comic_id: Readonly<number>;
	id?: Readonly<number>;
	chapter_id?: number;
	high_res_image_url?: string;
	low_res_image_url?: string;
	thumbnail_image_url?: string;
	author_comment?: string;
	created_at?: Readonly<Date> | string;
	release_on?: Readonly<Date> | string;
	view_count?: number;
	like_count?: number;
	next_id?: number;
	prev_id?: number;
};

export type ComicChapter = {
	id?: Readonly<number>;
	name?: string;
	comic_id: number;
	chapter_number: number;
	description?: string;
	thumbnail_image_url?: string;
};

export type PageReference = {
	id: number;
	page_number: number;
};

export type ComicPageField = keyof ComicPage;
export type ComicChapterField = keyof ComicChapter;

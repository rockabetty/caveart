export type ComicPage = {
	page_number: number;
	img: string;
	comic_id: Readonly<number>;
	id?: Readonly<number>;
	chapter_id?: number;
	author_comment?: string;
	created_at?: Readonly<Date> | string;
	release_on?: Readonly<Date> | string;
	view_count?: number;
	like_count?: number;
	next_id?: number;
	prev_id?: number;
};

export type ComicChapter = {
	id: number;
	comic_id: number;
	chapter_number: number;
	name?: string;
	description?: string;
	thumbnail_image_url?: string;
};

export type PageReference = {
	id: number;
	page_number: number;
};

export type ComicPageField = keyof ComicPage;

export type ComicChapter = {
	id?: Readonly<number>;
	name?: string;
	index: number;
	description?: string;
	comic_id: Readonly<number>;
	thumbnail: string;
};

export type ComicChapterField = keyof ComicChapter;

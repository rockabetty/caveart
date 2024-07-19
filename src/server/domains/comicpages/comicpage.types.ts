export type ComicPage = {
	id?: Readonly<number>,
	page_number: number,
	img: string,
	comic_id: Readonly<number>,
	chapter_id?: number,
	author_comment?: string,
	created_at: Readonly<Date>,
	release_on?: Date,
	view_count?: number,
	like_count?: number
}

export type ComicPageField = keyof ComicPage;

export type ComicChapter = {
	id?: Readonly<number>,
	name?: string,
	index: number,
	description?: string,
	comic_id: Readonly<number>;
	thumbnail: string
}

export type ComicChapterField = keyof ComicChapter;
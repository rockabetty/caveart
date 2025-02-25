import { ErrorKeys as CoreErrorKeys } from '../../errors.types'

export enum ErrorKeys {
	...CoreErrorKeys,
	IMAGE_MISSING = 'server.comicpages.errors.imageMissing',
	COMIC_MISSING = 'server.comicpages.errors.comicMissing',
	COMIC_PAGE_MISSING = 'server.comicpages.errors.comicPageMissing',
	COMIC_INVALID = 'server.comicpages.errors.comicInvalid',
	PAGE_NUMBER_MISSING = 'server.comicpages.errors.pageNumberMissing',
	ERROR_CREATING_COMPRESSION_TASK = 'server.comicpages.errors.compressionTaskNotCreated',
}
export type Genre = {
    id: number;
    name: string;
    description?: string;
    path_name?: string;
};

export type GenreSelection = {
    [id: string]: string
}
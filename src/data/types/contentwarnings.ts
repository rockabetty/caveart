export type ContentWarning = {
    id?: number;
    name: string;
    description?: string;
    parent_id?: number;
};

export type NestedContentWarning = {
    id?: number;
    name: string;
    description?: string;
    parent_id?: number;
    children?: NestedContentWarning[]
};
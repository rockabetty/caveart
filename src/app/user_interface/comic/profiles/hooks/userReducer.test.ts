import { comicProfileReducer, initialState, ComicProfileAction } from "./comicProfileReducer";
import { ComicData } from "../types";

describe("comicProfileReducer", () => {
  it("should not modify state for unknown action types", () => {
    const action = { type: "UNKNOWN_ACTION", payload: {} }
    // @ts-expect-error
    const result = comicProfileReducer(initialState, action);
    expect(result).toEqual(initialState);
  });

  it("should handle GET_COMIC_PROFILE", () => {
    const mockProfile: ComicData = {
      id: "1",
      title: "Test Comic",
      subdomain: "test-comic",
      description: "This is a test comic",
      genres: {},
      content_warnings: {},
      rating: "All Ages",
      thumbnail: undefined,
      likes: true,
      comments: "Allowed",
      visibility: "Public",
    };

    const action: ComicProfileAction = {
      type: "GET_COMIC_PROFILE",
      payload: { profile: mockProfile },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.profile).toEqual(mockProfile);
    expect(result.loading).toBe(false);
  });

  it("should handle GET_COMIC_PERMISSIONS", () => {
    const permissions = { edit: true, delete: false };
    const action: ComicProfileAction = {
      type: "GET_COMIC_PERMISSIONS",
      payload: { permissions },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.permissions).toEqual(permissions);
  });

  it("should handle EDIT_FORM_FIELD", () => {
    const action: ComicProfileAction = {
      type: "EDIT_FORM_FIELD",
      fieldName: "title",
      value: "Updated Title",
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.update.title).toEqual("Updated Title");
  });

  it("should handle EDIT_COMIC_RATING", () => {
    const action: ComicProfileAction = {
      type: "EDIT_COMIC_RATING",
      payload: { rating: "Mature (17+)" },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.update.rating).toEqual("Mature (17+)");
  });

  it("should handle CREATE_OR_EDIT_COMIC_SUCCESS", () => {
    const action: ComicProfileAction = {
      type: "CREATE_OR_EDIT_COMIC_SUCCESS",
      payload: { successMessage: "Comic created successfully!" },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.successMessage).toEqual("Comic created successfully!");
  });

  it("should handle CREATE_OR_EDIT_COMIC_FAILURE", () => {
    const action: ComicProfileAction = {
      type: "CREATE_OR_EDIT_COMIC_FAILURE",
      payload: { error: "Failed to create comic" },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.submissionError).toEqual("Failed to create comic");
  });

  it("should handle LOADING action", () => {
    const action: ComicProfileAction = {
      type: "LOADING",
      payload: { loading: true },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  it("should handle RECOMMEND_REDIRECT", () => {
    const action: ComicProfileAction = {
      type: "RECOMMEND_REDIRECT",
      payload: { redirect: "/comics/mine" },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.redirect).toEqual("/comics/mine");
  });
});
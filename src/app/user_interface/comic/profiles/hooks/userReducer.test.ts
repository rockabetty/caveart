import { comicProfileReducer, initialState, ComicProfileAction } from "./comicProfileReducer";
import { ComicData } from "../types";

export const mockProfile: ComicData = {
  id: 1,
  genres: { 5: { id: 5, name: "Sci-Fi", description: "aliens and stuff"} },
  content_warnings: { "violence": { name: "someViolence", id: 420, description: "Oh boy, here I go killing again"} },
  description: "Bonds diversified, necks protected",
  title: "Robert Telles Tells All",
  subdomain: "test",
  thumbnail: "www.imageplace.com/image.jpg",
  rating: "Mature (17+)",
  likes: true,
  comments: "Allowed",
  visibility: "Public"
};

describe("comicProfileReducer", () => {
  it("should not modify state for unknown action types", () => {
    const action = { type: "UNKNOWN_ACTION", payload: {} }
    // @ts-expect-error
    const result = comicProfileReducer(initialState, action);
    expect(result).toEqual(initialState);
  });

  it("should handle GET_COMIC_PROFILE", () => {
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

  it("should handle SERVER_RESPONSE_SUCCESS", () => {
    const action: ComicProfileAction = {
      type: "SERVER_RESPONSE_SUCCESS",
      payload: { successMessage: "Comic created successfully!" },
    };

    const result = comicProfileReducer(initialState, action);
    expect(result.successMessage).toEqual("Comic created successfully!");
  });

  it("should handle SERVER_RESPONSE_FAILURE", () => {
    const action: ComicProfileAction = {
      type: "SERVER_RESPONSE_FAILURE",
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
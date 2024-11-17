import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  deleteComic,
  fetchProfile,
  fetchProfileToUpdate,
  fetchPermissions,
  handleEditSuccess,
  handleSubmissionSuccess,
  handleSubmissionError,
  handleError,
  updateFormfield
} from "./comicProfileActions";
import { mockProfile } from "./userReducer.test";
const tenant = "test";
const comicID = 1;

describe("Facilitating CRUD Operations", () => {
  let mock: MockAdapter = new MockAdapter(axios);
  let dispatch: jest.Mock;

  beforeEach(() => {
    mock.reset();
    dispatch = jest.fn();
  });

  afterEach(() => {
    mock.reset();
  });

  it("lets users delete a comic", async () => {
    mock.onPost(`/api/comic/${comicID}/delete`).reply(200);
    await deleteComic(comicID)(dispatch);
    expect(dispatch).toHaveBeenCalledWith({ type: "DELETE_COMIC" });
  });

  it("Allows any viewer to look at a (public) comic profile", async () => {
    mock.onGet(`/api/comic/${tenant}`).reply(200, mockProfile);
    await fetchProfile(tenant)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      payload: { profile: mockProfile },
      type: "GET_COMIC_PROFILE",
    });
  });

  it("Handles network errors gracefully and dispatches an error action", async () => {
    mock.onGet(`/api/comic/${tenant}`).reply(500);
    await fetchProfile(tenant)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "SERVER_RESPONSE_FAILURE",
      payload: expect.objectContaining({ error: "An error occurred" }),
    });
  });

  it("Advises a redirect if it can't find the resource", async () => {
    const mockResponse = {
      status: 400,
      data: {
        subdomain: "new-subdomain",
      },
    };
    mock.onGet(`/api/comic/${tenant}`).reply(400, mockResponse.data);
    await fetchProfile(tenant)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: "RECOMMEND_REDIRECT",
        payload: { redirect: "new-subdomain" },
      }),
    );
  });

  it("Provides a means to render loading status while fetching a profile", async () => {
    mock.onGet(`/api/comic/${tenant}`).reply(200);
    await fetchProfile(tenant)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: "LOADING",
        payload: { loading: true },
      }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: "LOADING",
        payload: { loading: false },
      }),
    );
  });

  it("Doesn't let unauthorized users initiate a comic edit", async () => {
    const mockResponse = {
      status: 200,
      data: {
        edit: false,
      },
    };
    mock
      .onGet(`/api/comic/${tenant}/permissions`)
      .reply(200, mockResponse.data);
    await fetchProfileToUpdate(tenant)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: "LOADING",
        payload: { loading: true },
      }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: "LOADING",
        payload: { loading: false },
      }),
    );
  });

  it("Lets authors of comics initiate editing", async () => {
    const mockPermissionsResponse = {
      edit: true,
    };
    mock
      .onGet(`/api/comic/${tenant}/permissions`)
      .reply(200, mockPermissionsResponse);
    mock.onGet(`/api/comic/${tenant}`).reply(200, mockProfile);
    await fetchProfileToUpdate(tenant)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: "GET_COMIC_PROFILE_TO_UPDATE",
        payload: {
          profile: mockProfile,
          update: mockProfile,
        },
      }),
    );
  });

  it("Defaults to no permissions if the server response is empty or malformed", async () => {
    const mockPermissionsResponse = {};
    mock
      .onGet(`/api/comic/${tenant}/permissions`)
      .reply(200, mockPermissionsResponse);
    await fetchPermissions(tenant)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "GET_COMIC_PERMISSIONS",
        payload: {
          permissions: { edit: false },
        },
      }),
    );

    mock
      .onGet(`/api/comic/${tenant}/permissions`)
      .reply(200, { flibberdyGhibbets: true });
    await fetchPermissions(tenant)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "GET_COMIC_PERMISSIONS",
        payload: {
          permissions: { edit: false },
        },
      }),
    );
  });
});

describe("Profile Updater", () => {

  let dispatch: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("Dispatches the correct action to update any field", () => {
    const fieldName = "title";
    const value = "My Comic";
    updateFormfield(fieldName, value)(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: "EDIT_FORM_FIELD",
      fieldName,
      value,
    });
  });

  it("Handles updating a boolean field (e.g., likes)", () => {
    const fieldName = "likes";
    const value = false;

    updateFormfield(fieldName, value)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "EDIT_FORM_FIELD",
      fieldName,
      value,
    });
  });

  it("Handles updating complex fields (e.g., content warnings)", () => {
    const fieldName = "content_warnings";
    const value = { violence: { name: "Violence", id: "violence" } };
    updateFormfield(fieldName, value)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "EDIT_FORM_FIELD",
      fieldName,
      value,
    });
  });
});

describe("User feedback", () => {
  let dispatch: jest.Mock;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("Provides a means for visual feedback on a successful edit submission", () => {
    handleEditSuccess()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SERVER_RESPONSE_SUCCESS",
        payload: { successMessage: "comicProfile.editSuccessful" },
      }),
    );
  });

  it("Provides a means for visual feedback on successful creation of a new comic", () => {
    handleSubmissionSuccess()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SERVER_RESPONSE_SUCCESS",
        payload: { successMessage: "comicProfile.comicCreated" },
      }),
    );
  });

  it("Provides a means for visual feedback on submission issues", () => {
    const errorMessage = "errorStringGoesHere";
    handleSubmissionError(errorMessage)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SERVER_RESPONSE_FAILURE",
        payload: { error: `comicProfile.errors.${errorMessage}` },
      }),
    );
  });

  it("Handles no arguments gracefully in handleSubmissionError", () => {
    // @ts-expect-error
    handleSubmissionError()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SERVER_RESPONSE_FAILURE",
        payload: { error: "comicProfile.errors.unknown" },
      }),
    );
  });
});

describe("General Error Handling", () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs errors to the console", () => {
    const testError = new Error("Test error");
    handleError(testError, mockDispatch);
    expect(console.error).toHaveBeenCalledWith(testError);
  });

  it("dispatches the error message if the response has a specific error message", () => {
    const errorResponse = {
      response: {
        data: {
          error: "jimmyhendrix",
        },
      },
    };

    handleError(errorResponse, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SERVER_RESPONSE_FAILURE",
      payload: { error: "comicProfile.errors.jimmyhendrix" },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOADING",
      payload: { loading: false },
    });
  });

  it("dispatches a generic error message if the response is missing the error property", () => {
    const errorResponse = {
      response: {
        data: {},
      },
    };

    handleError(errorResponse, mockDispatch);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SERVER_RESPONSE_FAILURE",
      payload: { error: "comicProfile.errors.unknown" },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOADING",
      payload: { loading: false },
    });
  });

  it("dispatches a generic error message if the error object is undefined", () => {
    handleError(undefined, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SERVER_RESPONSE_FAILURE",
      payload: { error: "comicProfile.errors.unknown" },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOADING",
      payload: { loading: false },
    });
  });
});

import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  deleteComic,
  fetchProfile,
  fetchProfileToUpdate,
} from "./comicProfileActions";

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
    const comicID = 1;
    mock.onPost(`/api/comic/${comicID}/delete`).reply(200);
    await deleteComic(comicID)(dispatch);
    expect(dispatch).toHaveBeenCalledWith({ type: "DELETE_COMIC" });
  });

  it("Allows any viewer to look at a (public) comic profile", async () => {
    const tenant = "testcomic";
    mock.onGet(`/api/comic/${tenant}`).reply(200);
    await fetchProfile(tenant)(dispatch);
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      payload: { profile: undefined },
      type: "GET_COMIC_PROFILE",
    });
  });

  it("Handles network errors gracefully and dispatches an error action", async () => {
    const tenant = "testcomic";
    mock.onGet(`/api/comic/${tenant}`).reply(500);
    await fetchProfile(tenant)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "SERVER_RESPONSE_FAILURE",
      payload: expect.objectContaining({ error: "An error occurred" }),
    });
  });

  it("Advises a redirect if it can't find the resource", async () => {
    const tenant = "testcomic";
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
    const tenant = "testcomic";
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
    const tenant = "testcomic";
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
    const tenant = "testcomic";
    const mockPermissionsResponse = {
      edit: true,
    };
    mock
      .onGet(`/api/comic/${tenant}/permissions`)
      .reply(200, mockPermissionsResponse);

    const mockProfileResponse = {
      id: "1",
      title: "Test Comic",
      description: "A test comic description",
    };
    mock.onGet(`/api/comic/${tenant}`).reply(200, mockProfileResponse);
    await fetchProfileToUpdate(tenant)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: "GET_COMIC_PROFILE_TO_UPDATE",
        payload: {
          profile: mockProfileResponse,
          update: mockProfileResponse,
        },
      }),
    );

  });
});

// })

// describe("Fetch permissions", () => {
//   it("Fetches all of a user's permissions to edit a specific comic", () => {})
//   it("Handles an empty permissions response gracefully", () => {});
// })

// describe("Profile Updater", () => {
//   it("Validates required fields before dispatching updates", () => {});
//   it("Lets a user change a comic's title", () => {});
//   it("Lets a user change a comic's subdomain", () => {});
//   it("Lets a user change a comic's description", () => {});
//   it("Lets a user change a comic's genre selection", () => {});
//   it("Lets a user change a comic's content warnings", () => {});
//   it("Lets a user change a comic's thumbnail", () => {});
//   it("Updates ratings when content warnings change", () => {
//   });
//   it("marks adult content appropriately given adult content warnings", () => {});
//   it("Uploads thumbnails", ()=> {
//     // test that uploadToS3 gets called if you run uploadComicThumbnail and that you get the right dispatch
//   });

// })

// describe("User feedback", () => {
//   it("Confirms that updates on existing comics were successful", () => {
//     // test handleEditSuccess
//   })
//   it("Confirms that submissions of new comics were successful", () => {
//     // test handleSubmissionSuccess
//   })
//   it("provides a centralized means of reporting its own errors with a dispatch", () => {
//     // test the handleError function
//   });
//   describe("Reports on issues with user submissions", () => {
//     // test handleSubmissionError
//   });
// });

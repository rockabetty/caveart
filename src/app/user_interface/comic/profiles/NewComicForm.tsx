import { Form, Radio, Checkbox } from "@components";
import "./ComicProfiles.css";
import { useComicProfile } from "./hooks/useComicProfile";
import ComicProfileForm from "./ComicProfileForm";
import { useTranslation } from "react-i18next";
import axios from "axios";
import React from "react";

const NewComicForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    state,
    setField,
    setSubmissionError,
    confirmCreation,
    uploadThumbnail,
    uploadUrl,
  } = useComicProfile();
  const { update, submissionError } = state;

  const handleLikesChange = () => {
    const enabled = !update.likes;
    setField("likes", enabled);
  };

  const handleCommentsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setField("comments", value);
  };

  const handleVisibilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setField("visibility", value);
  };

  const handleFormSubmit = async () => {
    let submission = {
      title: update.title,
      subdomain: update.subdomain,
      description: update.description,
      genres: [] as string[],
      content: [] as number[],
      visibility: update.visibility,
      comments: update.comments,
      rating: update.rating,
      likes: update.likes,
      thumbnail: update.thumbnail,
    };

    if (!update.title) {
      return setSubmissionError("comicProfile.errors.titleMissing");
    }
    if (!update.subdomain) {
      return setSubmissionError("comicProfile.errors.subdomainMissing");
    }

    console.log(submission);

    try {
      submission.genres = Object.keys(update.genres);
      for (const value of Object.values(update.content_warnings)) {
        submission.content.push(value.id);
      }

      const creation = await axios.post(`/api/comic/new`, submission);

      console.log(creation);

      const { id } = creation.data;

      if (!id) {
        throw new Error("No comic ID.");
      }

      console.log("time to uploadThumbnail");

      await uploadThumbnail(submission.thumbnail, id);

      // confirmCreation(creation.data);
    } catch (error) {
      const message = error.response.data.error;
      setSubmissionError(message);
    }
  };

  return (
    <Form
      id="new_comic"
      submitLabel={t("comicProfile.create")}
      formValues={update}
      onSubmit={handleFormSubmit}
      submissionError={submissionError}
    >
      <ComicProfileForm />
      <div className="comic-profile_settings">
        <fieldset>
          <legend>Comments</legend>
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments === "Allowed"}
            name="comments"
            value="Allowed"
            id="comments_on"
            labelText={t("comicProfile.comments.allowed")}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments === "Moderated"}
            name="comments"
            value="Moderated"
            id="comments_moderated"
            labelText={t("comicProfile.comments.moderated")}
          />
          <Radio
            onChange={handleCommentsChange}
            checked={update.comments === "Disabled"}
            name="comments"
            value="Disabled"
            id="comments_off"
            labelText={t("comicProfile.comments.disabled")}
          />
        </fieldset>
        <fieldset>
          <legend>Likes</legend>
          <Checkbox
            onChange={handleLikesChange}
            checked={update.likes}
            name="likes"
            id="likes"
            labelText={t("comicProfile.likes.enabled")}
          />
        </fieldset>
        <fieldset>
          <legend>Visibility</legend>
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Public"}
            name="visibility"
            value="Public"
            id="visibility_public"
            labelText={t("comicProfile.visibility.public")}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Unlisted"}
            name="visibility"
            value="Unlisted"
            id="visibility_unlisted"
            labelText={t("comicProfile.visibility.unlisted")}
          />
          <Radio
            onChange={handleVisibilityChange}
            checked={update.visibility === "Invite-Only"}
            name="visibility"
            value="Invite-Only"
            id="visibility_private"
            labelText={t("comicProfile.visibility.private")}
          />
        </fieldset>
      </div>
    </Form>
  );
};

export default NewComicForm;

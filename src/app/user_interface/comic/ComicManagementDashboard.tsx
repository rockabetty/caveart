import { useState, useMemo } from "react";
import { Modal, TabGroup } from "@components";
import ComicProfile from "@features/comic/profiles/ComicProfile";
import EditComicProfile from "@features/comic/profiles/EditComicProfile";
import NewComicPageForm from "@features/comic/pages/NewComicPageForm";
import ThumbnailGallery from "@features/comic/pages/ThumbnailGallery";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import ComicDeletionConfirmationForm from "@features/comic/profiles/ComicDeletionConfirmationForm";

type ComicManagementDashboardProps = {
  tenant: string;
  initialTab: string;
}

function ComicManagementDashboard(props: ComicManagementDashboardProps) {
  const { t } = useTranslation();
  const {tenant, initialTab} = props;

  const actions = [
    { key: "overview", name: t("comicsDashboard.actions.overview") },
    { key: "edit", name: t("comicsDashboard.actions.edit") },
    { key: "pages", name: t("comicsDashboard.actions.pages") },
    { key: "comments", name: t("comicsDashboard.actions.comments") },
  ];

  const [deletionConfirmationModalOpen, setDeletionConfirmationModalOpen] =
    useState<boolean>(false);
  const [comicPendingDeletion, setComicPendingDeletion] = useState<string>("");
  const [deletionConfirmationString, setDeletionConfirmationString] =
    useState<string>("");
  const [deletionErrorText, setDeletionErrorText] = useState<string>("");
  const [comicDeleted, setComicDeleted] = useState<boolean>(false);

  const onDeletionConfirmationInput = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setDeletionConfirmationString(e.target.value);
  };

  const beginDeletion = function (title) {
    setComicPendingDeletion(title);
    setDeletionConfirmationModalOpen(true);
  };

  const cancelDeletion = function () {
    setDeletionConfirmationModalOpen(false);
    setComicPendingDeletion("");
  };

  const isValidDeletionAttempt = function () {
    return deletionConfirmationString === comicPendingDeletion;
  };

  const deleteComic = async function () {
    if (isValidDeletionAttempt()) {
      return axios
        .post("/api/comic/delete", { subdomain: deletionConfirmationString })
        .then(() => {
          setDeletionConfirmationModalOpen(false);
          setComicDeleted(true);
          setComicPendingDeletion("");
        })
        .catch((error) => {
          setDeletionErrorText(error);
          console.error(error);
        });
    } else {
      setDeletionErrorText(t("comicProfile.deletion.invalidDeletion"));
    }
  };

  const PagesTab = (
    <>
      <NewComicPageForm tenant={tenant} />
      <h2>Edit Pages</h2>
      <ThumbnailGallery tenant={tenant} />
    </>
  );

  const tabsContent = {
    overview: (
      <ComicProfile tenant={tenant} onDelete={beginDeletion} />
    ),
    edit: <EditComicProfile tenant={tenant} />,
    pages: PagesTab,
    comments: <div>NOBODY LOVES YOU</div>,
  };

  if (comicDeleted)
    return (
      <div className="tile">
        <p>{t("comicProfile.deletion.isDeleted")}</p>
      </div>
    );

  return (
    <>
      <div className="tile page_header">
        <h1>{tenant}</h1>
      </div>
      <Modal
        size="md"
        id="delete_comic_confirmation"
        ariaLabel="Deletion confirmation"
        heading={t("comicProfile.deletion.confirmationHeading")}
        isOpen={deletionConfirmationModalOpen}
        onClose={cancelDeletion}
      >
        <ComicDeletionConfirmationForm
          comicTitle={comicPendingDeletion}
          confirmationString={deletionConfirmationString}
          onDeletion={deleteComic}
          onCancel={cancelDeletion}
          onChange={onDeletionConfirmationInput}
          errorText={deletionErrorText}
        />
      </Modal>

      <div className="tile">
        <ComicProfileProvider>
          <TabGroup
            id="comic-profile"
            tabs={actions}
            content={tabsContent}
            initialTabKey={initialTab || "overview"}
          />
        </ComicProfileProvider>
      </div>
    </>
  );
}

export default ComicManagementDashboard;

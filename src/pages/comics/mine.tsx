import CaveartLayout from "@features/CaveartLayout";
import { useEffect, useState } from "react";
import { Button, ButtonSet, Link, Modal, TabGroup } from "@components";
import AuthorComicEntry from "@features/comic/profiles/AuthorComicEntry";
import ComicProfile from "@features/comic/profiles/ComicProfile";
import NewComicPageForm from "@features/comic/pages/NewComicPageForm";
import ThumbnailGallery from "@features/comic/pages/ThumbnailGallery";
import ComicManagementDashboard from "@features/comic/ComicManagementDashboard";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Comic } from "../../data/types";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import ComicDeletionConfirmationForm from "@features/comic/profiles/ComicDeletionConfirmationForm";

function MyComics() {
  const { t } = useTranslation();

  const [comics, setComics] = useState<Comic[]>([]);
  const [deletionConfirmationModalOpen, setDeletionConfirmationModalOpen] =
    useState<boolean>(false);
  const [comicPendingDeletion, setComicPendingDeletion] = useState<string>("");
  const [deletionConfirmationString, setDeletionConfirmationString] =
    useState<string>("");
  const [deletionErrorText, setDeletionErrorText] = useState<string>("");

  const actions = [
    { key: "overview", name: t('comicsDashboard.actions.overview') },
    { key: "edit", name: t('comicsDashboard.actions.edit') },
    { key: "pages", name: t('comicsDashboard.actions.pages') },
    { key: "comments", name: t('comicsDashboard.actions.comments') },
  ];

  useEffect(() => {
    axios
      .get("/api/comics/mine")
      .then((response) => {
        console.log(response);
        setComics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
        .then((response) => {
          setDeletionConfirmationModalOpen(false);
          setComicPendingDeletion("");
          axios
            .get("/api/comics/mine")
            .then((comics) => {
              setComics(comics.data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          setDeletionErrorText(error);
          console.error(error);
        });
    } else {
      setDeletionErrorText(t("comicProfile.deletion.invalidDeletion"));
    }
  };

  const renderComicEntries = function () {
    if (comics.length === 0) {
      return (
        <div>
          <p>{t("comicProfile.noComics")}</p>
          <Link
            type="button"
            look="primary"
            id="link-create_comic"
            href="/comic/new"
          >
            {t("comicProfile.create")}
          </Link>
        </div>
      );
    }

    if (comics.length === 1) {
      const comic = comics[0];
      return <ComicManagementDashboard tenant={comic.subdomain} initialTab="overview" />
    }

    return (
      <>
        {comics.map((comic, idx) => {
          return (
            <ComicProfileProvider key={`comicProfile-${idx}`}>
              <AuthorComicEntry profile={comic}>
                <ButtonSet> 
                  {actions.map((action) => (
                    <Link 
                      type="button"
                      key={`action-${action.key}`}
                      href={`/comic/${comic.subdomain}/${action.key}`}
                    >{action.name}</Link>))}
                </ButtonSet>
              </AuthorComicEntry>
            </ComicProfileProvider>
          );
        })}
      </>
    );
  };

  return (
    <CaveartLayout requireLogin={true}>
      <div className="tile page_header">
        <h1>{t("headerNavigation.myWebcomics")}</h1>
        <Link
          type="button"
          look="primary"
          id="link-create_comic"
          href="/comic/new"
        >
          {t("comicProfile.create")}
        </Link>
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

      {renderComicEntries()}
    </CaveartLayout>
  );
}

export default MyComics;

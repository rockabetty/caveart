import { useEffect, useState } from "react";
import { Modal, Button} from "@components";

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
      .then((response) => {
        setDeletionConfirmationModalOpen(false);
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

return (
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
    <Button look="warning">{t('comicProfile.deletion.deleteButtonLabel')}</Button>
)

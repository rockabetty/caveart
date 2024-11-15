import CaveartLayout from "@features/CaveartLayout";
import EditComicProfile from "@features/comic/profiles/EditComicProfile";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

function EditComic() {
  const { t } = useTranslation();
  const { tenant } = useRouter().query;

  return (
    <CaveartLayout requireLogin={true}>
      <div className="tile">
        <h1>{t("comicManagement.edit")}</h1>
        <ComicProfileProvider>
          <EditComicProfile tenant={tenant} />
        </ComicProfileProvider>
      </div>
    </CaveartLayout>
  );
}

export default EditComic;

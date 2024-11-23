import CaveartLayout from "@features/CaveartLayout";
import ComicManagementDashboard from "@features/comic/ComicManagementDashboard";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

function EditComic() {
  const { t } = useTranslation();
  const { tenant } = useRouter().query;

  return (
    <CaveartLayout requireLogin={true}>
      <ComicProfileProvider>
        <ComicManagementDashboard tenant={tenant} initialTab="edit" />
      </ComicProfileProvider>
    </CaveartLayout>
  );
}

export default EditComic;

import CaveartLayout from "@features/CaveartLayout";
import ComicManagementDashboard from "@features/comic/ComicManagementDashboard";
import ComicProfileProvider from "@features/comic/profiles/hooks/ComicProfileProvider";
import { useRouter } from "next/router";

function EditComic() {
  const { tenant } = useRouter().query;

  return (
    <CaveartLayout requireLogin={true}>
      <ComicProfileProvider>
        <ComicManagementDashboard tenant={tenant} initialTab="overview" />
      </ComicProfileProvider>
    </CaveartLayout>
  );
}

export default EditComic;

import { Thumbnail, Link, Tag, Form, TextInput } from "@components";
import "./ComicProfiles.css";
import { ReactNode, useCallback, useState } from "react";
import { useComicProfile } from "./hooks/useComicProfile";
import { useTranslation } from "react-i18next";

type AuthorComicProfile = {
  id: number;
  title: string;
  subdomain: string;
  thumbnail_image_url: string;
  children?: ReactNode;
};

type AuthorComicEntryProps = {
  profile: AuthorComicProfile;
};

const AuthorComicEntry: React.FC<AuthorComicEntryProps> = ({
  profile,
  onDelete,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className="comic-profile tile">
      <div className="comic-profile_body">
        <a className="comic-profile_cover" href={`/read/${profile?.subdomain}`}>
          {profile?.thumbnail_image_url ? (
            <Thumbnail imageUrl={profile?.thumbnail_image_url} />
          ) : (
            <Thumbnail imageUrl="/img/brand/kraugak.png" />
          )}
        </a>
  
        <h1 className="comic-profile_title">{profile?.title}</h1>
        {children ? (
          <div className="comic-profile_body">{children}</div>
        ) : null}
        </div>
   
    </div>
  );
};

export default AuthorComicEntry;

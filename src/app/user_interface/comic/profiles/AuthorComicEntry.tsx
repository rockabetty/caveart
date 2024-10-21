import { ImageUpload, Link, Tag, Button, Modal, Form, TextInput } from '@components'
import './ComicProfiles.css';
import { useCallback, useState } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

type AuthorComicEntryProps = {
  tenant: string;
  onDelete: (string) => void;
}

const AuthorComicEntry: React.FC<AuthorComicEntryProps> = ({
  tenant,
  onDelete
}) => {
  const { t } = useTranslation();
  const {state, removeComic} = useComicProfile(tenant);
  const {profile, permissions} = state;
 
  const beginDeletion = function() {
    onDelete(tenant)
  }

  const renderDeletionConfirmationModal = () => {
    return (
      <Form
        submitLabel={t('comicProfile.deletion.confirmDeletion')}
        cancelLabel={t('comicProfile.deletion.cancelDeletion')}
        onCancel={cancelDeletion}
        onSubmit={deleteComic}
        isDestructive={true}
        submissionError={formErrorText}
      >
        <p>{t('comicProfile.deletion.instructions')}</p>
        <TextInput 
          labelText={t('comicProfile.deletion.comicName')}
          helperText={t('comicProfile.deletion.helperText', {title: profile.title})}
          pattern={profile.title}
          required
          value={deletionConfirmationString}
          onChange={onDeletionConfirmationInput}
        />
      </Form>
    )
  }
 
  return (
    <div className="comic-profile">
      <div className="comic-profile_body">
        <a className="comic-profile_cover" href={`/read/${profile?.subdomain}`}>
          {profile?.thumbnail
            ? <ImageUpload src={profile?.thumbnail} />
            : <ImageUpload src='/img/brand/kraugak.png' />
          }
        </a>
        <div>
         <div className="comic-profile_header">
            <h1 className="comic-profile_title">{profile?.title}</h1>
            <Link href={`/comic/${profile?.subdomain}`} id={`read-${profile?.subdomain}`}>caveartwebcomics.com/comic/{profile?.subdomain}</Link>
                    
              {permissions?.edit
                ? (<>
                    <Link type="button" look="default" href={`/comic/${profile?.subdomain}/edit`} id={`edit-${profile?.subdomain}`}>{t('comicProfile.edit')}</Link>
                    <Link type="button" look="primary" href={`/comic/${profile?.subdomain}/pages/new`} id={`newpage-${profile?.subdomain}`}>{t('comicPages.add')}</Link>
                    <Button look="warning" id={`delete_comic-${profile.id}`} inline onClick={beginDeletion}>Delete</Button>
                  </>
                  )
                : null
              }
          </div>
        </div>
      </div>         
    </div>
  );
  
}

export default AuthorComicEntry;
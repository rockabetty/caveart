import { ImageUpload, Link, Tag, Button, Modal, Form, TextInput } from '@components'
import './ComicProfiles.css';
import { useCallback, useState } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

type ComicProfileProps = {
  tenant: string
}

const ComicProfile: React.FC<ComicProfileProps> = (props) => {
  const { t } = useTranslation();
  const {tenant} = props;
  const {state, removeComic} = useComicProfile(tenant);
  const {profile, permissions} = state;
  const [deleted, setDeleted] = useState<boolean>(false);
  const [deletionConfirmationModalOpen, setDeletionConfirmationModalOpen] = useState<boolean>(false);
  const [deletionConfirmationString, setDeletionConfirmationString] = useState<string>("");
  const [formErrorText, setFormErrorText] = useState<string>("");

  const onDeletionConfirmationInput = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setDeletionConfirmationString(e.target.value)
  }

  const renderGenres = useCallback(() => {
    const selectedGenres = profile?.genres 
    ? Object.values(profile.genres)
    : [];

    return (
      <>
      {selectedGenres.length === 0
        ? null
        : (<>
          {selectedGenres.map((value, idx) => {
            return (
              <Tag
                key={`browsing-genre-${tenant}-${idx}`}
                label={value.name}
              />
            )
          })}
          </>)
      }
      </>
    );
  }, [profile]);

  const beginDeletion = function () {
    setDeletionConfirmationModalOpen(true);
  }

  const cancelDeletion = function () {
    setDeletionConfirmationModalOpen(false);
  }

  const isValidDeletionAttempt = function () {
    return deletionConfirmationString === profile.title;
  }

  const deleteComic = async function() {
    if (isValidDeletionAttempt()) {
      try {
        await removeComic(profile.id);
        setDeleted(true)
      } catch (error) {
        console.error(error)
      }
    } else {
      setFormErrorText(t('comicProfile.deletion.invalidDeletion'))
    }
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

  const renderContentWarnings = useCallback(() => {
    const contentWarnings = profile?.content_warnings 
    ? Object.keys(profile.content_warnings)
    : [];
   
    return (
      <>
      {contentWarnings.length === 0
        ? null
        : (<>
          {contentWarnings.map((key, idx) => {
            return (
              <Tag
                key={`browsing-content_warning-${tenant}-${idx}`}
                label={t(`contentWarnings.${key}.${profile.content_warnings[key].name}`)}
              />
            )
          })}
          </>)
      }
      </>
    );
  }, [profile]);


  return (
      <div className="comic-profile">
      { deleted ? 
        (
          <>
           <p>This comic has been deleted.</p>
          </>
        )
        :
        (
          <>
            <Modal
              size="md"
              id="delete_comic_confirmation"
              ariaLabel="Deletion confirmation"
              heading={t('comicProfile.deletion.confirmationHeading')}
              isOpen={deletionConfirmationModalOpen}
              onClose={cancelDeletion}
            >
              {deletionConfirmationModalOpen && renderDeletionConfirmationModal()}
            </Modal>
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
                    {permissions?.edit
                      ? (<>
                          <Link type="inline button" look="default" href={`/comic/${profile?.subdomain}/edit`} id={`edit-${profile?.subdomain}`}>{t('comicProfile.edit')}</Link>
                          <Link type="inline button" look="primary" href={`/comic/${profile?.subdomain}/pages/new`} id={`newpage-${profile?.subdomain}`}>{t('comicPages.add')}</Link>
                          <Button look="warning" id={`delete_comic-${profile.id}`} inline onClick={beginDeletion}>Delete</Button>
                        </>
                        )
                      : null
                    }
                </div>
                <pre className="comic-profile_description">{profile?.description}</pre>
                <Tag label={profile?.rating} />
                {profile?.genres
                  ? renderGenres()
                  : null
                }
                {renderContentWarnings()}
              </div>
            </div>
          </>
          )
      }          
      </div>
  )
}

export default ComicProfile;
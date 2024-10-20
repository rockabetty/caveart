import { ImageUpload, Link, Tag, Button, Modal, Form, TextInput } from '@components'
import './ComicProfiles.css';
import { useCallback, useState } from 'react';
import { useComicProfile } from './hooks/useComicProfile'; 
import { useTranslation } from 'react-i18next';

type AuthorComicEntryProps = {
  tenant: string
}

const AuthorComicEntry: React.FC<AuthorComicEntryProps> = (props) => {
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


  if (!deleted) {  
    return (
        <div className="comic-profile">
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
                        <Link type="button" look="default" href={`/comic/${profile?.subdomain}`} id={`read-${profile?.subdomain}`}>{t('comicProfile.read')}</Link>
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
    )
  }
}

export default AuthorComicEntry;
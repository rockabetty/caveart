import { Button, Form, TextInput } from '@components'
import { useTranslation } from 'react-i18next';

type ComicDeletionConfirmationFormProps = {
  comicTitle: string;
  confirmationString: string;
  onDeletion: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent) => void;
  errorText: string;
}

const ComicDeletionConfirmationForm: React.FC<ComicDeletionConfirmationFormProps> = ({
  comicTitle,
  confirmationString,
  onDeletion,
  onCancel,
  onChange,
  errorText
}) => {
  const { t } = useTranslation();
 
  return (
    <Form
      submitLabel={t('comicProfile.deletion.confirmDeletion')}
      cancelLabel={t('comicProfile.deletion.cancelDeletion')}
      onCancel={onCancel}
      onSubmit={onDeletion}
      isDestructive={true}
      submissionError={errorText}
    >
      <p>{t('comicProfile.deletion.instructions')}</p>
      <TextInput 
        labelText={t('comicProfile.deletion.comicName')}
        helperText={t('comicProfile.deletion.helperText')}
        pattern={comicTitle}
        required
        value={confirmationString}
        onChange={onChange}
      />
    </Form>
  )
}

export default ComicDeletionConfirmationForm;
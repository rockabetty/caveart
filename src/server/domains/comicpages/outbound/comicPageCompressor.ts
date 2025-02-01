import { ComicPageCompressionRequest } from '../comicpage.types';
import { requireEnvVar } from '@logger/envcheck';

const FLASK_URL = requireEnvVar('FLASK_URL')

export async function queueImageCompression(data: ComicPageCompressionRequest) {
  console.log("#################@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&&&")
  console.log(data)
  const response = await fetch(`${FLASK_URL}/tasks/process-comic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.error);
  }

  return { taskId: responseData.task_id };
}
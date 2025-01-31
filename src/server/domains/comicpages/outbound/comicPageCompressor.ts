import { ComicPageCompressionRequest } from '../comicpage.types';

export async function queueImageCompression(data: ComicPageCompressionRequest) {
  const response = await fetch(`${FLASK_URL}/tasks/process-comic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to create task');
  }

  return { taskId: responseData.task_id };
}
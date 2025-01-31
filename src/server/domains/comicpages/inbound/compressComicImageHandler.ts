import { NextApiHandler } from 'next';
import { acceptPostOnly } from "@domains/methodGatekeeper";
import { requireEnvVar } from '@logger/envcheck';

const FLASK_URL = requireEnvVar("FLASK_URL");

export const compressComicImageHandler: NextApiHandler = async (req, res) => {
    acceptPostOnly(req, res);
    try {
        const response = await fetch(`${FLASK_URL}/tasks/process-comic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create task');
        }

        res.status(200).json({ taskId: data.task_id });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
}

export default compressComicImageHandler;
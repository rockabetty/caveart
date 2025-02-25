import { NextApiHandler } from 'next';
import { acceptPostOnly } from "@domains/methodGatekeeper";
import { requireEnvVar } from '@logger/envcheck';
import { sendErrorResponse } from '../../errors';
import { ErrorKeys } from "../errors.types";

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
        return sendErrorResponse(ErrorKeys.ERROR_CREATING_COMPRESSION_TASK);
    }
}

export default compressComicImageHandler;
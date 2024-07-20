import { NextApiRequest, NextApiResponse } from "next";
import { requireEnvVar } from "@logger/requireEnvVar";

const USER_AUTH_TOKEN_NAME = requireEnvVar('NEXT_PUBLIC_USER_AUTH_TOKEN_NAME');

export const acceptGetOnly = function (
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export const acceptPostOnly = function (
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export const requireButDoNotValidateToken = function (
    req: NextApiRequest,
    res: NextApiRequest,
) {
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
        return res.status(400).json(UserErrorKeys.TOKEN_MISSING);
    }
};

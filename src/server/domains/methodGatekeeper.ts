import { NextApiRequest, NextApiResponse } from "next";
import { requireEnvVar } from "@logger/envcheck";
import { rateLimiter } from "@server-services/rateLimiter";

const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");

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

export const getUnvalidatedToken = function (req: NextApiRequest) {
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
        throw new Error();
    }
    return token;
};

export const rateLimit = function (req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!rateLimiter(ip as string)) {
        res.status(429).json({
            error: "Too many requests. Please try again later.",
        });
    }
};

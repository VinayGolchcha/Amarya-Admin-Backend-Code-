import crypto from 'crypto-js';
import jwt from 'jsonwebtoken';
import { getTokenSessionById } from "../v1/helpers/functions.js"; // Adjust import paths

export const authenticateUserSession = async (req, res, next) => {
    const token = req.cookies.jwt || req.body.token || req.params.token || req.headers['x-access-token'] || req.headers['authorization'];
    const emp_id = req.body.emp_id || req.params.emp_id
    const encrypted_user_id = req.headers['x-encryption-key'];

    if (!token) {
        return res.status(449).json({
            status: 'failure',
            message: 'Please send token in payload, x-access-token header, authorization header, or cookie.'
        });
    }

    if (!encrypted_user_id) {
        return res.status(449).json({
            status: 'failure',
            message: 'Encryption key is missing.'
        });
    }

    try {
        // const ipAddress = req.ip || req.connection.remoteAddress;
        let decoded, accessDetails, validAccess = false, jwtErrorMessage = '';

        // Decrypt the user_id from the headers
        let decrypted_user_id;
        try {
            const bytes = crypto.AES.decrypt(encrypted_user_id, process.env.ENCRYPTION_SECRET);
            decrypted_user_id = bytes.toString(crypto.enc.Utf8);
        } catch (decryptionError) {
            return res.status(440).json({
                status: 'failure',
                message: 'User ID decryption failed.'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, verifiedDetails) => {
            if (err) {
                jwtErrorMessage = err.message;
            } else {
                decoded = verifiedDetails;
                if (String(decoded.user_id) === String(decrypted_user_id) && 
                String(decoded.user_id) === String(emp_id)) {
                validAccess = true;
            } else {
                jwtErrorMessage = 'User ID mismatch. Possible token misuse';
            }
            }
        });

        if (!validAccess) {
            return res.status(440).json({
                status: 'failure',
                message: `${jwtErrorMessage}, please login again.`
            });
        }

        // Fetch the user's session based on the token's user ID
        if (decoded.hasOwnProperty('user_id') && decoded.role === "user") {
            [accessDetails] = await getTokenSessionById(decoded.user_id);

            if (accessDetails && String(token) === String(accessDetails[0].jwt_token)) {
                req.decoded = decoded;
                next();
            } else {
                return res.status(440).json({
                    status: 'failure',
                    message: 'Invalid session.'
                });
            }
        } else {
            return res.status(440).json({
                status: 'failure',
                message: 'Invalid token'
            });
        }

    } catch (error) {
        return res.status(440).json({
            status: 'failure',
            message: 'Token auth error'
        });
    }
}

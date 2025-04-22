const { default: axios } = require('axios');
const { StatusCodes } = require('http-status-codes');
const db = require('~/models');
const { handleRefreshToken } = require('~/services/authService');
const jwtService = require('~/services/jwtService');
const ApiError = require('~/utils/ApiError');

const authMiddleware = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers.authorization);

        if (cookies?.accessToken || tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;

            // call sso to verify token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const resData = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify');

            if (resData && resData.data.statusCode === 200) {
                const { id, active, require2FA, ...userData } = resData.data.data;
                const [user] = await db.User.findOrCreate({
                    where: { uid: id + '' },
                    defaults: {
                        ...userData,
                    },
                    raw: true,
                });
                req.user = user;

                next();
            } else {
                return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
            }
        } else if (!cookies?.accessToken && cookies?.refreshToken) {
            next(new ApiError(StatusCodes.METHOD_NOT_ALLOWED), 'TokenExpiredError & Need to retry new token');
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }
    } catch (error) {
        next(error);
    }
};

const checkPermission = async (req, res, next) => {
    console.log(req.user);
};

module.exports = { authMiddleware };
//
// import axios from 'axios';
// import { StatusCodes } from 'http-status-codes';
// import db from '~/models';
// import { JwtProvider } from '~/providers/JwtProvider';
// import { workspaceService } from '~/services';
// import ApiError from '~/utils/ApiError';
//
// const isAuthorized = async (req, res, next) => {
//     const { accessToken } = req.cookies;
//     const tokenFromHeader = JwtProvider.extractToken(req.headers.authorization);
//
//     if (!accessToken && !tokenFromHeader) {
//         return next(new ApiError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED token not found!'));
//     }
//
//     try {
//         const token = accessToken || tokenFromHeader;
//
//         // call sso to verify token
//         const cookieHeader = Object.entries(req.cookies)
//             .map(([key, value]) => `${key}=${value}`)
//             .join(';');
//
//         const { data: resData } = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify', null, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 Cookie: cookieHeader,
//             },
//         });
//
//         // eslint-disable-next-line no-unused-vars
//         const { id, banner, bio, role, active, require2FA, ...userData } = resData.data;
//         const [user, created] = await db.User.findOrCreate({
//             where: { uid: id },
//             defaults: {
//                 ...userData,
//             },
//         });
//
//         if (created) {
//             await workspaceService.store({ userId: user.id, title: 'TaskFlow', type: 'private' });
//         }
//         req.user = { ...user.dataValues, role };
//
//         next();
//     } catch (error) {
//         next(new ApiError(error.status, error.message));
//     }
// };
//
// const checkRole = (...roles) => {
//     return (req, res, next) => {
//         if (!req.user || !roles.includes(req?.user?.role)) {
//             return next(new ApiError(StatusCodes.FORBIDDEN, 'You have no access!'));
//         }
//
//         next();
//     };
// };
//
// export default { isAuthorized, checkRole };

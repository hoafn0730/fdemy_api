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
                // active, require2FA,
                const { id, ...userData } = resData.data.data;
                const [user] = await db.User.findOrCreate({
                    where: { uid: id + '' },
                    defaults: {
                        ...userData,
                    },
                    raw: true,
                });
                console.log(user);

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

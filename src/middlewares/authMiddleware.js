const { default: axios } = require('axios');
const { handleRefreshToken } = require('~/services/authService');
const jwtService = require('~/services/jwtService');

const nonSecurePaths = ['/logout', '/login', '/register', '/verify-services'];

const authenticateUser = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const cookies = req.cookies;
    const tokenFromHeader = jwtService.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        const decoded = jwtService.verifyToken(token);
        // call sso to verify token
        // const resAPI = await axios.post(process.env.API_SSO_VERIFY_ACCESS_TOKEN);

        if (decoded && decoded !== 'TokenExpiredError') {
            req.user = decoded;
            next();
        } else if (decoded && decoded === 'TokenExpiredError' && cookies?.refreshToken) {
            console.log('TokenExpiredError');
            const data = await handleRefreshToken(cookies?.refreshToken);

            const newAccessToken = data.newAccessToken;
            const newRefreshToken = data.newRefreshToken;

            if (newAccessToken && newRefreshToken) {
                // set cookie
                res.cookie('accessToken', newAccessToken, {
                    maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
                    httpOnly: true,
                });
                res.cookie('refreshToken', newRefreshToken, {
                    maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
                    httpOnly: true,
                });
            }

            return res.status(405).json({
                code: -1,
                message: 'TokenExpiredError & Need to retry new token',
                data: '',
            });
        } else {
            console.log('Unauthorized');
            return res.status(401).json({
                code: -1,
                message: 'Unauthorized',
                data: '',
            });
        }
    } else {
        console.log('Unauthorized');
        return res.status(401).json({
            code: -1,
            message: 'Unauthorized',
            data: '',
        });
    }
};

const authenticate = async (req, res, next) => {
    try {
        if (nonSecurePaths.includes(req.path)) return next();

        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers.authorization);

        if (cookies?.accessToken || tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;
            // call sso to verify token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const resData = await axios.post('https://sso-api.fdemy.id.vn/api/v1/auth/verify-services');

            if (resData && resData.data.statusCode === 200) {
                req.user = resData.data.data;

                next();
            } else {
                console.log('Unauthorized');
                return res.status(401).json({
                    code: -1,
                    message: 'Unauthorized',
                    data: '',
                });
            }
        } else if (!cookies?.accessToken && cookies?.refreshToken) {
            return res.status(405).json({
                statusCode: 405,
                message: 'TokenExpiredError & Need to retry new token',
                data: '',
            });
        } else {
            console.log('Unauthorized');
            return res.status(401).json({
                code: -1,
                message: 'Unauthorized',
                data: '',
            });
        }
    } catch (error) {
        next(error);
    }
};

const checkPermission = async (req, res, next) => {
    console.log(req.user);
};

const checkUserLogin = async (req, res, next) => {
    const cookies = req.cookies;
    const tokenFromHeader = jwtService.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const resData = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify-services');

        if (resData && resData.data.statusCode === 200) {
            req.user = resData.data.data;
        }
    }

    next();
};

module.exports = { authenticateUser, authenticate, checkUserLogin };

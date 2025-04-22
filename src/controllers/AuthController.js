const registerService = require('~/services/registerService');
const userService = require('~/services/userService');

class AuthController {
    login = (req, res, next) => {
        const isPopup = req.query.popup === '1';

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(StatusCodes.OK).json({ message: info.message });
            }

            req.login(user, async (err) => {
                if (err) {
                    return next(err);
                }

                const payload = {
                    id: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                };

                const accessToken = JwtProvider.createToken(payload);
                const refreshToken = uuidv4();
                await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

                // Đặt Access Token vào cookie
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    domain: process.env.COOKIE_DOMAIN,
                    maxAge: ms('14 days'),
                });

                // Đặt Refresh Token vào cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    domain: process.env.COOKIE_DOMAIN,
                    maxAge: ms('14 days'),
                });

                if (isPopup) {
                    return res.redirect(process.env.BACKEND_SSO + '/reload');
                } else {
                    return res.status(StatusCodes.OK).json({
                        statusCode: StatusCodes.OK,
                        message: 'login success',
                        data: { ...user, accessToken, refreshToken },
                    });
                }
            });
        })(req, res, next);
    };
    getCurrentUser = async (req, res, next) => {
        const courseIds = (
            await registerService.find({
                where: {
                    userId: req.user.id,
                },
            })
        ).data.map((c) => c.courseId);

        return res.status(200).json({
            statusCode: 200,
            message: 'ok',
            data: {
                ...req.user,
                courseIds,
            },
        });
    };
    updateProfile = async (req, res, next) => {
        if (req?.file) {
            req.body.avatar = 'http://localhost:5000/images/' + req.file.filename;
        }
        const data = await userService
            .update({
                data: req.body,
                where: { id: req.user.id },
            })
            .catch(next);

        res.io.emit('notification', { message: `Profile updated successfully.` });

        if (data.code !== 0) {
            return res.json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new AuthController();

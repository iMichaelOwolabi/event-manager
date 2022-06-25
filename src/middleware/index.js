import { jwtValidator } from "../utils/jwtHelper";

export const authGuard = (req, res, next) => {
  const token = request.headers.authorization
      ? request.headers.authorization.split(' ')[1]
      : request.params.token;

  const validatedToken = await jwtValidator(token);

  if (!validatedToken) {
    return res.status(401).send({
      error: true,
      message: 'Unauthorized user.'
    })
  }

  req.validatedToken = validatedToken;

  next();
}

import { sign, SignOptions, verify } from 'jsonwebtoken';
import { Response } from 'express';

export const Keys =
  '288bbde28ed37586a9c71a6287bf429728932e5687e628b20024c2d537f6a3073f4b0a56fa8b15a7d857804d1e80131d73e2d5d3b8455120e4fca902bb6c95db264d7ecd5d08583d7d628628d2c7423c714bfd374d64402e3e7d2759558517b728c5bbb811dad480fbe270779920633b8e1d4168ec8ffa9cde29d31d41fc2983';
export const Keys1 =
  '288bbde28ed37586aasodpadjpias2390232FWEFAS9c71a6287bf429728932e5687e628b20024c2d537f6a3073f4b0a56fa8b15a7d857804d1e80131d73e2d5d3b8455120e4fca902bb6c95db264d7ecd5d08583d7d628628d2c7423c714bfd374d64402e3e7d2759558517b728c5bbb811dad480fbe270779920633b8e1d4168ec8ffa9cde29d31d41fc2983';

export function AuthenticationFunction(token1: string) {
  return VerifyJwtToken(token1, Keys);
}

export function AuthenticateSecureFile(req, res: Response<any>, next) {
  const authHeader = req.headers['authorization'];
  const token1 = authHeader && authHeader.split(' ')[1];
  if (token1 == null) return res.sendStatus(401);
  VerifyJwtToken(token1, Keys1)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((e) => {
      res.status(403).send(e);
    });
}
export function SetImutableCacheHeader(req, res: Response<any>, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, immutable',
  });
  next();
}
export function AuthenticateTokenMiddle(req, res: Response<any>, next) {
  const authHeader = req.headers['authorization'];
  const token1 = authHeader && authHeader.split(' ')[1];
  if (token1 == null) return res.sendStatus(401);
  AuthenticationFunction(token1)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((e) => {
      res.status(403).send(e);
    });
}
export function AuthMiddleWithoutReject(req, res: Response<any>, next) {
  const authHeader = req.headers['authorization'];
  const token1 = authHeader && authHeader.split(' ')[1];
  if (token1 == null) {
    res.locals.islogin = false;
    next();
  } else {
    AuthenticationFunction(token1)
      .then((user) => {
        res.locals.islogin = true;
        res.locals.user = user;
      })
      .catch((e) => {
        res.locals.islogin = false;
      })
      .finally(() => {
        next();
      });
  }
}
export function SignDataJWT(
  user: any,
  key: string,
  options?: SignOptions
): string {
  return sign(user, key, options);
}
export function VerifyJwtToken(token: string, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    verify(token, key, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  });
}

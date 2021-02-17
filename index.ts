import * as express from 'express';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import { join } from 'path';
import { randomBytes } from 'crypto';
import {
  SetImutableCacheHeader,
  AuthenticateTokenMiddle,
  SignDataJWT,
  Keys,
} from './src/GeneralFunctions';
const app = express();
app.use(express.json());
// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(
  '/static',
  SetImutableCacheHeader,
  express.static(join(__dirname, 'static'))
);
app.post(
  '/upload',
  AuthenticateTokenMiddle,
  cors(),
  fileUpload({
    createParentPath: true,
    preserveExtension: true,
    safeFileNames: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
  async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    let ress = {};
    for (const l of Object.keys(req.files)) {
      if (Array.isArray(req.files[l]) === false) {
        req.files[l] = [req.files[l] as any];
      }
      ress[l] = [];
      for (let sam of req.files[l] as any) {
        const Filename =
          randomBytes(5).toString('hex') +
          Date.now() +
          '.' +
          sam.mimetype.split('/')[1];
        await sam.mv(__dirname + '/static/' + Filename);
        ress[l].push('https://' + req.hostname + '/static/' + Filename);
      }
    }
    return res.status(200).send(ress);
  }
);
app.get('/token', (req, res) => {
  res.send(
    SignDataJWT({}, Keys, {
      expiresIn: '1d',
    })
  );
});
app.use('**/*', (req, res) => {
  res.send('2.0');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

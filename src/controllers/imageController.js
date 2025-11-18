import { BadRequestError } from '../lib/error.js';

export function uploadSingleImage(req, res, next) {
  const file = req.file;

  if (!file) {
    return next(new BadRequestError());
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`;

  res.status(200).json({
    imageUrl: imageUrl,
  });
}

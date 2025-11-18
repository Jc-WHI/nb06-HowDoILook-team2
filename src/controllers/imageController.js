export function uploadSingleImage(req, res, next) {
  // 파일이 없는 경우 (req.file이 undefined일 때)

  const file = req.file;
  const imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`;

  res.status(200).json({
    imageUrl: imageUrl,
  });
}

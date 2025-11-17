export class NotFoundError extends Error {
  constructor(message = '존재하지 않습니다') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  constructor(message = '잘못된 요청입니다') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

export class ForbiddenError extends Error {
  constructor(message = '비밀번호가 틀렸습니다') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

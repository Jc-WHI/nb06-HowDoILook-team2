class NotFoundError extends Error {
  constructor(modelName, id) {
    super(`${modelName}의 id${id}를 찾을 수 없습니다. `);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;

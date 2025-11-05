//utils/pagination.js
const getPaginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getPaginationMeta = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    currentPage: page,
    perPage: limit,
    totalItems: totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta,
};

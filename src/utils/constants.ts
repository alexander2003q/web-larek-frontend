const apiOrigin = (process.env.API_ORIGIN ?? '').trim();

export const API_URL = `${apiOrigin}/api/weblarek`;
export const CDN_URL = `${apiOrigin}/content/weblarek`;

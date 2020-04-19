export const env = {
  baseUrl: process.env.REACT_APP_BASE_PATH as string,
  fetchStatsDelay: parseInt(process.env.REACT_APP_FETCH_STATS_DELAY as string),
  fetchTagDelay: parseInt(process.env.REACT_APP_FETCH_TAG_DELAY as string),
  qrCodeSize: 160,
  alertFila: 10,
  alertTempo: 30
};

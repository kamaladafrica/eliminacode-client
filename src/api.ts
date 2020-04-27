import http from "./http";

export const newTag = async () => {
  const response = await http.post<Tag>("/tags");
  return toTag(response.data);
};

export const fetchTag = async (key: string) => {
  const response = await http.get<Tag>(`/tags/${key}`);
  return toTag(response.data);
};

export const checkTag = (key: string) => http.get<never>(`/tags/${key}/check`);

export const stats = async () => {
  const response = await http.get<Stats>("/stats");
  return toStats(response.data);
};

export const annullaTag = (key: string) => http.delete<never>(`/tags/${key}`);

const toTag = (json: any): Tag => ({
  key: json.key,
  progressivo: json.progressivo,
  staccato: new Date(json.staccato),
  qrCodeImageUrl: json.qrCodeImageUrl,
});

const toStats = (json: any): Stats => ({
  fila: json.fila,
  tempoStimato: json.tempoStimato,
  tempoLimite: new Date(json.tempoLimite),
});

export interface Tag {
  key: string;
  progressivo: number;
  staccato: Date;
  qrCodeImageUrl: string;
}

export interface Stats {
  fila: Array<number>;
  tempoStimato: number;
  tempoLimite: Date;
}

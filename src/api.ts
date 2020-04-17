import { env } from "./env";

export const newTag = async () => {
  const response = await fetch(`${env.baseUrl}/tags`, { method: "POST" });
  const json = await response.json();
  return toTag(json);
};

export const lastTag = async () => {
  const response = await fetch(`${env.baseUrl}/tags/current`);
  if (response.ok) {
    const json = await response.json();
    return toTag(json);
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export const fetchTag = async (key: string) => {
  const response = await fetch(`${env.baseUrl}/tags/${key}`);
  if (response.ok) {
    const json = await response.json();
    return toTag(json);
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export const stats = async (key: string = "") => {
  const response = await fetch(`${env.baseUrl}/stats/${key}`);
  if (response.ok) {
    return (await response.json()) as Stats;
  } else if(response.status === 403){
    return null;
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export const currentTag = async () => {
  const response = await fetch(`${env.baseUrl}/tags/last`);
  if (response.ok) {
    const json = await response.json();
    return toTag(json);
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export const annullaTag = async (key: string) =>
  fetch(`${env.baseUrl}/tags/${key}`, {
    method: "DELETE",
  });

const toTag = (json: any): Tag => ({
  key: json.key,
  progressivo: json.progressivo,
  staccato: new Date(json.staccato),
});

export interface Tag {
  key: string;
  progressivo: number;
  staccato: Date;
}

export interface Stats {
  fila: number;
  tempoStimato: number;
}

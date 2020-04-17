import { Stats } from "./api";

export const ALERT_TIME = 30; // minuti
export const ALERT_FILA = 5; // persone

export const minutiToText = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  let res = "";
  if (h) {
    res += `${h} ${h === 1 ? "ora" : "ore"} e `;
  }
  res += `${m} minuti`;
  return res;
};

export const isAlert = (stats: Stats): boolean =>
  stimaTotale(stats) < ALERT_TIME || stats.fila <= ALERT_FILA;

export const stimaTotale = ({ fila, tempoStimato }: Stats): number =>
  tempoStimato * (fila || 1);

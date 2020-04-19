import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import { Stats, Tag } from "./api";
import { env } from "./env";
import { getPosizione } from "./utils";

const TAG_KEY = "tag";
const STATS_DELAY = env.fetchStatsDelay;
const CHECK_DELAY = env.fetchTagDelay;

type TagHookReturn = [State, TagState, () => void, () => void];

export type TagState = {
  key: string;
  progressivo: number;
  posizione: number;
  tempoStimato: number;
  tempoRimasto: number;
  qrCodeImageUrl: string;
  loaded: boolean;
  expiring: boolean;
};

export type State = {
  fila: number[];
  posizione: number;
  tempoMedio: number;
  tempoStimato: number;
  tempoLimite: Date;
  loaded: boolean;
};

const EMPTY_STATE: State = {
  fila: [],
  loaded: false,
  posizione: 0,
  tempoLimite: new Date(),
  tempoMedio: 0,
  tempoStimato: 0,
};

const EMPTY_TAG_STATE: TagState = {
  loaded: false,
  posizione: 0,
  tempoStimato: 0,
  progressivo: 0,
  qrCodeImageUrl: "",
  tempoRimasto: 0,
  key: "",
  expiring: false,
};

const toState = ({ fila, tempoStimato, tempoLimite }: Stats): State => ({
  posizione: fila.length,
  tempoMedio: tempoStimato,
  tempoStimato: fila.length * tempoStimato,
  tempoLimite,
  fila: fila,
  loaded: true,
});

const toTagState = (
  { fila, tempoMedio, tempoLimite }: State,
  { progressivo, key }: Tag,
  qrCodeImageUrl: string
): TagState => {
  const posizione = getPosizione(progressivo, fila);
  const expiring = posizione < 0;
  const tempoRimasto = (tempoLimite.getTime() - new Date().getTime()) / 60000; // minuti
  return {
    loaded: true,
    key,
    progressivo,
    qrCodeImageUrl,
    posizione,
    tempoStimato: posizione * tempoMedio,
    tempoRimasto,
    expiring,
  };
};

const updateTagState = (
  tagState: TagState,
  { fila, tempoMedio, tempoLimite }: State
): TagState => {
  const posizione = getPosizione(tagState.progressivo, fila);
  const expiring = posizione < 0;
  const tempoRimasto = (tempoLimite.getTime() - new Date().getTime()) / 60000; // minuti
  return {
    ...tagState,
    expiring,
    posizione,
    tempoStimato: posizione * tempoMedio,
    tempoRimasto: tempoRimasto,
  };
};

export const useTag = (): TagHookReturn => {
  const [state, setState] = useState(EMPTY_STATE);
  const [tagState, setTagState] = useState(EMPTY_TAG_STATE);

  const clearTagState = () => {
    setTagState(EMPTY_TAG_STATE);
    localStorage.removeItem(TAG_KEY);
  };

  const saveTagState = (state: State, tag: Tag, qrCodeImageUrl: string) => {
    setTagState(toTagState(state, tag, qrCodeImageUrl));
    localStorage.setItem(TAG_KEY, tag.key);
  };

  const fetchStats = async () => {
    const stats = await api.stats();
    const state = toState(stats);
    setState(state);
    setTagState((tagState) =>
      tagState.loaded ? updateTagState(tagState, state) : tagState
    );
    return state;
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, STATS_DELAY);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tagState.loaded) {
      const checkTag = () => {
        api
          .checkTag(tagState.key)
          .catch(() => clearTagState())
          .then(() => fetchStats());
      };
      const interval = setInterval(checkTag, CHECK_DELAY);
      return () => clearInterval(interval);
    }
  }, [tagState.key, tagState.loaded]);

  useEffect(() => {
    const fetchTag = async () => {
      const key = localStorage.getItem(TAG_KEY);
      if (key) {
        try {
          const tag = await api.fetchTag(key);
          const url = tag && (await api.qrCodeImageUrl(tag.key));
          url && saveTagState(state, tag, url);
        } catch (error) {
          clearTagState();
        }
      }
    };

    if (state.loaded && !tagState.loaded) {
      fetchTag();
    }
  }, [state, tagState.loaded]);

  const newTag = useCallback(async () => {
    try {
      const tag = await api.newTag();
      const url = tag && (await api.qrCodeImageUrl(tag.key));
      url && saveTagState(state, tag, url);
      fetchStats();
    } catch (error) {
      clearTagState();
    }
  }, [state]);

  const annullaTag = useCallback(async () => {
    if (tagState.loaded) {
      try {
        await api.annullaTag(tagState.key);
        clearTagState();
      } catch (error) {}
    }
  }, [tagState.key, tagState.loaded]);

  return [state, tagState, newTag, annullaTag];
};

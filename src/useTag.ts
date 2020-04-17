import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import { Stats, Tag } from "./api";

const TAG_KEY = "tag";
const DELAY = 5000;

type TagHookReturn = [
  Tag | null,
  Stats | null,
  Stats | null,
  () => Promise<Tag>,
  () => void
];

const shallowEq = (a: any, b: any): boolean =>
  a === b ||
  (a != null && b != null && Object.keys(a).every((k) => a[k] === b[k]));

export const useTag = (): TagHookReturn => {
  const [tag, setTag] = useState<Tag | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tagStats, setTagStats] = useState<Stats | null>(null);

  const clearTag = () => {
    setTag(null);
    localStorage.removeItem(TAG_KEY);
  };

  const saveTag = (tag: Tag) => {
    setTag(tag);
    localStorage.setItem(TAG_KEY, tag.key);
  };

  useEffect(() => {
    const fetchStats = () => {
      api.stats().then((s) => {
        if (!shallowEq(stats, s)) {
          setStats(s);
        }
      });
      console.log(tag);
      if (tag) {
        api.stats(tag.key).then((s) => {
          if (s == null) {
            clearTag();
          } else if (!shallowEq(stats, s)) {
            setTagStats(s);
          }
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, DELAY);

    return () => clearInterval(interval);
  }, [stats, tag]);

  useEffect(() => {
    const fetchTag = async () => {
      const key = localStorage.getItem(TAG_KEY);
      if (key && !tag) {
        try {
          const tag = await api.fetchTag(key);
          saveTag(tag);
        } catch (e) {
          clearTag();
        }
      }
    };
    fetchTag();
  }, [tag]);

  const newTag = useCallback(async () => {
    const tag = await api.newTag();
    saveTag(tag);
    return tag;
  }, []);

  const annullaTag = useCallback(async () => {
    if (tag) {
      await api.annullaTag(tag.key);
    }
    clearTag();
  }, [tag]);

  return [tag, stats, tagStats, newTag, annullaTag];
};

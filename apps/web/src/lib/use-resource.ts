/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
export type Resource<T> = { data?:T; loading:boolean; error?:string; reload:()=>void };
/** Small REST resource hook. Dependencies are explicit so callers control refreshes. */
export function useResource<T>(load:()=>Promise<T>, dependencies:readonly unknown[] = []):Resource<T> {
  const [data,setData] = useState<T>(); const [loading,setLoading] = useState(true); const [error,setError] = useState<string>(); const [revision,setRevision] = useState(0);
  useEffect(() => { let active = true; setLoading(true); void load().then((value) => { if (active) { setData(value); setError(undefined); } }).catch((reason:unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load data.'); }).finally(() => { if (active) setLoading(false); }); return () => { active=false; }; }, [...dependencies,revision]);
  return { data,loading,error,reload:() => setRevision((value) => value + 1) };
}

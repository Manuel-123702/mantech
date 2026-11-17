/**
 * useDataSaver — detects if the user is on a slow or metered connection.
 *
 * Returns `true` when any of these are true:
 *  • navigator.connection.saveData === true  (user enabled Data Saver)
 *  • navigator.connection.effectiveType is '2g' or 'slow-2g'
 *  • navigator.connection.downlink < 1 Mbps
 *
 * Use this to conditionally skip heavy animations, autoplay video,
 * or high-res images for users on MTN/Orange mobile data in Cameroon.
 *
 * Usage:
 *   const dataSaver = useDataSaver();
 *   if (!dataSaver) { // load heavy content }
 */

'use client';

import { useEffect, useState } from 'react';

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;
}

function isSlow(conn?: NetworkInformation): boolean {
  if (!conn) return false;
  if (conn.saveData) return true;
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return true;
  if (conn.downlink !== undefined && conn.downlink < 1) return true;
  return false;
}

export function useDataSaver(): boolean {
  const [slow, setSlow] = useState<boolean>(() => isSlow(getConnection()));

  useEffect(() => {
    const conn = getConnection();
    if (!conn) return;
    const handler = () => setSlow(isSlow(conn));
    conn.addEventListener('change', handler);
    return () => conn.removeEventListener('change', handler);
  }, []);

  return slow;
}

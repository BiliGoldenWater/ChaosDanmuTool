/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function getParam(key: string): string {
  return new URLSearchParams(window.location.search).get(key);
}

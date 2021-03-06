/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function formatNumber(num: number): string {
  if (isNaN(num)) return num.toString();

  if (num <= 999) {
    return num.toString();
  } else if (num <= 9999) {
    return (num / 1000).toFixed(1) + "千";
  } else if (num <= 99999999) {
    return (num / 10000).toFixed(1) + "万";
  } else {
    return (num / 100000000).toFixed(1) + "亿";
  }
}

export function rgbI2S(num: number): string {
  if (typeof num === "number") {
    return "#" + num.toString(16).padStart(6, "0");
  } else if (typeof num == "string") {
    return num;
  } else {
    return "#000";
  }
}

export function rgbaI2S(num: number): string {
  if (typeof num === "number") {
    return "#" + num.toString(16).padStart(8, "0");
  } else if (typeof num == "string") {
    return num;
  } else {
    return "#000";
  }
}

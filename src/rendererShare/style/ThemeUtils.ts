/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as color from "@ant-design/colors";

const themeColor = color.blue;
const themeColorDark = color.generate(themeColor.primary, { theme: "dark" });
let isDarkTheme = false;

const root = document.documentElement;

const white: string[] = [];
for (let i = 0; i <= 0xff; i++) {
  const d = i.toString(16).padStart(2, "0");
  white.push(`#${d}${d}${d}`);
}

function set(key: string, value: number) {
  const start = isDarkTheme ? 0x00 : 0xff;
  const offset = Math.round(value * 0xff);
  const target = isDarkTheme ? start + offset : start - offset;
  root.style.setProperty(key, white[target]);
}

function setWithTheme(
  key: string,
  value: number,
  color: string = isDarkTheme ? themeColorDark[5] : themeColor.primary
) {
  const offset = Math.round(value * 0xff);
  root.style.setProperty(key, color + offset.toString(16).padStart(2, "0"));
}

export function toggleDarkMode(isDark = !isDarkTheme) {
  isDarkTheme = isDark;

  root.style.setProperty("--infoTextColor", color.blue.primary);
  root.style.setProperty("--successColor", color.green.primary);
  root.style.setProperty("--warningColor", color.yellow.primary);
  root.style.setProperty("--errorColor", color.red[4]);

  root.style.setProperty("--contentBorderRadius", "0.6em");
  root.style.setProperty("--itemBorderRadius", "0.3em");

  root.style.setProperty("--spacerWidth", "1em");

  setWithTheme("--selectedTextColor", 0.9);
  setWithTheme("--itemSelectedBackgroundColor", 0.15);
  setWithTheme("--itemSelectedHoverBackgroundColor", 0.3);
  setWithTheme("--itemSelectedActiveBackgroundColor", 0.25);

  if (isDarkTheme) {
    set("--titleTextColor", 0.85);
    set("--primaryTextColor", 0.85);
    set("--secondaryTextColor", 0.45);
    set("--unfocusedTextColor", 0.75);
    set("--focusedTextColor", 0.8);

    set("--disabledBackgroundColor", 0.1);
    set("--disabledTextColor", 0.35);

    set("--buttonBackgroundColor", 0.3);
    set("--buttonHoverBackgroundColor", 0.4);
    set("--buttonActiveBackgroundColor", 0.35);

    set("--primaryButtonTextColor", 1.0);
    setWithTheme("--primaryButtonBackgroundColor", 0.9);
    setWithTheme("--primaryButtonHoverBackgroundColor", 1.0);
    setWithTheme("--primaryButtonActiveBackgroundColor", 0.8);

    set("--dividerColor", 0.12);

    set("--backgroundColor", 0.05);
    set("--contentBackgroundColor", 0.15);
    set("--itemBackgroundColor", 0.2);
    set("--itemHoverBackgroundColor", 0.3);
    set("--itemActiveBackgroundColor", 0.25);
  } else {
    set("--titleTextColor", 0.85);
    set("--primaryTextColor", 0.85);
    set("--secondaryTextColor", 0.45);
    set("--unfocusedTextColor", 0.65);
    set("--focusedTextColor", 0.8);

    set("--disabledBackgroundColor", 0.15);
    set("--disabledTextColor", 0.4);

    set("--buttonBackgroundColor", 0.18);
    set("--buttonHoverBackgroundColor", 0.26);
    set("--buttonActiveBackgroundColor", 0.22);

    set("--primaryButtonTextColor", 0.0);
    setWithTheme("--primaryButtonBackgroundColor", 0.75);
    setWithTheme("--primaryButtonHoverBackgroundColor", 0.65);
    setWithTheme("--primaryButtonActiveBackgroundColor", 0.85);

    set("--dividerColor", 0.6);

    set("--backgroundColor", 0.15);
    set("--contentBackgroundColor", 0.06);
    set("--itemBackgroundColor", 0.12);
    set("--itemHoverBackgroundColor", 0.16);
    set("--itemActiveBackgroundColor", 0.2);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.toggleDarkMode = toggleDarkMode;

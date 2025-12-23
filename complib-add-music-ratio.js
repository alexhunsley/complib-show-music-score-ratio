// ==UserScript==
// @name         Add ratio to Music column (toggle + remember + strict gate)
// @namespace    local
// @version      1.6
// @description  Runs ONLY when the Sort-by control shows MusicScore. Defaults to ratio sort if no pref stored.
// @match        https://complib.org/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------------------------------------------------
     STRICT GATE:
     Only run if THIS specific dropdown-toggle exists and contains "MusicScore".
     (Matches your provided element: btn btn-default dropdown-toggle + data-toggle="dropdown" + Sort by tooltip.)
     ------------------------------------------------------------ */
  const sortByControl = document.querySelector(
    'a.btn.btn-default.dropdown-toggle[data-toggle="dropdown"][data-original-title="Sort by"]'
  );

  if (!sortByControl) return;

  // Use textContent (includes icon/caret text); trim to be safe.
  const sortByText = (sortByControl.textContent || '').replace(/\s+/g, ' ').trim();
  if (!sortByText.includes('MusicScore')) return;

  /* ------------------------------------------------------------
     Storage (default = sorted by ratio if unset)
     ------------------------------------------------------------ */
  const STORAGE_KEY = `complib:musicRatioSort:${location.origin}`;

  function loadPref() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === null) return true;   // DEFAULT: sorted by ratio
      return v === '1';
    } catch {
      return true;
    }
  }

  function savePref(sortedByRatio) {
    try {
      localStorage.setItem(STORAGE_KEY, sortedByRatio ? '1' : '0');
    } catch {
      /* ignore */
    }
  }

  /* ------------------------------------------------------------
     Table lookup
     ------------------------------------------------------------ */
  const tableSelector =
    'table.table-condensed.table.table-bordered.table.table-striped';
  const table = document.querySelector(tableSelector);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));
  if (!rows.length) return;

  /* ------------------------------------------------------------
     Compute ratios + store original order
     ------------------------------------------------------------ */
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    row.dataset.originalIndex = String(i);

    const tds = row.querySelectorAll(':scope > td');
    if (tds.length < 2) continue;

    const firstTd = tds[0];
    const secondTd = tds[1];

    const a = firstTd.querySelector('a');
    const firstText = (a ? a.textContent : firstTd.textContent).trim();
    const m1 = firstText.match(/^(\d+)/);
    if (!m1) continue;

    const denom = Number(m1[1]);

    const secondText = secondTd.textContent.trim();
    const m2 = secondText.match(/(\d+(?:\.\d+)?)/);
    if (!m2) continue;

    const score = Number(m2[1]);

    if (!Number.isFinite(denom) || denom === 0 || !Number.isFinite(score)) continue;

    const ratio = score / denom;

    row.dataset.musicScore = String(score);
    row.dataset.musicRatio = String(ratio);
  }

  /* ------------------------------------------------------------
     Rendering helpers
     ------------------------------------------------------------ */
  function setMusicCellDisplay(sortedByRatio) {
    for (const row of rows) {
      const tds = row.querySelectorAll(':scope > td');
      if (tds.length < 2) continue;

      const secondTd = tds[1];
      const scoreStr = row.dataset.musicScore;
      const ratioStr = row.dataset.musicRatio;
      if (scoreStr == null || ratioStr == null) continue;

      const ratioText = Number(ratioStr).toFixed(2);
      const scoreText = scoreStr;

      secondTd.textContent = sortedByRatio
        ? `${ratioText} (${scoreText})`
        : `${scoreText} (${ratioText})`;
    }
  }

  function sortByRatioDesc() {
    const sorted = [...rows].sort((a, b) => {
      const ra = a.dataset.musicRatio == null ? -Infinity : Number(a.dataset.musicRatio);
      const rb = b.dataset.musicRatio == null ? -Infinity : Number(b.dataset.musicRatio);
      return rb - ra;
    });
    for (const row of sorted) tbody.appendChild(row);
  }

  function restoreOriginalOrder() {
    const restored = [...rows].sort((a, b) => {
      return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
    });
    for (const row of restored) tbody.appendChild(row);
  }

  /* ------------------------------------------------------------
     Initial state (default = sorted by ratio)
     ------------------------------------------------------------ */
  let sortedByRatio = loadPref();

  if (sortedByRatio) {
    sortByRatioDesc();
    setMusicCellDisplay(true);
  } else {
    setMusicCellDisplay(false);
  }

  /* ------------------------------------------------------------
     Toggle handler
     ------------------------------------------------------------ */
  function toggleSort() {
    if (!sortedByRatio) {
      sortByRatioDesc();
      setMusicCellDisplay(true);
      sortedByRatio = true;
      savePref(true);
    } else {
      restoreOriginalOrder();
      setMusicCellDisplay(false);
      sortedByRatio = false;
      savePref(false);
    }
  }

  /* ------------------------------------------------------------
     Attach toggle to Music header
     ------------------------------------------------------------ */
  const musicTh = table.querySelector('thead tr')?.children?.[1];
  if (!musicTh) return;

  musicTh.style.cursor = 'pointer';
  musicTh.title = 'Click to toggle ratio sort (remembered)';
  musicTh.addEventListener('click', toggleSort);
})();

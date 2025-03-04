// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

const getLocalStorage = (key:string) => {
  const item = window.localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }

  return false;
};
const setLocalStorage = (key:string, value: any) =>
  window.localStorage.setItem(key, JSON.stringify(value));

export { getLocalStorage, setLocalStorage };

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

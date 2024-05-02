import axios, { AxiosResponse } from "axios";

async function get(url: string) {
  const res = await axios.get(url) as AxiosResponse;
  return res.data;
}

const exports = {
  get,
};

export default exports;
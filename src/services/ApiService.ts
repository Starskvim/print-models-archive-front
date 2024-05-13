import axios, { AxiosResponse } from "axios";

async function get(url: string) {
  const res = await axios.get(url) as AxiosResponse;
  return res.data;
}

async function post(url: string) {
  const res = await axios.post(url) as AxiosResponse;
  return res.data;
}

async function del(url: string) {
  const res = await axios.delete(url) as AxiosResponse;
  return res.data;
}

async function put(url: string) {
  const res = await axios.put(url) as AxiosResponse;
  return res.data;
}

const exports = {
  get,
  post,
  del,
  put
};

export default exports;
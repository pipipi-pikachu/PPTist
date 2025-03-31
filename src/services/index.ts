import axios from "./config";



export const SERVER_URL =
  import.meta.env.MODE === "development" ? "/api" : "http://127.0.0.1:3001/api";
export const ASSET_URL = "http://127.0.0.1:3001/assets";
export const API_URL = `http://127.0.0.1:3001/api`;


const url = new URL(window.location.href);
const t = url.searchParams.get("t") ? `?t=${url.searchParams.get("t")}` : ``;


export default {
  getMockData(filename: string): Promise<any> {
    return axios.get(`./mocks/${filename}.json`);
  },

  getFileData(filename: string): Promise<any> {
    const e = `${API_URL}/documents/${filename}${t}`;
    return axios.get(e);
  },


  AIPPT_Outline(
    content: string,
    language: string,
    model: string
  ): Promise<any> {
    return fetch(`${SERVER_URL}/tools/aippt_outline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    });
  },

  AIPPT(content: string, language: string, model: string): Promise<any> {
    return fetch(`${SERVER_URL}/tools/aippt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    });
  },
};

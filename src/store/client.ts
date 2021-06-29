import axios from "axios";
import https from "https";

var base_url =
  process.env.NODE_ENV === "development"
    ? "https://cdndemo-api.co-vin.in/api"
    : "https://cdn-api.co-vin.in/api";

export const apiCLient = axios.create({
  baseURL: base_url,
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    requestCert: false,
  }),
});

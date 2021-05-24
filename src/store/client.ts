import axios from "axios";
import https from "https";

var base_url = "https://cdn-api.co-vin.in/api";

const apiCLient = axios.create({
  baseURL: base_url,
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    requestCert: false,
  }),
});

export async function getSlots(district_id: number) {
  let response: any;
  var d: Date = new Date();
  var date: string;
  if (d.getMonth() > 8)
    date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  else date = d.getDate() + "-0" + (d.getMonth() + 1) + "-" + d.getFullYear();
  if (process.env.NODE_ENV === "development") {
    response = await axios.get(`${process.env.PUBLIC_URL}/sample-data.json`);
  } else {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    response = await apiCLient.get(
      "/v2/appointment/sessions/calendarByDistrict",
      {
        params: {
          district_id: String(district_id),
          date: date,
        },
      }
    );
  }
  if (response.status >= 200 && response.status < 400) return response.data;
  else throw TypeError("Invalid response code");
}

export async function getStates() {
  let response: any;
  if (process.env.NODE_ENV === "development") {
    response = await axios.get(`${process.env.PUBLIC_URL}/states.json`);
  } else {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    response = await apiCLient.get("v2/admin/location/states");
  }
  return response.data;
}

export async function getDistricts(state_id: number) {
  let response: any;
  if (process.env.NODE_ENV === "development") {
    response = await axios.get(`${process.env.PUBLIC_URL}/districts.json`);
  } else {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    response = await apiCLient.get(
      "/v2/admin/location/districts/" + String(state_id)
    );
  }
  return response.data;
}

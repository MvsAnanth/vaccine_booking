import axios from "axios";
import https from "https";

// const GetStates = "v2/admin/location/states";
// const GetDistricts = "/v2/admin/location/districts/";
// const GetSlotsByDistrict = "/v2/appointment/sessions/public/calendarByDistrict";

var base_url =
  process.env.NODE_ENV !== "development"
    ? "https://cdndemo-api.co-vin.in/api"
    : "https://cdn-api.co-vin.in/api";

// Production URL
// var base_url = "https://cdn-api.co-vin.in/api"

// Development-Test-server
// var base_url = "https://cdndemo-api.co-vin.in/api"

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

  if (district_id === 0)
    return {};
  
  if (d.getMonth() > 8)
    date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  else
    date = d.getDate() + "-0" + (d.getMonth() + 1) + "-" + d.getFullYear();
  
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  response = await apiCLient.get(
    "/v2/appointment/sessions/public/calendarByDistrict",
    {
      params: {
        district_id: String(district_id),
        date: date,
      },
    }
  );
  
  if (response.status >= 200 && response.status < 400) return response.data;
  else throw TypeError("Invalid response code");
}

export async function getSlotsWithPincode(pincode: number) {
  let response: any;
  var d: Date = new Date();
  var date: string;

  if (pincode === 0)
    return {};

  if (d.getMonth() > 8)
    date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  else
    date = d.getDate() + "-0" + (d.getMonth() + 1) + "-" + d.getFullYear();
  
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  response = await apiCLient.get(
    "/v2/appointment/sessions/public/calendarByPin",
    {
      params: {
        pincode: String(pincode),
        date: date,
      },
    }
  );
  
  if (response.status >= 200 && response.status < 400) return response.data;
  else throw TypeError("Invalid response code");
}

export async function getStates() {
  let response: any;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  response = await apiCLient.get("v2/admin/location/states");


  // if (process.env.NODE_ENV === "development") {
  //   response = await axios.get(`${process.env.PUBLIC_URL}/states.json`);
  // } else {
  //   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  //   response = await apiCLient.get("v2/admin/location/states");
  // }

  return response.data;
}

export async function getDistricts(state_id: number) {
  let response: any;

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  if (state_id === 0)
    return {};
  
  response = await apiCLient.get("/v2/admin/location/districts/" + String(state_id));

  // if (process.env.NODE_ENV === "development") {
  //   response = await axios.get(`${process.env.PUBLIC_URL}/districts.json`);
  // } else {
  //   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  //   response = await apiCLient.get(
  //     "/v2/admin/location/districts/" + String(state_id)
  //   );
  // }
  return response.data;
}

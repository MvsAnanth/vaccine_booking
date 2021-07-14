import axios from "axios";
import https from "https";

// const GetStates = "v2/admin/location/states";
// const GetDistricts = "/v2/admin/location/districts/";
// const GetSlotsByDistrict = "/v2/appointment/sessions/public/calendarByDistrict";

// var base_url =
//   process.env.NODE_ENV === "development"
//     ? "https://cdndemo-api.co-vin.in/api"
//     : "https://cdn-api.co-vin.in/api";

// Production URL
var base_url = "https://cdn-api.co-vin.in/api"

// Development-Test-server
// var base_url = "https://cdndemo-api.co-vin.in/api"

export const apiCLient = axios.create({
  baseURL: base_url,
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    requestCert: false,
  }),
});
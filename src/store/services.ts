import { apiCLient } from "./client";

export async function getSlots(district_id: number) {
    let response: any;
    var d: Date = new Date();
    var date: string;
    if (district_id === 0)
      return {};
    if (d.getMonth() > 8)
      date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    else date = d.getDate() + "-0" + (d.getMonth() + 1) + "-" + d.getFullYear();
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
  
  export async function getStates() {
    let response: any;
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    response = await apiCLient.get("v2/admin/location/states");
    return response.data;
  }
  
  export async function getDistricts(state_id: number) {
    let response: any;
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    if (state_id === 0)
      return {};
    response = await apiCLient.get(
      "/v2/admin/location/districts/" + String(state_id)
    );
    return response.data;
  }
  
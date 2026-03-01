import { apiFetch } from "./client";

export interface IParking {
  _id: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ParkingData {
  parkings: IParking[];
  totalParkings: number;
  totalPages: number;
}

export const getAllParkings = async (
  page: number = 1,
  limit: number = 100000,
  countryCode?: string
): Promise<ParkingData> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (countryCode) {
    params.append("countryCode", countryCode);
  }
  const data = await apiFetch<ParkingData>(`/api/parking?${params.toString()}`);
  if (!data?.parkings?.length) {
    throw new Error("No parkings returned");
  }
  return data;
};

export const getParkingById = async (id: string): Promise<IParking | null> => {
  try {
    return await apiFetch<IParking>(`/api/parking/${id}`);
  } catch {
    return null;
  }
};

export const getParkingsByCountry = async (
  countryCode: string
): Promise<IParking[]> => {
  try {
    return await apiFetch<IParking[]>(`/api/parking/country/${countryCode}`);
  } catch {
    return [];
  }
};

export type LocationDetails = {
  display_name: string;
  category?: string;
  type?: string;
  osm_type?: string;
  osm_id?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
  extratags?: {
    [key: string]: string;
  };
};

export type FacilityType = {
  type: string;
  icon: string;
};

export const getFacilityType = (
  category?: string,
  type?: string,
  extratags?: { [key: string]: string }
): FacilityType => {
  if (!category) return { type: "parking", icon: "🅿️" };
  switch (category) {
    case "amenity":
      switch (type) {
        case "fuel":
          return {
            type: "gas_station",
            icon: "⛽",
          };
        case "parking":
          return {
            type: "parking",
            icon: "🅿️",
          };
        case "parking_space":
          return {
            type: "parking_space",
            icon: "🅿️",
          };
        case "truck_stop":
          return {
            type: "truck_stop",
            icon: "🚚",
          };
        case "rest_area":
          return {
            type: "rest_area",
            icon: "🛋️",
          };
        case "motorway_services":
          return {
            type: "motorway_services",
            icon: "🏪",
          };
        case "car_wash":
          return { type: "car_wash", icon: "🚿" };
        case "charging_station":
          return {
            type: "charging_station",
            icon: "🔋",
          };
        default:
          return { type: "amenity", icon: "🏢" };
      }
    case "highway":
      switch (type) {
        case "rest_area":
          return {
            type: "highway_rest_area",
            icon: "🛣️",
          };
        case "services":
          return {
            type: "highway_services",
            icon: "🏪",
          };
        default:
          return { type: "highway", icon: "🛣️" };
      }
    case "shop":
      if (type === "fuel") {
        return {
          type: "fuel_shop",
          icon: "🏪",
        };
      }
      return { type: "shop", icon: "🛒" };
    default:
      return { type: "location", icon: "📍" };
  }
};

export const fetchLocationDetails = async (
  lat: number,
  lng: number,
  language?: string
): Promise<LocationDetails | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&extratags=1`,
      {
        headers: {
          "User-Agent": "Logifie-Parking-App/1.0",
          ...(language && { "Accept-Language": language }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
};

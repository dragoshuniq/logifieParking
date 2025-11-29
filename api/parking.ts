const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.145:3100";

export interface IParking extends Document {
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
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (countryCode) {
      params.append("countryCode", countryCode);
    }
    const response = await fetch(
      `${API_URL}/api/parking?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch parkings");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    return { parkings: [], totalParkings: 0, totalPages: 0 };
  }
};

export const getParkingById = async (
  id: string
): Promise<IParking | null> => {
  try {
    const response = await fetch(`${API_URL}/api/parking/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch parking");
    }
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};

export const getParkingsByCountry = async (
  countryCode: string
): Promise<IParking[]> => {
  try {
    const response = await fetch(
      `${API_URL}/api/parking/country/${countryCode}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch parkings by country");
    }
    const data = await response.json();
    return data;
  } catch {
    return [];
  }
};

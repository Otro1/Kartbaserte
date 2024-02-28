import axios from "axios";

export async function geocode(address: string) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
      },
    },
  );

  if (response.data.length > 0) {
    return [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)];
  } else {
    throw new Error("No results found");
  }
}

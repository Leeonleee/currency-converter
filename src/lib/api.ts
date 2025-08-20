import axios from "axios";

const BASE_URL = "https://api.fxratesapi.com/latest";

// Fetch all rates and available currencies
export async function fetchRates() {
    const response = await axios.get(BASE_URL);
    return response.data;
}
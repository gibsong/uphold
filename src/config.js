const API_CURRENCY_PAIRS_URL = "http://localhost:9000/api/v1/pairs";
const API_BASE_URL = "http://localhost:9000/api/v1/currency/";

const HEADERS = {
    method: "GET",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
}

export { API_CURRENCY_PAIRS_URL, API_BASE_URL, HEADERS };
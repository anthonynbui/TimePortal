export async function fetchFact(month, day) {
    const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`
    );

    if (!response.ok) {
        // Throw an error with the status code
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If response is OK, parse it as JSON
    const data = await response.json();
    return data;
}
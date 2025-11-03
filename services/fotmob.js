import axios from 'axios';

// Fungsi mendapatkan ID tim
export const getTeamId = async (teamName) => {
    try {
        const response = await axios.get('https://www.fotmob.com/api/data/search/suggest?hits=50&lang=en', {
            params: { term: teamName }
        });

        const result = response.data[0]?.suggestions;

        if (result.length > 0) {
            return {
                id: result[0].id,
                name: result[0].name,
                leagueId: result[0].leagueId,
                leagueName: result[0].leagueName
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting team ID:', error);
        return null;
    }
}

// Fungsi mendapatkan upcoming pertandingan data dari tim a dan tim b
export const getUpcomingMatches = async (team1Name, team2Name) => {
    try {
        const response = await axios.get(`https://www.fotmob.com/api/data/search/suggest?hits=50&lang=id%2Cen&term=${team1Name}+vs+${team2Name}`, {
            headers: {
                "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "x-mas": "eyJib2R5Ijp7InVybCI6Ii9hcGkvZGF0YS9tYXRjaERldGFpbHM/bWF0Y2hJZD00ODEzNDgwIiwiY29kZSI6MTc2MjEyMjM4NTI5MCwiZm9vIjoicHJvZHVjdGlvbjo5NWI3ZTg1ZmFhYTYwYTYzN2RmYTQyZjAzMzM0Zjg5ODQxZWNhYTFiIn0sInNpZ25hdHVyZSI6IkQxNDlGREUxMTc4MDFBNDczRTU3N0Y0M0Q3MkI1Q0E2In0="
            },
        });
        const upcomingMatches = response.data[0]?.suggestions[0];
        if (!upcomingMatches) {
            return null;
        }
        return upcomingMatches;
    } catch (error) {
        console.error('Error getting upcoming matches:', error);
        return null;
    }
}

// mendapatkan match data
export const getMatchData = async (matchId) => {
    try {
        const response = await axios.get(`https://www.fotmob.com/api/data/matchDetails?matchId=${matchId}`, {
            headers: {
                "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "x-mas": "eyJib2R5Ijp7InVybCI6Ii9hcGkvZGF0YS9tYXRjaERldGFpbHM/bWF0Y2hJZD00ODEzNDgwIiwiY29kZSI6MTc2MjEyMjM4NTI5MCwiZm9vIjoicHJvZHVjdGlvbjo5NWI3ZTg1ZmFhYTYwYTYzN2RmYTQyZjAzMzM0Zjg5ODQxZWNhYTFiIn0sInNpZ25hdHVyZSI6IkQxNDlGREUxMTc4MDFBNDczRTU3N0Y0M0Q3MkI1Q0E2In0="
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting match data:', error);
        return null;
    }
}

// Fungsi mendapatkan pertandingan terakhir
export const getTeamData = async (team) => {
    try {
        const response = await axios.get(`https://www.fotmob.com/api/data/teams?id=${team.id}&ccode3=IDN`, {
            headers: {
                "accept": "*/*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-mas": "eyJib2R5Ijp7InVybCI6Ii9hcGkvZGF0YS90ZWFtcz9pZD0xMDI2MCZjY29kZTM9SUROIiwiY29kZSI6MTc2MjA5MzgzNzQzNSwiZm9vIjoicHJvZHVjdGlvbjo5NWI3ZTg1ZmFhYTYwYTYzN2RmYTQyZjAzMzM0Zjg5ODQxZWNhYTFiIn0sInNpZ25hdHVyZSI6IkZBMEZFM0Y5OERERTczMTVEMzBFQzUxMkE2NjlBNkJCIn0="
            },
            withCredentials: true
        });

        return response.data;

    } catch (error) {
        console.error('Error getting last matches:', error);
        return null;
    }
}

// Fungsi mendapatkan pertandingan terakhir
export const getLastMatch = async (teamData) => {
    try {
        
        const data = teamData;

        const allFixtures = data.fixtures.allFixtures.fixtures;
        const lastMatchId = data.fixtures.allFixtures.lastMatch.id;

        const index = allFixtures.findIndex(item => item.id === lastMatchId);

        if (index === -1) {
            console.warn('Last match not found in fixture list.');
            return null;
        }

        const start = Math.max(0, index - 4);
        const lastMatches = allFixtures.slice(start, index + 1);

        return lastMatches;
    } catch (error) {
        console.error('Error getting last matches:', error);
        return null;
    }
}

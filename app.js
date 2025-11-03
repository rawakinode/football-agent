import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { getTeamId, getUpcomingMatches, getMatchData, getTeamData, getLastMatch } from "./services/fotmob.js";
import { analyzeInputWithAI, predictionMatch } from './agents/sentient.js';

// Inisialisasi readline untuk CLI
const rl = readline.createInterface({ input, output });

async function startCli() {

    console.log('⚽ Sentient AI Football Prediction Agent');
    console.log('='.repeat(50));
    console.log('I will analyze your input and identify the teams!');
    console.log('Example: "arsenal versus mu match"');
    console.log('='.repeat(50));

    try {
        const userInput = await rl.question('\n➡️  Input your match: ');
        console.log('\n🧠 Analyze your request ...');

        // Proses input user dengan AI
        const result = await analyzeInputWithAI(userInput);
        if (!result || !result.team1 || !result.team2) {
            console.log(`❌ Agent: Failed get your team input`);
            return false;
        }
        console.log(`✅ AI Generated: ${result.team1} vs ${result.team2}`);

        // Mendapatkan data tim dari API
        let teamData1 = await getTeamId(result.team1);
        let teamData2 = await getTeamId(result.team2);
        if (!teamData1 || !teamData2) {
            console.log(`❌ Fotmob API: Team 1 or Team 2 not found on API.`);
            return false;
        }

        // Mendapatkan Match yang akan datang dari API
        const upcomingMatch = await getUpcomingMatches(teamData1.name, teamData2.name);
        if (!upcomingMatch) {
            console.log(`❌ Fotmob API: Upcoming match not found`);
            return;
        }

        // Cek apakah tanggal match sudah lewat
        const matchDate = new Date(upcomingMatch.matchDate);
        const currentDate = new Date();
        if (matchDate < currentDate) {
            console.log(`❌ Fotmob API: Upcoming match not found`);
            return;
        }

        // Cek apakah teamData1 adalah home team, jika tidak maka tukar
        if (teamData1.id !== upcomingMatch.homeTeamId) {
            const temp = teamData1;
            teamData1 = teamData2;
            teamData2 = temp;
            console.log(`🔄 Teams swapped: ${teamData1.name} (home) vs ${teamData2.name} (away)`);
        }

        console.log(`✅ Fotmob API: ${teamData1.name} vs ${teamData2.name} upcoming match found on (${matchDate.toDateString()})`);

        // Fungsi untuk mendapatkan match data
        const matchData = await getMatchData(upcomingMatch.id);
        if (!matchData) {
            console.log(`❌ Fotmob API: Failed get match data.`);
            return;
        }
        console.log(`✅ Fotmob API: ${teamData1.name} vs ${teamData2.name} match data found`);

        // Build Prompt ==========
        let prompt = `\nFOOTBALL MATCH PREDICTION: ${teamData1.name} vs ${teamData2.name} on ${matchDate.toDateString()}\n`;

        // Build H2H Match
        if (!matchData.content.h2h) {
            console.log(`❌ Fotmob API: Canceled! H2H not available on API.`);
            return;
        }
        const h2hMatch = matchData.content.h2h.matches.filter(match => match.status.finished === true);
        const h2hMax5Match = h2hMatch.slice(1, Math.min(6, h2hMatch.length));

        let H2H_PROMPT = `\nHEAD 2 HEAD (MAX 5) :\n`;
        for (let i = 0; i < h2hMax5Match.length; i++) {
            const e = h2hMax5Match[i];
            const concept = `${e.home.name} ${e.status.scoreStr} ${e.away.name} (${new Date(e.time.utcTime).toDateString()})\n`;
            H2H_PROMPT += concept;
        }

        // Fungsi untuk mendapatkan data team
        const homeTeamData = await getTeamData(teamData1);
        const awayTeamData = await getTeamData(teamData2);

        if (!homeTeamData || !awayTeamData) {
            console.log(`❌ Fotmob API: Canceled! Team data not availabe on API.`);
            return;
        }

        // Fungsi untuk mendapatkan pertandingan terakhir (maks 5)
        const homeLastMatch = await getLastMatch(homeTeamData);
        const awayLastMatch = await getLastMatch(awayTeamData);

        if (!homeLastMatch || !awayLastMatch) {
            console.log(`❌ Fotmob API: Canceled! Last match not available on API.`);
            return;
        }

        let LAST_MATCH_PROMPT = `LAST MATCH (MAX 5):\n`;
        LAST_MATCH_PROMPT += `\n${teamData1.name}\n`;

        for (let i = 0; i < homeLastMatch.length; i++) {
            const e = homeLastMatch[i];
            const concept = `${e.home.name} ${e.status.scoreStr} ${e.away.name} (${new Date(e.status.utcTime).toDateString()})\n`;
            LAST_MATCH_PROMPT += concept;
        }

        LAST_MATCH_PROMPT += `\n${teamData2.name}\n`;
        for (let i = 0; i < awayLastMatch.length; i++) {
            const e = awayLastMatch[i];
            const concept = `${e.home.name} ${e.status.scoreStr} ${e.away.name} (${new Date(e.status.utcTime).toDateString()})\n`;
            LAST_MATCH_PROMPT += concept;
        }

        // Data Squad Kedua Tim
        let SQUAD_TEAM = `\nDATA & STATISTIC PLAYER / SQUAD TEAM\n`;
        const squadHome = homeTeamData.squad.squad;
        SQUAD_TEAM += `\n${homeTeamData.details.name}\n`;

        for (let i = 0; i < squadHome.length; i++) {
            const e = squadHome[i];
            SQUAD_TEAM += `\n${e.title.toUpperCase()}\n`;

            for (let m = 1; m < e.members.length; m++) {
                const n = e.members[m];
                SQUAD_TEAM += `${n.name} | ${n.positionIdsDesc} | ${n.age} years | Rating: ${n.rating} | Goal: ${n.goals}\n`;
            }
        }

        const squadAway = awayTeamData.squad.squad;
        SQUAD_TEAM += `\n${awayTeamData.details.name}\n`;

        for (let i = 0; i < squadAway.length; i++) {
            const e = squadAway[i];
            SQUAD_TEAM += `\n${e.title.toUpperCase()}\n`;

            for (let m = 1; m < e.members.length; m++) {
                const n = e.members[m];
                SQUAD_TEAM += `${n.name} | ${n.positionIdsDesc} | ${n.age} years | Rating: ${n.rating} | Goal: ${n.goals}\n`;
            }
        }

        // Perkiraan Pemain yang Absen
        let ABSENT_PLAYER = `\nPLAYER INJURED OR CAN'T PLAY IN THIS MATCH:\n`;
        ABSENT_PLAYER += `\n${matchData.content.lineup.homeTeam.name}:\n`;
        for (let i = 0; i < matchData.content.lineup.homeTeam.unavailable.length; i++) {
            const e = matchData.content.lineup.homeTeam.unavailable[i];
            ABSENT_PLAYER += `${e.name}\n`;
        }

        ABSENT_PLAYER += `\n${matchData.content.lineup.awayTeam.name}:\n`;
        for (let i = 0; i < matchData.content.lineup.awayTeam.unavailable.length; i++) {
            const e = matchData.content.lineup.awayTeam.unavailable[i];
            ABSENT_PLAYER += `${e.name}\n`;
        }

        // Combine all prompt
        prompt += `${H2H_PROMPT}\n${LAST_MATCH_PROMPT}\n${SQUAD_TEAM}\n${ABSENT_PLAYER}\n`;

        // Buat prediksi
        console.log('\n🧠 Agent: thinking ...');
        const prediction = await predictionMatch(prompt);
        if (!prediction) {
            console.log(`❌ Agent: Failed to get predictions result.`);
            return;
        }

        console.log(`\n======================= RESULT =======================\n`);

        console.log(prediction);

        console.log(`\n====================== END RESULT ======================\n`);

    } catch (err) {
        console.error('Terjadi error saat memproses input:', err);
    } finally {
        console.log('='.repeat(50));
        rl.close();
    }
}

startCli();
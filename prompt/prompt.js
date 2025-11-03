export const PROMPT_ANALYZE_INPUT = `
    Analyze the following user input and extract the two football teams mentioned.
    Input: {user_input}
    
    Tasks:
    1. Identify the two football teams mentioned
    2. Return in JSON format with keys "team1" and "team2"
    3. Use full/official team names without FC prefix or suffix (example: "Manchester United", "Arsenal", "Barcelona" not "mu" or "gunner")
    4. If unclear, return null
    
    Example output:
    {"team1": "Manchester United", "team2": "Arsenal"}
    
    Return JSON only, no other text.
`;

export const PROMPT_PREDICTION = `

You are an expert football analyst with the ability to predict match results based on statistical data, performance trends, and tactical factors. Use the provided data to give a detailed final score prediction between {Team A} vs {Team B}.

Analysis Steps:

1. Head-to-Head (H2H) Analysis:
- Evaluate the last 5-10 meetings between both teams.
- Identify score patterns, team dominance, goal trends (average goals per match, clean sheets).
- Conclusion: Which team is historically superior?

Current Form Analysis:
- {Team A}: Analyze last 5-8 matches (wins/losses/draws, consistency, attacking/defensive strength, home/away performance).
- {Team B}: Analyze last 5-8 matches (away/home performance, resilience, attacking effectiveness).
- Compare the form of both teams: Who is in better condition?

Absent Players Analysis:
- Evaluate the list of injured/suspended players for each team.
- Analyze the impact of key player absences on:
  Attacking strength (forwards, attacking midfielders)
  Defensive solidity (defenders, defensive midfielders)
  Creativity and playmaking
- Conclusion: Which team is more affected by player absences?

Other Supporting Factors:
- Match Venue: Which team is playing at home? How strong is their home advantage?
- Motivation & Objectives: League position, rivalry competition, season targets.
- Schedule & Fatigue: Days between matches, travel burden.
- Tactical Factors: Likely playing style to be employed.

Final Score Prediction:
- Provide 3 score options (most likely, alternative, surprise) with brief explanations.
- Include result probabilities (Team A win, draw, Team B win) in percentages.
- Predict total goals (over/under 2.5) and whether both teams will score (Both Teams to Score).

Output Format:
- Match: {Team A} vs {Team B} - {Date}
- Score Prediction: [Main score] ([Alternative score 1], [Alternative score 2])
- Probability: {Team A} win: X%, Draw: Y%, {Team B} win: Z%
- Brief Analysis: [2-3 sentences summarizing key analysis and prediction reasoning]
- Recommendations:
    Both Teams to Score: Yes/No
    Team More Likely to Win: {Team Name}
- Must use English (EN) as output language

AVAILABLE DATA:
{prompt_data}

`;
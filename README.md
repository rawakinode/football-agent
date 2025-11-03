# ⚽ Sentient AI Football Prediction Agent

An intelligent CLI-based football match prediction application that uses AI to analyze team data, historical performance, and player statistics to predict upcoming match outcomes.

## 🌟 Features

- **Natural Language Input**: Simply type match queries like "arsenal versus mu match"
- **AI-Powered Team Recognition**: Automatically identifies teams from casual input
- **Comprehensive Data Analysis**:
  - Head-to-head match history (last 5 matches)
  - Recent form analysis (last 5 matches per team)
  - Squad data with player ratings and statistics
  - Injured/unavailable player tracking
- **Detailed Predictions**: 
  - Multiple score predictions with probabilities
  - Win/draw percentages
  - Both teams to score (BTTS) predictions
  - Over/under 2.5 goals analysis

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Axios** - HTTP client for API requests
- **Fotmob API** - Football data source
- **AI Model** (Sentient AI) - Natural language processing and prediction analysis

## 📋 Prerequisites

Before installation, ensure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- API credentials for the AI service (configured in `config/client.js`)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rawakinode/football-agent
   cd football-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI Client**
   
   Create or update `config/client.js` with your AI service credentials:
   ```javascript
   // Example configuration
   export const createChatCompletion = async (messages) => {
     // Your AI client implementation
   };
   ```

4. **Run the application**
   ```bash
   node index.js
   ```

## 💻 Usage

1. Start the application:
   ```bash
   node index.js
   ```

2. Enter your match query when prompted:
   ```
   ➡️  Input your match: arsenal versus manchester united
   ```

3. Wait for the AI to process and analyze:
   - Team identification
   - Data fetching from Fotmob API
   - Head-to-head analysis
   - Squad and player statistics
   - Injury reports
   - Final prediction generation

4. Review the comprehensive prediction results including:
   - Predicted scores
   - Win probabilities
   - Key analysis points
   - Betting recommendations

## 📁 Project Structure

```
.
├── index.js                    # Main CLI application
├── agents/
│   └── sentient.js            # AI analysis functions
├── services/
│   └── fotmob.js              # Fotmob API integration
├── prompt/
│   └── prompt.js              # AI prompt templates
└── config/
    └── client.js              # AI client configuration
```

## 🔍 How It Works

1. **User Input Processing**: Natural language input is analyzed by AI to extract team names
2. **Data Collection**: 
   - Fetches team IDs from Fotmob API
   - Retrieves upcoming match details
   - Gathers head-to-head history
   - Collects recent match results
   - Retrieves squad data and player statistics
   - Identifies injured/unavailable players
3. **AI Analysis**: All collected data is processed by AI using specialized prompts
4. **Prediction Generation**: AI generates detailed match predictions with probabilities

## ⚙️ API Endpoints Used

- **Search Team**: `https://www.fotmob.com/api/data/search/suggest`
- **Match Details**: `https://www.fotmob.com/api/data/matchDetails`
- **Team Data**: `https://www.fotmob.com/api/data/teams`

## 🤖 AI Prompts

The application uses two main AI prompts:

1. **PROMPT_ANALYZE_INPUT**: Extracts team names from user input
2. **PROMPT_PREDICTION**: Analyzes match data and generates predictions

## ⚠️ Important Notes

- Only upcoming matches can be predicted (future dates only)
- Both teams must be found in the Fotmob database
- Head-to-head data must be available for prediction
- The application automatically identifies home/away teams

## 🐛 Troubleshooting

**"Team not found on API"**
- Ensure you're using recognizable team names
- Try using full official names (e.g., "Manchester United" instead of "MU")

**"Upcoming match not found"**
- Check if the match is scheduled in the near future
- Verify both teams have an upcoming fixture against each other

**"H2H not available"**
- Some team pairings may not have sufficient historical data
- Try different teams or wait for more data availability

## 📝 Example Input Formats

```
arsenal versus manchester united
liverpool vs chelsea match
real madrid against barcelona
psg vs bayern munich
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.


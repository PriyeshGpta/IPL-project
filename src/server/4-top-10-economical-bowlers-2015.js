const fs = require('fs').promises; // Using promises for asynchronous operations

const year = 2015;
const dataPath = '../data/deliveries.csv';
const outputPath = '../public/output/topEconomicalBowlers2015.json';

async function getTopEconomicalBowlers() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const lines = data.split('\n');

    const bowlers = {};

    lines.forEach(row => {
      const [matchId, batsman, bowler, runsConceded, wickets, overs] = row.split(',');

      // Parse year from matchId (assuming format YYYYXXXX)
      const matchYear = parseInt(matchId.substring(0, 4), 10);

      // Filter for matches in the specified year
      if (matchYear !== year) return;

      // Calculate economy (assuming overs are valid floats)
      const economy = parseFloat(runsConceded) / (parseFloat(overs) || 0);

      // Update bowler data (considering only bowlers with minimum overs bowled)
      if (overs > 0 && !isNaN(economy)) {
        if (!bowlers[bowler]) {
          bowlers[bowler] = { runsConceded: 0, overs: 0 };
        }
        bowlers[bowler].runsConceded += parseInt(runsConceded, 10);
        bowlers[bowler].overs += parseFloat(overs);
      }
    });

    // Calculate final economy for each bowler
    for (const bowler in bowlers) {
      bowlers[bowler].economy = bowlers[bowler].runsConceded / bowlers[bowler].overs;
    }

    // Sort bowlers by economy (ascending) and extract top 10
    const topBowlers = Object.entries(bowlers)
      .sort((a, b) => a[1].economy - b[1].economy) // Sort by economy
      .slice(0, 10)
      .map(([bowlerName, stats]) => ({ bowler: bowlerName, economy: stats.economy }));

    await fs.writeFile(outputPath, JSON.stringify(topBowlers, null, 2));
    console.log(`Top 10 economical bowlers for ${year} written to ${outputPath}`);
  } catch (err) {
    console.error('Error processing data:', err);
  }
}

getTopEconomicalBowlers();

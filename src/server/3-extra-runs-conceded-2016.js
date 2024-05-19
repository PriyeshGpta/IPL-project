const fs = require('fs').promises; // Using promises for asynchronous operations

const year = 2016;
const dataPath = '../data/deliveries.csv';
const outputPath = '../public/output/extraRunsConceded2016.json';

async function calculateExtraRuns() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const lines = data.split('\n');

    const extraRunsConceded = lines.reduce((acc, line, index) => {
   
      if (index === 0) return acc;

      const fields = line.split(',');

    
      if (fields.length >= 17 && fields[0].slice(0, 4) === String(year)) {
        const bowlingTeam = fields[3].trim();
        const extraRuns = parseInt(fields[16], 10);

       
        if (!isNaN(extraRuns)) {
          acc[bowlingTeam] = (acc[bowlingTeam] || 0) + extraRuns;
        }
      }
      return acc;
    }, {});

    await fs.writeFile(outputPath, JSON.stringify(extraRunsConceded, null, 2));
    console.log(`Extra runs conceded per team in ${year} written to ${outputPath}`);
  } catch (err) {
    console.error('Error processing data:', err);
  }
}

calculateExtraRuns();

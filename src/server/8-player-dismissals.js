const fs = require('fs');
const path = require('path');

const deliveriesData = fs.readFileSync(path.resolve(__dirname, '../data/deliveries.csv'), 'utf8');

function parseCSV(data) {
  const [header, ...rows] = data.trim().split('\n').map(row => row.split(','));
  return rows.map(row => Object.fromEntries(row.map((val, i) => [header[i], val])));
}

function findMostDismissals(deliveries) {
  const dismissalCount = {};

  deliveries.forEach(delivery => {
    const { bowler, player_dismissed, dismissal_kind } = delivery;

    if (player_dismissed && dismissal_kind && dismissal_kind !== 'run out') {
      const key = `${bowler}-${player_dismissed}`;
      if (!dismissalCount[key]) {
        dismissalCount[key] = 0;
      }
      dismissalCount[key]++;
    }
  });

  let maxDismissals = 0;
  let result = {};

  for (const key in dismissalCount) {
    if (dismissalCount[key] > maxDismissals) {
      maxDismissals = dismissalCount[key];
      result = {
        pair: key,
        count: dismissalCount[key]
      };
    }
  }

  const [bowler, player] = result.pair.split('-');
  return {
    bowler,
    player,
    dismissals: result.count
  };
}

const deliveries = parseCSV(deliveriesData);
const mostDismissals = findMostDismissals(deliveries);
fs.writeFileSync(
  path.resolve(__dirname, '../public/output/playerDismissals.json'),
  JSON.stringify(playerDismissals, null, 2)
);

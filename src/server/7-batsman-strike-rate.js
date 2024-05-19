const fs = require('fs');

fs.readFile('../data/deliveries.csv', 'utf8', (err, data) => {
    if (err) throw err;
    
    const batsmanStats = data.split('\n').slice(1).reduce((stats, line) => {
        const [, , , , , , batsman, , , , , , , , , , , , , , , , , , batsman_runs] = line.split(',');
        stats[batsman] = stats[batsman] || { runs: 0, balls: 0 };
        stats[batsman].runs += parseInt(batsman_runs);
        stats[batsman].balls++;
        return stats;
    }, {});
    
    const strikeRates = Object.fromEntries(Object.entries(batsmanStats)
        .map(([batsman, { runs, balls }]) => {
            const strikeRate = balls !== 0 ? (runs / balls) * 100 : 0; // Handle division by zero
            return [batsman, strikeRate];
        })
        .sort(([, strikeRateA], [, strikeRateB]) => strikeRateB - strikeRateA));
    
    fs.writeFile('../public/output/batsmanStrikeRates.json', JSON.stringify(strikeRates, null, 2), err => {
        if (err) throw err;
        console.log('Batsman strike rate data has been written to batsmanStrikeRate.json');
    });
});

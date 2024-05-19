const fs = require('fs');

fs.readFile('../data/deliveries.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const superOverDeliveries = data.split('\n').slice(1).filter(line => {
        const splitLine = line.split(',');
        const over = parseInt(splitLine[8]?.trim()); // Using optional chaining to handle potential undefined value
        return over === 20;
    });

    const bowlerStats = superOverDeliveries.reduce((stats, line) => {
        const splitLine = line.split(',');
        const bowler = splitLine[14]?.trim(); // Using optional chaining to handle potential undefined value
        const totalRuns = parseInt(splitLine[17]?.trim()); // Using optional chaining to handle potential undefined value
        const isWide = splitLine[16]?.trim() === '5'; // Using optional chaining to handle potential undefined value
        const isNoBall = splitLine[16]?.trim() === '2'; // Using optional chaining to handle potential undefined value
        const isWideOrNoBall = isWide || isNoBall;
        if (bowler && !isWideOrNoBall) {
            stats[bowler] = stats[bowler] || { runs: 0, balls: 0 };
            stats[bowler].runs += totalRuns;
            stats[bowler].balls++;
        }
        return stats;
    }, {});

    const economyRates = Object.fromEntries(Object.entries(bowlerStats)
        .map(([bowler, { runs, balls }]) => {
            const economy = balls !== 0 ? (runs / balls) * 6 : 0;
            return [bowler, economy];
        })
        .sort(([, economyA], [, economyB]) => economyA - economyB));

    fs.writeFile('../public/output/bestEconomySuperOvers.json', JSON.stringify(economyRates, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Best economy rates in super overs data has been written to bestEconomySuperOvers.json');
    });
});

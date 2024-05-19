const fs = require('fs');

fs.readFile('../data/matches.csv', 'utf8', (err, data) => {
    if (err) throw err;

    const matchesPerYear = data.split('\n').slice(1).reduce((acc, line) => {
        const fields = line.split(',');
        if (fields.length >= 2) {
            const season = fields[1].trim();
            acc[season] = (acc[season] || 0) + 1;
        }
        return acc;
    }, {});

    fs.writeFile('../public/output/matchesPerYear.json', JSON.stringify(matchesPerYear, null, 2), err => {
        if (err) throw err;
        console.log('Matches per year data has been written to matchesPerYear.json');
    });
});

// 2-matches-won-per-team-per-year.js

const fs = require('fs');

fs.readFile('../data/matches.csv', 'utf8', (err, data) => {
    if (err) throw err;

    const matchesWonPerTeamPerYear = data.split('\n').slice(1).reduce((acc, line) => {
        const fields = line.split(',');
        if (fields.length >= 12) {
            const season = fields[1].trim();
            const winner = fields[10].trim();
            if (winner) { 
                acc[season] = acc[season] || {};
                acc[season][winner] = (acc[season][winner] || 0) + 1;
            }
        }
        return acc;
    }, {});

    fs.writeFile('../public/output/matchesWonPerTeamPerYear.json', JSON.stringify(matchesWonPerTeamPerYear, null, 2), err => {
        if (err) throw err;
        console.log('Matches won per team per year data has been written to matchesWonPerTeamPerYear.json');
    });
});

// 5-toss-and-match-winner.js

const fs = require('fs');

function tossAndMatchWinner(matchesData) {
    const tossAndMatchWinnerData = matchesData.reduce((acc, match) => {
        const tossWinner = match.toss_winner;
        const matchWinner = match.winner;
        if (tossWinner && matchWinner) {
            if (tossWinner === matchWinner) {
                acc[tossWinner] = (acc[tossWinner] || 0) + 1;
            }
        }
        return acc;
    }, {});

    return tossAndMatchWinnerData;
}

fs.readFile('../data/matches.csv', 'utf8', (err, data) => {
    if (err) throw err;
    const matches = data.split('\n').slice(1).map(line => {
        const [id, season, , , , , toss_winner, , , , winner] = line.split(',').map(item => item.trim());
        return { id, season, toss_winner, winner };
    });
    const tossAndMatchWinnerData = tossAndMatchWinner(matches);
    fs.writeFile('../public/output/tossAndMatchWinner.json', JSON.stringify(tossAndMatchWinnerData, null, 2), err => {
        if (err) throw err;
        console.log('Toss and match winner data has been written to tossAndMatchWinner.json');
    });
});

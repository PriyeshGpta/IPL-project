const fs = require('fs');

fs.readFile('../data/matches.csv', 'utf8', (err, data) => {
    if (err) throw err;
    
    const playerOfTheMatch = {};
    const matches = data.split('\n').slice(1).map(line => {
        const [, season, , , , , , , , , , , , player_of_match] = line.split(',').map(item => item.trim());
        return { season, player_of_match };
    });
    
    matches.forEach(match => {
        const { season, player_of_match } = match;
        if (player_of_match !== '') {
            if (!playerOfTheMatch[season]) {
                playerOfTheMatch[season] = {};
            }
            playerOfTheMatch[season][player_of_match] = (playerOfTheMatch[season][player_of_match] || 0) + 1;
        }
    });
    
    const playerOfTheMatchPerSeason = {};
    Object.keys(playerOfTheMatch).forEach(season => {
        const maxPlayerOfTheMatch = Object.keys(playerOfTheMatch[season]).reduce((a, b) => playerOfTheMatch[season][a] > playerOfTheMatch[season][b] ? a : b);
        playerOfTheMatchPerSeason[season] = { player: maxPlayerOfTheMatch, count: playerOfTheMatch[season][maxPlayerOfTheMatch] };
    });
    
    fs.writeFile('../public/output/playerOfTheMatch.json', JSON.stringify(playerOfTheMatchPerSeason, null, 2), err => {
        if (err) throw err;
        console.log('Player of the Match data has been written to playerOfTheMatch.json');
    });
});

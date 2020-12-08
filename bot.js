var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        logger.info(cmd.toLowerCase());
        switch(cmd.toLowerCase()) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong! <@' + userID + '>'
                });
                break;
            default: 
                logger.info(cmd);
                break;
            case 'name':
                bot.sendMessage({
                    to: channelID,
                    message: user + ' <@' + userID + '>'
                });
                break;
            case 'add':
                var number= addFive(args[1]); 
                bot.sendMessage({
                        to: channelID,
                        message: number + ' <@' + userID + '>'
                    });
                break;
            // Strength: randomNumber
            // DEXTERITY: random
            // Constitution: random
            // INTELLIGENCE
            // WISDOM
            // CHARISMA
            case 'stats': 
                bot.sendMessage({
                    to: channelID,
                    message: randomize() + '\n <@' + userID + '>'
                });
         }
     }
});
function addFive(p1 ) {
    p1=parseInt(p1)
    return p1 + 5 ; 
}

//.3645
function randomize(){
    let randomNumber = Math.random();
    randomNumber = randomNumber * 10; //3.645
    if(randomNumber < 8) { //true
        randomNumber = randomNumber + 10; //13.645
    }
    randomNumber = Math.round(randomNumber); //14
    return randomNumber;
}
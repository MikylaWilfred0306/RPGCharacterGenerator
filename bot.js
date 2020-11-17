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
                    message: 'Pong!'
                });
            break;
            default: logger.info(cmd
            );
        break;
        case 'name':
                bot.sendMessage({
                    to: channelID,
                    message: user
                });
            break;
            case 'add':
            var number= addFive(args[1]); 
            bot.sendMessage({
                    to: channelID,
                    message: number
                });
            break;
            // Just add any case commands if you want to.
         }
     }
});
function addFive(p1 ) {
    p1=parseInt(p1)
    return p1 + 5 ; 
  }
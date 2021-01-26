var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var axios = require('axios');

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
                    message: user + '\n <@' + userID + '>'
                });
                break;
            case 'add':
                var number= addFive(args[1]); 
                bot.sendMessage({
                        to: channelID,
                        message: number + '\n <@' + userID + '>'
                    });
                break;
            case 'stats':
                stats(channelID, userID);
                break;
            case 'class':
                apiCall(channelID, userID, args[1]);
                break;
            case 'race':
                    apiCallDragonborn(channelID, userID, args[1]);
                break;
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


// Ability Score Function 
function calcAbility(baseStat){
    let modifier = 0;
    if(baseStat == 1){
        modifier = -5;
    }
    else if (baseStat == 2 || baseStat ==  3){
        modifier = -4;
    }
    else if (baseStat == 4 || baseStat ==  5){
        modifier = -3;
    }
    else if (baseStat == 6 || baseStat ==  7){
        modifier = -2;
    }
    else if (baseStat == 8 || baseStat ==  9){
        modifier = -1;
    }
    else if (baseStat == 10 || baseStat ==  11){
        modifier = 0;
    }    
    else if (baseStat == 12 || baseStat ==  13){
        modifier = 1;
    }    
    else if (baseStat == 14 || baseStat ==  15){
        modifier = 2;
    }
    else if (baseStat == 16 || baseStat ==  17){
        modifier = 3;
    }
    else if (baseStat == 18 || baseStat ==  19){
        modifier = 4;
    }
    else if (baseStat == 20){
        modifier = 5;
    }
    return modifier;
}

function stats(channelID, userID){
    let statsObject = {
        BaseStats: {
            Strength: randomize(),
            Dexterity: randomize(),
            Constitution: randomize(),
            Intelligence: randomize(),
            Wisdom: randomize(),
            Charisma: randomize(),
        },
        AbilityScores: {},
        Skills: {}
    }; 
    
    //AbilityScores
    statsObject.AbilityScores.Strength = calcAbility(statsObject.BaseStats.Strength);
    statsObject.AbilityScores.Dexterity = calcAbility(statsObject.BaseStats.Dexterity);
    statsObject.AbilityScores.Constitution = calcAbility(statsObject.BaseStats.Constitution);
    statsObject.AbilityScores.Intelligence = calcAbility(statsObject.BaseStats.Intelligence);
    statsObject.AbilityScores.Wisdom = calcAbility(statsObject.BaseStats.Wisdom);
    statsObject.AbilityScores.Charisma = calcAbility(statsObject.BaseStats.Charisma);

    //Skills
    statsObject.Skills.Athletics =  statsObject.AbilityScores.Strength;

    statsObject.Skills.Acrobatics =  statsObject.AbilityScores.Dexterity;
    statsObject.Skills.SleightOfHand =  statsObject.AbilityScores.Dexterity;
    statsObject.Skills.Stealth =  statsObject.AbilityScores.Dexterity;

    statsObject.Skills.Arcana =  statsObject.AbilityScores.Intelligence;
    statsObject.Skills.History =  statsObject.AbilityScores.Intelligence;
    statsObject.Skills.Investigation =  statsObject.AbilityScores.Intelligence;
    statsObject.Skills.Nature =  statsObject.AbilityScores.Intelligence;
    statsObject.Skills.Religion =  statsObject.AbilityScores.Intelligence;
    
    statsObject.Skills.AnimalHandling =  statsObject.AbilityScores.Wisdom;
    statsObject.Skills.Insight =  statsObject.AbilityScores.Wisdom;
    statsObject.Skills.Medicine =  statsObject.AbilityScores.Wisdom;
    statsObject.Skills.Perception =  statsObject.AbilityScores.Wisdom;
    statsObject.Skills.Survival =  statsObject.AbilityScores.Wisdom;
    
    statsObject.Skills.Deception =  statsObject.AbilityScores.Charisma;
    statsObject.Skills.Intimidation =  statsObject.AbilityScores.Charisma;
    statsObject.Skills.Performance =  statsObject.AbilityScores.Charisma;
    statsObject.Skills.Persuasion =  statsObject.AbilityScores.Charisma;

    bot.sendMessage({
        to: channelID,
        message: JSON.stringify(statsObject, null, 4) + '\n <@' + userID + '>'
    });
}

function apiCall(channelID, userID, className){
    axios.get('https://www.dnd5eapi.co/api/classes/' + className)
        .then(res => {
            var returnMessage = "";
            var savingThrowsInfo = res.data.saving_throws;
            var stLen = savingThrowsInfo.length;

    for (var i = 0; i < stLen; i++) {
    switch(savingThrowsInfo[i].name){
    case "DEX":
    returnMessage = returnMessage + "Dexterity, "
    break;

    case "CHA":
    returnMessage = returnMessage + "Charisma, "
    break;

    case "CON":
    returnMessage = returnMessage + "Consitution, "
    break;

    case "INT":
    returnMessage = returnMessage + "Intelligence, "
    break;

    case "STR":
    returnMessage = returnMessage + "Strength, "
    break;

    case "WIS":
    returnMessage = returnMessage + "Wisdom, "
    break;
 }
}


            bot.sendMessage({
                to: channelID,
                message: JSON.stringify(returnMessage, null, 4) + " <@" + userID + ">",
            })})}

function apiCallDragonborn(channelID, userID, raceName){
    axios.get('https://www.dnd5eapi.co/api/races/' + raceName)
        .then(res => {
            var returnMessage = "";
            var ability_bonuses = res.data.ability_bonuses;
            var stLen = ability_bonuses.length;
            for (var i = 0; i < stLen; i++) {
                returnMessage = returnMessage + ability_bonuses[i].bonus + " "
                switch(ability_bonuses[i].ability_score.name){
                    case "DEX":
    returnMessage = returnMessage + "Dexterity, "
    break;

    case "CHA":
    returnMessage = returnMessage + "Charisma, "
    break;

    case "CON":
    returnMessage = returnMessage + "Consitution, "
    break;

    case "INT":
    returnMessage = returnMessage + "Intelligence, "
    break;

    case "STR":
    returnMessage = returnMessage + "Strength, "
    break;

    case "WIS":
    returnMessage = returnMessage + "Wisdom, "
    break;
 }
}

            bot.sendMessage({
                to: channelID,
                message: JSON.stringify(returnMessage, null, 4) + " <@" + userID + ">",
            })})}   


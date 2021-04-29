var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var axios = require('axios');
var classes = {}; 
var races = {};
apiCallClasses();
apiCallRaces();

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
                var number = addFive(args[1]); 
                bot.sendMessage({
                        to: channelID,
                        message: number + '\n <@' + userID + '>'
                    });
                break;
            case 'stats':
                var classs = "";
                var race = "";
                if(args.length >= 3){
                    if(args[1].toLowerCase() == "-class") {
                        classs = args[2].toLowerCase()
                    }
                    if(args[1].toLowerCase() == "-race") {
                        race = args[2].toLowerCase()
                    }
                }
                if(args.length >= 5){
                    if(args[3].toLowerCase() == "-class") {
                        classs = args[4].toLowerCase()
                    }
                    if(args[3].toLowerCase() == "-race") {
                        race = args[4].toLowerCase()
                    }
                }
                if(classs == ""){
                    classs = classes.results[Math.floor(Math.random() * classes.count)].index;
                }
                else{
                    if (!validateClass(classs)){
                        bot.sendMessage({
                            to: channelID,
                            message: "You sent an invalid class! Please try again." + '\n <@' + userID + '>'
                        });
                        return;
                    }
                }
                if(race == ""){
                    race = races.results[Math.floor(Math.random() * races.count)].index;
                }
                else{
                    if (!validateRace(race)){
                        bot.sendMessage({
                            to: channelID,
                            message: "You sent an invalid race! Please try again." + '\n <@' + userID + '>'
                        });
                        return;
                    }
                }
                stats(channelID, userID, race ,classs);
                break;
            case 'race':
                var item = races.results[Math.floor(Math.random() * races.count)];
                bot.sendMessage({
                    to: channelID,
                    message: JSON.stringify(item.name, null, 4) + '\n <@' + userID + '>'
                });
                break;
            case 'class':
                var item = classes.results[Math.floor(Math.random() * classes.count)];
                bot.sendMessage({
                    to: channelID,
                    message: JSON.stringify(item.name, null, 4) + '\n <@' + userID + '>'
                });
                break;
            case 'diceroll':
                var item = Math.floor(Math.random() * args[1]) + 1
                bot.sendMessage({
                    to: channelID,
                    message: JSON.stringify(item, null, 4) + '\n <@' + userID + '>'
                });
                break;
            case 'help':
                if(args[1]!= null){
                    switch(args[1].toLowerCase()){
                        case '!stats':
                            bot.sendMessage({
                                to: channelID,
                                message: "```Generates stats for race and class provided. Race and/or class will be randomly generated if not provided. \n Send in !stats -[class] -[race] to generate random stats for a character. ```" + '\n <@' + userID + '>'
                            });
                            break;
                        case '!class':
                            bot.sendMessage({
                                to: channelID,
                                message: "```Sends in random class.```" + '\n <@' + userID + '>'
                            });
                            break;
                        case '!race':
                            bot.sendMessage({
                                to: channelID,
                                message: "```Sends in random race.```" + '\n <@' + userID + '>'
                            });
                            break;
                        case '!add':
                            bot.sendMessage({
                                to: channelID,
                                message: "```If any random number is sent, will add by 5. \n Example: !add 5.```" + '\n <@' + userID + '>'
                            });
                            break;
                        case '!ping':
                            bot.sendMessage({
                                to: channelID,
                                message: "```Pong!```" + '\n <@' + userID + '>'
                            });
                            break;

                    }
                }
                else{
                bot.sendMessage({
                    to: channelID,
                    message: "```send in !help ![command] for specifics on each one \n !stats \n !classes \n !races \n !add \n !ping```"
                });
                break;
                
         }}
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

function stats(channelID, userID, raceName, className){
    let statsObject = {
        Race: raceName,
        Class: className,
        BaseStats: {
            Strength: randomize(),
            Dexterity: randomize(),
            Constitution: randomize(),
            Intelligence: randomize(),
            Wisdom: randomize(),
            Charisma: randomize(),
        },
        AbilityScores: {},
        SavingThrows: {},
        Skills: {}
    }; 
    apiCallRace(channelID, userID, raceName, statsObject);
}

function apiCallClass(channelID, userID, className, statsObject){
    axios.get('https://www.dnd5eapi.co/api/classes/' + className)
        .then(res => {
            var savingThrowsInfo = res.data.saving_throws;
            var stLen = savingThrowsInfo.length;
            statsObject.SavingThrows = {...statsObject.AbilityScores};
    for (var i = 0; i < stLen; i++) {
        switch(savingThrowsInfo[i].name){
            case "DEX":
            statsObject.SavingThrows.Dexterity = statsObject.SavingThrows.Dexterity + 2 
            break; 
        
            case "CHA":
            statsObject.SavingThrows.Charisma = statsObject.SavingThrows.Charisma + 2 
            break; 
            
            case "CON":
            statsObject.SavingThrows.Constitution = statsObject.SavingThrows.Constitution + 2 
            break; 
         
        
            case "INT":
            statsObject.SavingThrows.Intelligence = statsObject.SavingThrows.Intelligence + 2 
            break; 
          
        
            case "STR":
            statsObject.SavingThrows.Strength = statsObject.SavingThrows.Strength + 2 
            break; 
          
        
            case "WIS":
            statsObject.SavingThrows.Wisdom = statsObject.SavingThrows.Wisdom + 2 
            break; 
            
         }
        
}
    bot.sendMessage({
        to: channelID,
        message: JSON.stringify(statsObject, null, 4) + " <@" + userID + ">",
})
            })}

function apiCallRace(channelID, userID, raceName, statsObject){
    axios.get('https://www.dnd5eapi.co/api/races/' + raceName)
        .then(res => {
            var ability_bonuses = res.data.ability_bonuses;
            var stLen = ability_bonuses.length;
            for (var i = 0; i < stLen; i++) {
                switch(ability_bonuses[i].ability_score.name){
                    case "DEX":
                    statsObject.BaseStats.Dexterity = statsObject.BaseStats.Dexterity + parseInt(ability_bonuses[i].bonus)
                    break; 
                
                    case "CHA":
                    statsObject.BaseStats.Charisma = statsObject.BaseStats.Charisma + parseInt(ability_bonuses[i].bonus)
                    break; 
                    
                    case "CON":
                    statsObject.BaseStats.Constitution = statsObject.BaseStats.Constitution + parseInt(ability_bonuses[i].bonus) 
                    break; 
                 
                
                    case "INT":
                    statsObject.BaseStats.Intelligence = statsObject.BaseStats.Intelligence + parseInt(ability_bonuses[i].bonus) 
                    break; 
                  
                
                    case "STR":
                    statsObject.BaseStats.Strength = statsObject.BaseStats.Strength + parseInt(ability_bonuses[i].bonus)
                    break; 
                  
                
                    case "WIS":
                    statsObject.BaseStats.Wisdom = statsObject.BaseStats.Wisdom + parseInt(ability_bonuses[i].bonus)
                    break; 
                    
                 }
                
} 
            //AbilityScores
    statsObject = calcSavingThrows(statsObject)

    //Skills
    statsObject = calcSkills(statsObject)
    apiCallClass(channelID, userID, statsObject.Class, statsObject);
    })}   

            function getBonuses(statType){
                switch(statType){
    case "DEX":
    return "Dexterity, "

    case "CHA":
    return "Charisma, "
    
    case "CON":
    return "Consitution, "
 

    case "INT":
    return "Intelligence, "
  

    case "STR":
    return  "Strength, "
  

    case "WIS":
    return "Wisdom, "
    
 }
            }

function calcSkills(statsObject){
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
    return statsObject
}

function calcSavingThrows(statsObject){
    statsObject.AbilityScores.Strength = calcAbility(statsObject.BaseStats.Strength);
    statsObject.AbilityScores.Dexterity = calcAbility(statsObject.BaseStats.Dexterity);
    statsObject.AbilityScores.Constitution = calcAbility(statsObject.BaseStats.Constitution);
    statsObject.AbilityScores.Intelligence = calcAbility(statsObject.BaseStats.Intelligence);
    statsObject.AbilityScores.Wisdom = calcAbility(statsObject.BaseStats.Wisdom);
    statsObject.AbilityScores.Charisma = calcAbility(statsObject.BaseStats.Charisma);
    return statsObject
}

function apiCallRaces(){
    axios.get('https://www.dnd5eapi.co/api/races/')
    .then(res => {
        races = res.data;
})}

function apiCallClasses(){
    axios.get('https://www.dnd5eapi.co/api/classes/')
    .then(res => {
        classes = res.data;
})}

function validateClass(className){
    var classFound = classes.results.find(classs => classs.index == className);
    if (classFound != null){return true;}
    else {return false;}
}

function validateRace(raceName){
    var raceFound = races.results.find(race => race.index == raceName);
    if (raceFound != null){return true;}
    else {return false;}
}
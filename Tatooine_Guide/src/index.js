
// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Tatooine Guide!",
            'HELP'    : "Say about, to hear more about the planet, or say people, to hear about notable locals, or say recommend an attraction, or say, go outside. ",
            'ABOUT'   : "Tatooine is a planet along the galactic outer rim. Tatooine orbits a binary star system creating a hot arid planet, but one with a rich history and colorful population.",
            'STOP'    : "Okay, see you next time!"
        }
    }
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};
var data = {
    "people":[
       {
           "name": "Owen and Beeru Lars",
           "description": "Local moisture farmers and percieved as upstanding members of the community, but found guilty of the purchase of stolen droids and harboring rebels."
       },
       {
           "name": "Jabba the Hutt",
           "description": "Head of the Hutt Clan, a supplier of key resources to the Empire in the outer rim."
       },
       {
           "name": "Anakin Skywalker",
           "description": "Famed former slave and pod racer who went on to become a Jedi before, Redacted."
       },
       {
           "name": "Old Ben Kenobi",
           "description": "A hermit and wizard who resides in the dune sea."
       }
    ],
    "attractions":[
        {
            "name": "Mos Eisly Cantina",
            "description": "Mos Eisly may be a hive of scum and villiany, but come to the cantina for the colorful locals and blue milk.",
            "distance": "0"
        },
        {
            "name": "Mos Eisly Spaceport",
            "description": "After visiting Tatooine all agree this is the place to be, in order to leave quickly.",
            "distance": "2"
        }
    ]
}

// Weather courtesy of the Yahoo Weather API.
// This free API recommends no more than 2000 calls per day

// var myAPI = {
//    host: 'query.yahooapis.com',
//    port: 443,
//    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
//    method: 'GET'
//}
;
// 2. Skill Code =======================================================================================================

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.emit(':ask', say, say);
    },

    'AboutIntent': function () {
        this.emit(':tell', this.t('ABOUT'));
    },

    'PeopleIntent': function () {
        var person = randomArrayElement(data.people);
        this.attributes['person'] = person.name;

        var say = 'On Tatooine one could come across ' + people.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'AMAZON.YesIntent': function () {
        var personName = this.attributes['person'];
        var personDetails = getPersonByName(personName);

        var say = personDetails.name
            + ', ' + personDetails.description;

        this.emit(':tell', say);

    },

    'AttractionIntent': function () {
        var distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }

        var attraction = randomArrayElement(getAttractionsByDistance(distance));

        var say = 'Try '
            + attraction.name + ', which is '
            + (attraction.distance == "0" ? 'right downtown. ' : attraction.distance + ' miles away. Have fun! ')
            + attraction.description;

        this.emit(':tell', say);
    },

    'GoOutIntent': function () {

        // getWeather( ( localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

            // this.emit(':tell', 'It is ' + localTime
                // + ' and the weather in ' + data.city
                // + ' is '
                // + currentTemp + ' and ' + currentCondition);

            // TODO
            // Decide, based on current time and weather conditions,
            // whether to go out to a local beach or park;
            // or recommend a movie theatre; or recommend staying home

        // });
        var currentTemp = 90 + Math.floor(Math.random() * 20);
        var say = "Its " + currentTemp + " in the shade and sunny with a chance of sandstorms. I don't like sand.";

        this.emit(':tell', say);
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP'));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP'));
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


function getPersonByName(personName) {

    var person = {};
    for (var i = 0; i < data.people.length; i++) {

        if(data.people[i].name == personName) {
            person = data.people[i];
        }
    }
    return person;
}

function getAttractionsByDistance(maxDistance) {

    var list = [];

    for (var i = 0; i < data.attractions.length; i++) {

        if(parseInt(data.attractions[i].distance) <= maxDistance) {
            list.push(data.attractions[i]);
        }
    }
    return list;
}

//function getWeather(callback) {
    //var https = require('https');


    //var req = https.request(myAPI, res => {
        //res.setEncoding('utf8');
        //var returnData = "";

        //res.on('data', chunk => {
            //returnData = returnData + chunk;
        //});
        //res.on('end', () => {
            //var channelObj = JSON.parse(returnData).query.results.channel;

            //var localTime = channelObj.lastBuildDate.toString();
            //localTime = localTime.substring(17, 25).trim();

            //var currentTemp = channelObj.item.condition.temp;

            //var currentCondition = channelObj.item.condition.text;

            //callback(localTime, currentTemp, currentCondition);

        //});

    //});
    //req.end();
//}
function randomArrayElement(array) {
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

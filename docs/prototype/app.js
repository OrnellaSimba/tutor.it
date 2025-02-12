var container = document.querySelector('#container');
var mainImage = document.querySelector('#js-mainImage');
var title = document.querySelector('#js-title');
var subtitle = document.querySelector('#js-subtitle');
var intro = document.querySelector('.intro');
var logo = document.querySelector('.logo');
var description = document.querySelector('#js-description');
var content = [];
var step = -1;

function getDataFromContentJson() {
    return axios.get('./content.json');
}
async function data(room) {
    const res = await
    getDataFromContentJson(room);
    return res;
}

data().then(stepArray => {
    content = stepArray.data;
    console.log(content);
});

//----------------------------------------//

const artyom = new Artyom();
startArtyom();

artyom.addCommands([{
        description: "launch tutor",
        indexes: ["start", "tutor", "hey", "hi", "hello"],
        action: function () {
            subtitle.innerHTML = "";
            var text = "Hi how can I help you ?";
            artyom.say(text);
            body = document.querySelector('body');
            body.style.backgroundColor = "white"
            intro.style.display = "none";
            logo.style.display = "none";

        }
    },
    {
        description: "get description",
        indexes: ["description", "info"],
        action: function () {
            artyom.say(content[step].description);
        }
    },
    {
        description: "launch tutor",
        indexes: ["go tutor", "tutor", "step one", "one", "1", "first"],
        action: function () {
            artyom.say(content[0].alt);
            title.innerHTML = content[0].title;
            mainImage.src = content[0].mainImage;
            description.innerHTML = content[0].description;
            step = 0;
            body = document.querySelector('body');
            body.style.backgroundColor = "white"
        }
    },
    {
        description: "Say goodbye",
        indexes: ["bye", "bye bye", "goodbye", "see you", 'buy'],
        action: function () {
            artyom.say("see you next time");
            body = document.querySelector('body');
            body.style.backgroundColor = "black"
            title.innerHTML = "";
            mainImage.src = "";
            description.innerHTML = "";

        }

    },
    {
        description: "Say goodbye",
        smart: true,
        indexes: ["step *"],
        action: function (i, wildcard) {
            if (wildcard === 'one') {
                artyom.say(content[0].alt);
                title.innerHTML = content[0].title;
                mainImage.src = content[0].mainImage;
                description.innerHTML = content[0].description;
                step = 0;
                body = document.querySelector('body');
                body.style.backgroundColor = "white"

            } else if (wildcard - 1 <= content.length - 1) {
                artyom.say(content[wildcard - 1].alt);
                title.innerHTML = content[wildcard - 1].title;
                mainImage.src = content[wildcard - 1].mainImage;
                description.innerHTML = content[wildcard - 1].description;
                step = wildcard - 1;
                body = document.querySelector('body');
                body.style.backgroundColor = "white"

            } else {
                artyom.say(`there is only ${content.length} steps`);
            }
        }

    },
    {
        description: "get Last step",
        indexes: ["last", "last step"],
        action: function () {
            artyom.say(content[content.length - 1].alt);
            title.innerHTML = content[content.length - 1].title;
            mainImage.src = content[content.length - 1].mainImage;
            description.innerHTML = content[content.length - 1].description;
            step = content.length - 1;
        }
    },
    {
        description: "Say next",
        indexes: ['next'],
        action: function () {
            if (step === (content.length - 1)) {
                artyom.say("you are already to the last step");
                return
            }
            step++;
            artyom.say(content[step].alt);
            title.innerHTML = content[step].title;
            mainImage.src = content[step].mainImage;
            description.innerHTML = content[step].description;
            body = document.querySelector('body');
            body.style.backgroundColor = "white"
            intro.style.display = "none";
            logo.style.display = "none";

        }
    },
    {
        description: "Say hey",
        indexes: ['go back'],
        action: function () {
            if (step == 0) {
                artyom.say("there is no previous step sorry");
                return
            }
            step--;
            artyom.say(content[step].alt);
            title.innerHTML = content[step].title;
            mainImage.src = content[step].mainImage;
            description.innerHTML = content[step].description;
        }
    },
    {
        description: "to repeat",
        indexes: ['repeat', 'again', "odeon"],
        action: function () {
            artyom.say(content[step].description);
        }
    }
]);


artyom.redirectRecognizedTextOutput(function (text, isFinal) {
    var span = document.getElementById('output');

    if (isFinal) {
        span.innerHTML = '';
    } else {
        span.innerHTML = text;
    }
});

function startArtyom() {
    artyom.initialize({
        lang: "en-US",
        continuous: true,
        debug: true,
        listen: true,
        speed: 0.8 // talk normally
    });
}

function stopArtyom() {
    artyom.fatality();
}
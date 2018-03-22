var container = document.querySelector('#container');
var mainImage = document.querySelector('#mainImage');
var title = document.querySelector('#title');
var description = document.querySelector('#description');
var content = [];
var step = 0;

function getDataFromContentJson() {
    return axios.get('./content.json');
}

async function data(room) {
    const res = await getDataFromContentJson(room);
    return res;
}

data().then(stepArray => {
    content = stepArray.data;
    console.log(content);
});

//----------------------------------------//

const artyom = new Artyom();
startArtyom();

artyom.addCommands([
    {
        description: "launch tutor",
        indexes: ["start", "go tutor", "tutor", "hello", "hey"],
        action: function () {
            artyom.say(content[0].description);
            title.innerHTML = content[0].title;
            mainImage.innerHTML = content[0].mainImage;
            description.innerHTML = content[0].description;
            step = 0;
        }
    },
    {
        description: "Say goodbye",
        indexes: ["bye", "bye bye", "goodbye", "see you"],
        action: function () {
            artyom.say("see you next time");
        }
    },
    {
        description: "Say goodbye",
        smart: true,
        indexes: ["step *"],
        action: function (i, wildcard) {
            if (wildcard === 'one') {
                artyom.say(content[0].description);
                title.innerHTML = content[0].title;
                mainImage.innerHTML = content[0].mainImage;
                description.innerHTML = content[0].description;
                step = 0;
            }
            else if (wildcard - 1 <= content.length - 1) {
                artyom.say(content[wildcard - 1].description);
                title.innerHTML = content[wildcard - 1].title;
                mainImage.innerHTML = content[wildcard - 1].mainImage;
                description.innerHTML = content[wildcard - 1].description;
                step = wildcard - 1;
            }
            else {
                artyom.say(`there is only ${content.length} steps`);
            }
        }

    },
    {
        description: "get Last step",
        indexes: ["last", "last step"],
        action: function () {
            artyom.say(content[content.length - 1].description);
            title.innerHTML = content[content.length - 1].title;
            mainImage.innerHTML = content[content.length - 1].mainImage;
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
            artyom.say(content[step].description);
            title.innerHTML = content[step].title;
            mainImage.innerHTML = content[step].mainImage;
            description.innerHTML = content[step].description;
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
            artyom.say(content[step].people);
            container.innerHTML = content[step].name + " " + content[step].people;
        }
    },
    {
        description: "to repeat",
        indexes: ['repeat', 'again'],
        action: function () {
            artyom.say(content[step].people);
            container.innerHTML = content[step].name + " " + content[step].people;
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
        speed: 1 // talk normally
    });
}

function stopArtyom() {
    artyom.fatality();
}
var container = document.querySelector('#container');
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

artyom.addCommands([{
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
                artyom.say(content[0].people);
                container.innerHTML = content[0].name + " " + content[0].people;
                step = 0;
            } else if (wildcard <= content.length) {
                artyom.say(content[wildcard - 1].people);
                container.innerHTML = content[wildcard - 1].name + " " + content[wildcard - 1].people;
                step = wildcard - 1;
            } else {
                artyom.say(`there is only ${content.length} steps`);
            }
        }

    },
    {
        description: "get Last step",
        indexes: ["last", "last step"],
        action: function () {
            artyom.say(content[content.length - 1].people);
            container.innerHTML = content[content.length - 1].name + " " + content[content.length - 1].people;
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
            artyom.say(content[step].people);
            container.innerHTML = content[step].name + " " + content[step].people;
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
// Set up instance of the Quintus engine.
// Supports .mp3 and .ogg audio files.
// Add in all the modules we may need using include().
// Maximise the game to the size of the browser.
// Turns on default controls and allows touch input with mouse/touch screen.
// Giving covar roomName = sessionStorage.getItem("roomName")ntrol() a parameter of true will use a joypad instead.
// Enables sound.
var Q = window.Q = Quintus({
        audioSupported: ["mp3", "ogg"],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({
        maximize: true
    })
    .controls().touch()
    .enableSound();

Q.SPRITE_PLAYER = 64;
Q.SPRITE_FLAG = 128;
Q.SPRITE_POWERUP = 256;

var actors = [];
setUpObject = {
    stage: null
};

// var socket = TEST? null : io.connect("cap-pow.herokuapp.com");
var roomName = sessionStorage.getItem("roomName")
var socket = io.connect("http://localhost:8080/game");
socket.emit("joinGame", {
    roomName: roomName
});

setUpObject.addNewPlayer = function (data) {
    // Set this players unique id
    setUpObject.selfId = socket.id;

    // Create the actual player with this unique id
    setUpObject.player = new Q.Player({
        playerId: setUpObject.selfId,
        x: 500,
        y: 400,
        socket: socket
    });

    if (setUpObject.stage) {
        // Insert this player into the stage
        setUpObject.stage.insert(setUpObject.player);

        // Add a camera  for this player
        // TODO: Change to view the whole screen? Or keep like this?
        //  Is this different for mobile/web?
        setUpObject.stage.add("viewport").follow(setUpObject.player);
    }

    setUpObject.flag.p.player = setUpObject.player;

    // Updates the players points every second if within range of flag
    setUpObject.timerId = setInterval(updatePoints, 1000);

    return setUpObject.player;
};

setUpObject.updateSpecificPlayerId = function (data) {
    var actor = actors.filter(function (obj) {
        return obj.playerId === data.playerId;
    })[0];

    if (actor) {
        actor.player.p.x = data.x;
        actor.player.p.y = data.y;
        actor.player.p.sheet = data.sheet;
        actor.player.p.update = true;
    } else {
        var temp = new Q.Actor({
            playerId: data.playerId,
            x: data.x,
            y: data.y,
            sheet: data.sheet
        });

        actors.push({
            player: temp,
            playerId: data.playerId
        });

        if (setUpObject.stage) {
            setUpObject.stage.insert(temp);
        }

        actor = temp;
    }

    return actor;
};

var UiScore = document.getElementById("score");

//Creating the stage for tmplevel
Q.scene("tmplevel", function (stage) {
    //Parallax (Background moves as player moves)
    //TODO: Not sure if parallax works with multiple players
    //TODO: Might need foldername/file for each of these assets
    stage.insert(new Game.Q.Repeater({
        asset: "../images/tmpbackground.png",
        speedX: 0.5,
        speedY: 0.5,
        //Only repeat the background horizontally
        repeatY: false
    }));

    // Create the walls of the game. Level is described by json. Blocks are
    // described by the sheet.
    stage.collisionLayer(new Q.TileLayer({
        dataAsset: "../data/tmplevel.json",
        sheet: "tmptiles"
    }));

    setUpObject.flag = new Q.Flag({
        x: 180,
        y: 530
    });

    // TODO: Will need to add the flag
    stage.insert(setUpObject.flag);

    // Set up the socket connections.
    setUp(stage);
});

var files = [
    "../images/tmptiles.png",
    "../data/tmplevel.json",
    "../images/tmpsprites.png",
    "../data/tmpsprites.json",
    "../images/tmpbackground.png"
];

// Split up the blocks and sprites from being one long PNG.
// Load the actual level and run the game.
Q.load(files.join(','), function () {
    Q.sheet("tmptiles", "../images/tmptiles.png", {
        tilew: 32,
        tileh: 32
    });

    Q.compileSheets("../images/tmpsprites.png", "../data/tmpsprites.json");
    Q.stageScene("tmplevel");
});

function updatePoints() {
    if (setUpObject.flag.p.shouldUpdatePoints) {
        setUpObject.player.p.gamePoints++;
    }
}

// setUp deals with communication over the socket
function setUp(stage) {
    setUpObject.stage = stage;

    socket.on("connected", setUpObject.addNewPlayer);
    // Updates the player (actor) w/ playerId who just asked to be updated
    socket.on("updated", setUpObject.updateSpecificPlayerId);
}

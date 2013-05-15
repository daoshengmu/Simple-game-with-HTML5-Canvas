var jewel = {
    screens : {},
	settings : {
        rows : 8,
        cols : 8,
        baseScore : 100,
        numJewelTypes : 7
    },
    images : {}
};

window.addEventListener("load", function() {

// determine jewel size
var marioProto = document.getElementById("mario-proto"),
    rect = marioProto.getBoundingClientRect();
    
var platformSize = document.getElementById("platform-proto"),
    platform = platformSize.getBoundingClientRect();

jewel.settings.marioWidth = rect.width;
jewel.settings.marioHeight = rect.height;

jewel.settings.platformWidth = platform.width;
jewel.settings.platformHeight = platform.height;

Modernizr.addTest("standalone", function() {
    return (window.navigator.standalone !== false);
});

// extend yepnope with preloading
yepnope.addPrefix("preload", function(resource) {
    resource.noexec = true;
    return resource;
});

var numPreload = 0,
    numLoaded = 0;

yepnope.addPrefix("loader", function(resource) {
    // console.log("Loading: " + resource.url)
    
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    resource.noexec = isImage;

    numPreload++;
    resource.autoCallback = function(e) {
        // console.log("Finished loading: " + resource.url)
        numLoaded++;
        if (isImage) {
            var image = new Image();
            image.src = resource.url;
            jewel.images[resource.url] = image;
        }
    };
    return resource;
});

function getLoadProgress() {
    if (numPreload > 0) {
        return numLoaded / numPreload;
    } else {
        return 0;
    }
}

// loading stage 1
Modernizr.load([
{ 
    load : [
        "scripts/sizzle.js",
        "scripts/dom.js",
        "scripts/requestAnimationFrame.js",
        "scripts/game.js"
    ]
},{
    test : Modernizr.standalone,
    yep : "scripts/screen.splash.js",
    nope : "scripts/screen.install.js",
    complete : function() {
        jewel.game.setup();
        if (Modernizr.standalone) {
            jewel.game.showScreen("splash-screen",
                getLoadProgress);
        } else {
            jewel.game.showScreen("install-screen");
        }
    }
}
]);

// loading stage 2
if (Modernizr.standalone) {
    Modernizr.load([
    {
        test : Modernizr.canvas,
        yep : "loader!scripts/display.canvas.js"//,
      //  nope : "loader!scripts/display.dom.js"
    },{
        test : Modernizr.webworkers,
        yep : [
            "loader!scripts/board.worker-interface.js",
            "preload!scripts/board.worker.js"
        ],
        nope : "loader!scripts/board.js"
    },{
        load : [
            "loader!scripts/screen.main-menu.js",
            "loader!scripts/screen.game.js",
            "loader!scripts/screen.gameover.js",
            "loader!scripts/screen.about.js",
        //    "loader!images/jewels"
         //       + jewel.settings.marioSize + ".png",
            "loader!images/angel.png"
        ]
    }
    ]);
}



}, false);

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jewel.screens["game-over"] = (function() {
    var game = jewel.game,
        dom = jewel.dom,
        storage = jewel.storage,
        $ = dom.$,      
        numScores = 10,
        firstRun = true;
    
    function setup() {      
        var scr = $("#game-over ul.menu")[0];
        
        dom.bind(scr, "click", function(e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("name");
                game.showScreen(action);
            }
        });   
               
    }
    
    function getScores() {
        return storage.get("hiscore") || [];
    }
    
    function enterScore(score) {
        var scores = getScores(),
            name, i, entry;
        for (i=0;i<=scores.length;i++) {
            if (i === scores.length || score > scores[i].score) {
                name = prompt("Please enter your name:");
                entry = {
                    name : name,
                    score : score
                };
                scores.splice(i, 0, entry);
                storage.set(
                    "hiscore", scores.slice(0, numScores)
                );
               
                return;
            }
        }
    }
    
    function showPoints( points )
    {
         $("#game-over .score span")[0].innerHTML      
            = points;
          
          enterScore( points );
    }
        
    function run( points ) {           
        
        if ( firstRun ) {
            setup();
            firstRun = false;
        }
        
        showPoints( points );
    }    
    
    return {
        run : run    
    };
})();
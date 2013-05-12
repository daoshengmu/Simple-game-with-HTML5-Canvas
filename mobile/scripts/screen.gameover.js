/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jewel.screens["game-over"] = (function() {
    var game = jewel.game,
        dom = jewel.dom,
        $ = dom.$,      
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
    
    function showPoints( points )
    {
         $("#game-over .score span")[0].innerHTML      
            = points;
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
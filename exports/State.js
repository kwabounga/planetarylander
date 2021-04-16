/** pattern Singleton */
const State = (function () {
    var instance;
    /**
     * createInstance
     * @returns {object} public methods of the instance
     */
    function createInstance() {
        // definition
        this.width = 800;
        this.height = 600;
        this.isMobile = Tools.isMobile();
        this.isPause = false;
        this.isDebug = false;

        this.keyUp;
        this.keyLeft;
        this.keyRight;
        this.keySpace;
        this.menuData = undefined;
        this.game = {
            currentLevel:0,
            speedX:0,
            speedY:0,
            orientation:0,
            fuelMax:500,
            fuel:500,
            shell:100,
            power:0
        }
        this.log = function(...arg){
            if(instance.isDebug){
                console.log(...arg)
            }
        }
        // public elements
        return {
            width: this.width,
            height: this.height,
            isMobile: this.isMobile,            
            isPause: this.isPause,            
            isDebug: this.isDebug,            
            keyUp: this.keyUp,            
            keyLeft: this.keyLeft,            
            keyRight: this.keyRight,            
            keySpace: this.keySpace,            
            game: this.game,            
            menuData: this.menuData,            
            log: this.log,            
        };
    }
    
    return {
        /**
         * 
         * @returns the instance of the State object
         */
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
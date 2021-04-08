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


        
       
        // public elements
        return {
            width: this.width,
            height: this.height,
            isMobile: this.isMobile,            
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
/**
 * Apply rules forces on lander 
 */

var RulesSetter = RulesSetter || {};

RulesSetter.set = function(lander, rule){
  switch (rule.type) {
    case 'dust_devils':
        RulesSetter.getDustDevils(lander, rule);
      break;
    case 'wind':
        RulesSetter.getWind(lander, rule);
      break;
  
    default:

      break;
  }
}

// Dust Devils Rules 
RulesSetter.getDustDevils = function(lander, rule) {
  console.log('RulesSetter type DUST DEVILS', rule)

}
// Wind Rules 
RulesSetter.getWind = function(lander, rule) {
  console.log('RulesSetter type WIND', rule)

}
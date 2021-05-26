/**
 * Apply rules forces on lander 
 */

var RulesSetter = RulesSetter || {};

RulesSetter.set = function(lander, rule){
  switch (rule.type) {
    case 'dust_devils':
        RulesSetter.getDustDevils(lander, rule);
      break;
  
    default:

      break;
  }
}

// Mars Rules 
RulesSetter.getDustDevils = function(lander, rule) {
  console.log('RulesSetter type DUST DEVILS', rule)

}
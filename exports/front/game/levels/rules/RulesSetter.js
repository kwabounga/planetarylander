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
  // console.log('RulesSetter type DUST DEVILS', rule)
  Matter.Body.applyForce(
    lander.body,
    { x: lander.body.position.x, y: lander.body.position.y },
    { x: (Tools.rb()?rule.params.force:-rule.params.force), y: Tools.randomBetween(-10,10) }
  );

}
// Wind Rules 
RulesSetter.getWind = function(lander, rule) {
  // console.log('RulesSetter type WIND', rule)

}
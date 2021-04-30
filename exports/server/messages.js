
const success = {
  SUCCESS: 'success',
  BDD_USER_CREATED: 'BDD: Utilisateur enregistré',
  BDD_USER_DELETED: 'BDD: Utilisateur supprimé',
  BDD_USER_LOGGED: 'BDD: Utilisateur connecté avec succes',
  BDD_PROGRESS_SAVED: 'BDD: Progression sauvegardée',
  ROUTING_ROUTE_FOUNDED: 'Routing: Route trouvé',
}
const errors = {
  FATAL: 'fatal error',
  UNDEFINED: 'undefined error',
  BDD_USER_DOES_NOT_EXIST: 'BDD: l\'utilisateur n\'existe pas',
  BDD_USER_WRONG_PASSWORD: 'BDD: mot de passe incorrect',
  BDD_USER_ALREADY_EXIST: 'BDD: l\'utilisateur existe déjà',
  ROUTING_ROUTE_DOES_NOT_EXIST: 'Routing: la route n\'existe pas',
}
module.exports = {
  SUCCESS: success,
  ERRORS: errors,
}

//http://stackoverflow.com/a/21984136

exports.calculateAge = function(birthday) { // birthday is a date
  //check if the birthday is null
  if(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  return '';

}

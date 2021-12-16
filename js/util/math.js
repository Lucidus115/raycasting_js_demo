// Util functions for small math related operations

function degreeToRad(degree) {
  return (degree * Math.PI) / 180;
}

function radToDegree(radian) {
  return (radian * 180) / Math.PI
}

/*
JavaScript allows rounding a decimal to a certain place with the toFixed() method.
This returns a string that can be converted to a number. This method is expensive
when calling too often and slows the program down. An alternate way to do
it was found here: 
https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
*/
function roundDecimal(float, placeValue) {
  const place = Math.pow(10, placeValue);

  return Math.round((float * place)) / place;
}

function generate(number){
  var pointsArray = [];
  for (var i = 0; i < number; i++) {
    pointsArray.push({
      id: i,
      x: Math.floor(Math.random()*.85*scale + .05*scale),
      y: Math.floor(Math.random()*.85*scale + .05*scale)
    })
  }
  return {
    pointsArray,
    pointsNumber: number
  };
}

async function dataLoader(path,type) {
  const response = await fetch("https://cors-anywhere.herokuapp.com/" + path);
  const text = await response.text();
  return manageText(text,type);
}

function manageText(text,type) {
  if (type == 1){
    var pointsArray = text.split("\n").slice(6).slice(0,-3);
  } else {
    var pointsArray = text.split("\n").slice(1).slice(0,-1);
  }
  pointsArray.forEach((element, key) => {
    tempArr = element.split(" ").filter((el)=> el != "");
    pointsArray[key] = {
      id: tempArr[0],
      x: tempArr[1],
      y: tempArr[2]
    };
  });
  var pointsNumber = pointsArray.length;
  return {
    pointsArray,
    pointsNumber
  };
}

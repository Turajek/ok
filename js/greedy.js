var distance;
function greedy(data) {
  console.log(data);
  distance = 0;
  var points = data.pointsArray;
  var blackList = [points[0].id];
  var nextPoint = {
    result: {},
    point: points[0]
  };
  var path = [];
  points.forEach((element, key) => {
    if (key < data.pointsNumber - 1) {
      var arr = points.filter(el => el.id != nextPoint.result.id);
      path.push(nextPoint.point);
      drawPoint(nextPoint.point);
      nextPoint = findClosest(nextPoint.point, arr, blackList);
    } else {
      path.push(path[0]);
      drawPoint(nextPoint.point);
      drawLine(nextPoint.point, path[0]);
    }
  });
  document.querySelector('.result').innerHTML = distance.toLocaleString('pl');
  console.log("greedy: " + distance);
}

function findClosest(pointA, pointsArr, blackList) {
  var resultsArray = [];
  var values = [];
  pointsArr.forEach((element, key) => {
    if (!blackList.includes(element.id)) {
      var val = calculateDistance(pointA, element);
      resultsArray.push({ id: element.id, val });
      values.push(val);
    }
  });
  var min = Math.min(...values);
  distance += min;
  var result = resultsArray.find(el => el.val == min);
  var point = pointsArr.find(el => el.id == result.id);
  drawLine(pointA, point);
  blackList.push(result.id);
  return {
    result,
    point
  };
}

function calculateDistance(pointA, pointB) {
  var a = Math.abs(pointA.x - pointB.x);
  var b = Math.abs(pointA.y - pointB.y);
  return Math.sqrt(a * a + b * b);
}

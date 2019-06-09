var switcher = false;
var algBtns = document.querySelectorAll('.btn2');
function toggleSwitcher(bool) {
  switcher = bool;
  algBtns.forEach(btn => {
    btn.classList.toggle("active")
  });
}

var genBtn = document.querySelector('#generate');
genBtn.addEventListener('click', function () {
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
  var points = document.querySelector('#pointsNumber').value;
  var data = generate(points);
  if (switcher) {
    greedy(data);
  } else {
    var params = {
      gain: document.querySelector('#gain').value,
      alpha: document.querySelector('#alpha').value
    }
    neuronal = new TravelingSalesman(data, params)
    neuronal.start()
  }
})

var loadBtns = document.querySelectorAll('.url');

loadBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    scale = btn.dataset.scale;
    var url = btn.dataset.url;
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    dataLoader(url, btn.dataset.type).then(response => {
      if (switcher) {
        greedy(response);
      } else {
        var params = {
          gain: document.querySelector('#gain').value,
          alpha: document.querySelector('#alpha').value
        }
        neuronal = new TravelingSalesman(response, params)
        neuronal.start()
      }

    }

    );
  })
})


function Node(x, y) {
    this.x = x;
    this.y = y;
    this.right = this;
    this.left = this;
    this.life = 3;
    this.inhibitation = 0;
    this.isWinner = 0;
}

/* dystans pomiedzy nodem a punktem*/
Node.prototype.potential = function (sample) {
    return (sample.x - this.x) * (sample.x - this.x) + (sample.y - this.y) * (sample.y - this.y);
};

/* przesuwa pojedynczy neuron w strone punktu/miasta */
Node.prototype.move = function (city, value) {
    this.x += value * (city.x - this.x);
    this.y += value * (city.y - this.y);
};

/* dystans pomiedzy dwoma neuronami */
Node.prototype.distance = function (other, length) {
    var right = 0;
    var left = 0;
    var current = other;

    while (current != this) {
        current = current.left;
        left++;
    }
    right = length - left;
    return (left < right) ? left : right;
};

/* ring/ pierscien jako siec neuronowa */
function Ring(start) {
    this.start = start;
    this.length = 1;
}

/* przesun wszystkie wezly w kierunku miasta */
Ring.prototype.moveAllNodes = function (city, gain) {
    var current = this.start;
    var best = this.findMinimum(city);

    for (var i = 0; i < this.length; i++) {
        current.move(city, this.f(gain, best.distance(current, this.length)));
        current = current.right;
    }
};

/* znalezienie wezla z najmniejsza odlegloscia od miasta */
Ring.prototype.findMinimum = function (city) {
    var actual;
    var node = this.start;
    var best = node;
    var min = node.potential(city);
    for (var i = 1; i < this.length; i++) {
        node = node.right;
        actual = node.potential(city);
        if (actual < min) {
            min = actual;
            best = node;
        }
    }
    best.isWinner++;
    return best;
};

/* usuniecie wezla*/
Ring.prototype.deleteNode = function (node) {
    var previous = node.left;
    var next = node.right;

    if (previous != null) {
        previous.right = next;
    }
    if (next != null) {
        next.left = previous;
    }
    if (next == node) {
        next = null;
    }
    if (this.start == node) {
        this.start = next;
    }
    this.length--;
};

/* duplikacja wezla */
Ring.prototype.duplicateNode = function (node) {
    var newNode = new Node(node.x, node.y);
    var next = node.left;
    next.right = newNode;
    node.left = newNode;
    node.inhibitation = 1;
    newNode.left = next;
    newNode.right = node;
    newNode.inhibitation = 1;
    this.length++;
};

/* dlugosc pierscienia  */
Ring.prototype.tourLength = function () {
    var dist = 0.0;
    var current = this.start;
    var previous = current.left;

    for (var i = 0; i < this.length; i++) {
        dist += Math.sqrt(
            (current.x - previous.x) * (current.x - previous.x) +
            (current.y - previous.y) * (current.y - previous.y));
        current = previous;
        previous = previous.left;
    }
    return dist;
};

Ring.prototype.f = function (gain, n) {
    return (0.70710678 * Math.exp(-(n * n) / (gain * gain)));
};


function TravelingSalesman(data, params) {
    this.N = data.pointsNumber; /* ilosc miast. */
    this.cities = data.pointsArray; /* miasta */
    this.cycle = 0; /* ilosc powtorzen */
    this.maxCycles = 10000; /* maksymalna ilosc powtorzen */
    this.neurons = null; /* neurony */
    this.alpha = params.alpha || 0.05; /* learning rate */
    this.gain = params.gain || 50.0 /* gain */
    this.lastLength = null; /* dlugosc trasy */
    this.isRunning = false;
    this.update = 5;
}

/* tworzy ring i pierwszy wezel */
TravelingSalesman.prototype.createFirstNeuron = function () {
    var start = new Node(0.5, 0.5);
    this.neurons = new Ring(start);
};

/*obsluga warstwy wizualnej */
TravelingSalesman.prototype.draw = function () {
    console.log("TSP: N= " + this.N + ", cycle=" + this.cycle + ", lastLength=" + this.lastLength);
    this.cities.forEach((point, index) => {
        drawPoint(point);
        if (index < this.N - 1) {
            drawLine(point, this.cities[index + 1]);
        } else {
            drawLine(point, this.cities[0])
        }
    })
    document.querySelector('.result').innerHTML = this.lastLength.toLocaleString('pl');

};


TravelingSalesman.prototype.start = function () {
    this.init();
    this.isRunning = true;
    this.run();
};

TravelingSalesman.prototype.init = function () {
    this.cycle = 0;
    this.lastLength = null;
    this.createFirstNeuron();
};

TravelingSalesman.prototype.run = function () {
    if (this.neurons != null) {
        if (this.cycle < this.maxCycles && this.isRunning) {
            var done = this.surveyRun();
            // console.log(this.cycle);
            if (!done) {
                var self = this;
                window.setInterval(function () { self.run(); }, 100);
                return;
            }
        }
        if (this.isRunning) {
            this.draw();
            this.isRunning = false;
        }
    }
};

/* jedno powtorzenie */
TravelingSalesman.prototype.surveyRun = function () {
    var done = false;
    if (this.neurons != null) {
        for (var i = 0; i < this.cities.length; i++) {
            this.neurons.moveAllNodes(this.cities[i], this.gain);
        }
    }
    this.surveyFinish();
    this.gain = this.gain * (1 - this.alpha);
    if (this.cycle++ % this.update == 0) {
        var length = this.neurons.tourLength();
        if (length == this.lastLength) {
            done = true;
        } else {
            this.lastLength = length;
        }
    }
    return done;
};

/* duplikowanie/ usuwanie neuronow na koniec kazdego powtorzenia */
TravelingSalesman.prototype.surveyFinish = function () {
    if (this.neurons == null) {
        return;
    }
    var node = this.neurons.start;
    for (var i = 0; i < this.neurons.length; i++) {
        node.inhibitation = 0;
        switch (node.isWinner) {
            case 0:
                node.life--;
                if (node.life == 0) {
                    this.neurons.deleteNode(node);
                }
                break;
            case 1:
                node.life = 3;
                break;
            default:
                node.life = 3;
                this.neurons.duplicateNode(node);
                break;
        }
        node.isWinner = 0;
        node = node.right;
    }
};


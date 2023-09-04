var arrCP = [];
var workerCode = `
    function delayedFunction(cpText) {
        console.log("Delayed function executed!");
        var cp = parseFloat(cpText.replace(/[^\d.-]/g, ''));
        postMessage({ type: 'cpData', cp: cp });
    }

    function delayedFunction2() {
        console.log("Delayed function 2 executed!");
        postMessage({ type: 'logData' });
    }

    onmessage = function (e) {
        if (e.data.type === 'executeDelayedFunction') {
            delayedFunction(e.data.cpText);
        } else if (e.data.type === 'executeDelayedFunction2') {
            delayedFunction2();
        }
    }
`;

// Create a Blob with the worker code
var blob = new Blob([workerCode], { type: 'application/javascript' });

// Create a Blob URL for the worker
var workerURL = URL.createObjectURL(blob);

var worker = new Worker(workerURL);

worker.onmessage = function (e) {
    if (e.data.type === 'cpData') {
        arrCP.push(e.data.cp);
    } else if (e.data.type === 'logData') {
        console.log("arrCP", arrCP);
    }
};

// Send messages to the web worker at regular intervals
setInterval(function () {
    var lastPriceElements = document.querySelectorAll('.last-price');
    var cpText = lastPriceElements[2].textContent;
    worker.postMessage({ type: 'executeDelayedFunction', cpText: cpText });
}, 1000);

setInterval(function () {
    worker.postMessage({ type: 'executeDelayedFunction2' });
}, 100000);

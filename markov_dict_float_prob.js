
inlets = 2;
outlets = 1;

setinletassist(0, "bang advances sequence; int sets next starting point");
setinletassist(1, "set ruleset dict by name (message)");

var startingStep = 0;

var ruleSet = new Dict("rules");

function applyRules(prevStep) {
    var r = Math.random();
    var p = 0;
    var rules = ruleSet.get(prevStep);
    
    // If there are no following values, leave the step as-is.
    if (!rules) {
        return prevStep;
    }
    
    // Choose the production rule with the appropriate probability
    for (var i=0; i<rules.length; i++) {
        p += rules[i].get("prob");
        if (r < p) {
            return rules[i].get("to");
        }
    }
    
    // If something is amiss with the probabilities, fall back to the last rule listed
    return rules[rules.length - 1].get("to");
}

function bang() {
    outlet(0, startingStep);
    var holdStep = startingStep;
    startingStep = applyRules(holdStep);
}

function msg_int(intMsg) {
    if (inlet == 0) {
        startingStep = intMsg;
    }
}

function anything() {
    if (inlet == 1) {
        ruleSet.name = messagename;
    }
}
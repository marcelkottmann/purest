function render(baseElement, directive) {
    for(var prop in directive) {
        console.log(prop);
        if(directive.hasOwnProperty(prop)) {
            console.log("-> hasOwnProperty");
            var append = false;
            var selector = prop;
            if(selector.charAt(selector.length - 1) === '+') {
                append = true;
                selector = selector.substr(0, selector.length - 1);
            }
            var criteria = selector.split('@');
            var sel = criteria[0];
            var attributeSel;
            if(criteria.length > 1) {
                attributeSel = criteria[1];
            }
            var element = sel === '.' ? baseElement : baseElement.querySelector(sel);
            var rule = directive[prop];
            console.log("found element: ");
            console.log(element);
            console.log("attribute selector: " + attributeSel);
            if(typeof rule === 'undefined') {
                console.log("UNDEFINED RULE");
                alert('undefined');
            } else {
                if(typeof rule === 'string') {
                    console.log("rule is of type string2: " + rule);
                    var value = directive[prop];
                    if(typeof attributeSel === 'undefined') {
                        if(append) {
                            element.innerHTML += value;
                        } else {
                            element.innerHTML = value;
                        }
                    } else {
                        if(append) {
                            element.attributes[attributeSel].textContent += value;
                        } else {
                            element.attributes[attributeSel].textContent = value;
                        }
                    }
                } else {
                    if(typeof rule === 'object') {
                        console.log("rule is of type object");
                        var items = rule.items;
                        var eachFunc = rule.each;
                        var ppar = element.parentNode;
                        ppar.removeChild(element);
                        for(var i = 0; i < items.length; i++) {
                            var templateNode = element.cloneNode(true);
                            render(templateNode, eachFunc(items[i]));
                            ppar.appendChild(templateNode);
                        }
                    }
                }
            }
        }
    }
}
function renderPage(selector, directive) {
    var templateNode = document.querySelector(selector);
    var resultNode = templateNode.cloneNode(true);
    render(resultNode, directive);
    templateNode.parentNode.replaceChild(resultNode, templateNode);
}

var PUREST;
(function (PUREST) {
    function createSelector(prop) {
        var domSelector = '';
        var attributeSelector;
        var textSearch;
        var append = false;
        var search = /([^{}\+@]*)@?([^{}\+]*)(\+|{.*})?/;
        var result = search.exec(prop);
        if(result.length > 0) {
            domSelector = result[1];
            attributeSelector = result[2];
            if(result[3] === '+') {
                append = true;
            } else {
                if(result[3] !== '') {
                    textSearch = result[3];
                }
            }
        } else {
            alert("invalid selector: '" + prop + "'");
        }
        return {
            domSelector: domSelector,
            attributeSelector: attributeSelector,
            textSearch: textSearch,
            append: append
        };
    }
    function findElement(baseElement, domSelector) {
        return domSelector === '' ? baseElement : baseElement.querySelector(domSelector);
    }
    function removeOthersToo(baseElement, domSelector) {
        do {
            var element = findElement(baseElement, domSelector);
            if(element != null) {
                element.parentNode.removeChild(element);
            }
        }while(element != null)
    }
    function logSelector(selector) {
        console.log("selector: ");
        console.log(selector.domSelector);
        console.log("attribute selector: ");
        console.log(selector.attributeSelector);
        console.log("text search: ");
        console.log(selector.textSearch);
        console.log("append: ");
        console.log(selector.append);
    }
    function handleUndefinedRule(baseElement, element, selector) {
        var ppar = element.parentNode;
        ppar.removeChild(element);
        removeOthersToo(baseElement, selector.domSelector);
    }
    function handleLoopRule(baseElement, element, selector, rule) {
        var items = rule.items;
        var eachFunc = rule.each;
        var itemsEmpty = (typeof items === 'undefined') || (items.length == 0);
        console.log("itemsEmpty: " + itemsEmpty);
        if(!itemsEmpty && (typeof eachFunc !== 'undefined')) {
            var ppar = element.parentNode;
            ppar.removeChild(element);
            removeOthersToo(baseElement, selector.domSelector);
            for(var i = 0; i < items.length; i++) {
                var templateNode = element.cloneNode(true);
                renderApply(templateNode, eachFunc(items[i], {
                    index: i,
                    length: items.length
                }));
                ppar.appendChild(templateNode);
            }
        } else {
            if(itemsEmpty && (typeof rule.alt === 'undefined')) {
                var ppar = element.parentNode;
                ppar.removeChild(element);
                removeOthersToo(baseElement, selector.domSelector);
            } else {
                if(itemsEmpty && (typeof rule.alt !== 'undefined')) {
                    renderApply(element, rule.alt);
                }
            }
        }
    }
    function handleIncludeRule(baseElement, element, selector, rule) {
        var includeNode = document.querySelector(rule.include);
        var templateNode = includeNode.cloneNode(true);
        for(var i = element.childNodes.length - 1; i >= 0; --i) {
            element.removeChild(element.childNodes[i]);
        }
        element.appendChild(templateNode);
        renderApply(templateNode, rule.directive);
    }
    function handleObjectRule(baseElement, element, selector, rule) {
        console.log("rule is of type object");
        if(rule.hasOwnProperty("items")) {
            handleLoopRule(baseElement, element, selector, rule);
        } else {
            if(rule.hasOwnProperty("include")) {
                handleIncludeRule(baseElement, element, selector, rule);
            } else {
                alert("unknown rule type: " + rule);
            }
        }
    }
    function handlePrimitiveTypeRule(baseElement, element, selector, rule) {
        console.log("rule is of type primitive type: " + rule);
        if(selector.attributeSelector === '') {
            if(selector.append) {
                element.innerHTML += rule;
            } else {
                if(typeof selector.textSearch !== 'undefined') {
                    element.innerHTML = element.innerHTML.replace(selector.textSearch, rule);
                } else {
                    element.innerHTML = rule;
                }
            }
        } else {
            if(selector.append) {
                element.attributes[selector.attributeSelector].textContent += rule;
            } else {
                if(typeof selector.textSearch !== 'undefined') {
                    element.attributes[selector.attributeSelector].textContent = element.attributes[selector.attributeSelector].textContent.replace(selector.textSearch, rule);
                } else {
                    element.attributes[selector.attributeSelector].textContent = rule;
                }
            }
        }
    }
    function renderApply(baseElement, directive) {
        if(typeof directive === 'string') {
            directive = {
                '': directive
            };
        }
        for(var prop in directive) {
            console.log('Processing property: ' + prop);
            if(directive.hasOwnProperty(prop)) {
                console.log("-> hasOwnProperty");
                var selector = createSelector(prop);
                logSelector(selector);
                var element = findElement(baseElement, selector.domSelector);
                var rule = directive[prop];
                console.log("found element: ");
                console.log(element);
                if(element != null) {
                    if(typeof rule === 'undefined') {
                        handleUndefinedRule(baseElement, element, selector);
                    } else {
                        if(typeof rule === 'object') {
                            handleObjectRule(baseElement, element, selector, rule);
                        } else {
                            handlePrimitiveTypeRule(baseElement, element, selector, rule);
                        }
                    }
                }
            }
        }
    }
    PUREST.renderApply = renderApply;
    function render(selector, directive, target) {
        var templateNode = document.querySelector(selector);
        var resultNode = templateNode.cloneNode(true);
        renderApply(resultNode, directive);
        var parentNode = templateNode.parentNode;
        if(typeof target === 'undefined') {
            parentNode.replaceChild(resultNode, templateNode);
        } else {
            var targetNode = document.querySelector(target);
            if(targetNode != null) {
                parentNode.removeChild(templateNode);
                targetNode.appendChild(resultNode);
            }
        }
    }
    PUREST.render = render;
})(PUREST || (PUREST = {}));


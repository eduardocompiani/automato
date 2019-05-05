var steps = {};
var dicionario = {};
var automato = [];
var automatoStart = false;
var automatoEnd = [];
var hashes = [];
var executionTree = false;
var executionPath = [];

function addStep()
{
    const stepEl = document.getElementById('step');
    const stepListEl = document.getElementById('stepList');

    if (stepEl.value.trim() !== ''
        && !steps[stepEl.value.trim()]
    ) {
        steps[stepEl.value.trim()] = stepEl.value.trim();

        stepListEl.appendChild(
            createListItem(
                stepEl.value.trim(),
                'removeStep(this, \'' + stepEl.value.trim() + '\')'
                )
        );

        document.getElementById('stepListLabel').style.display = 'block';
    }

    stepEl.value = "";
    stepEl.focus();
}

function removeStep(el, step)
{
    delete steps[step];
    el.parentElement.parentElement.remove();

    if (Object.keys(steps).length == 0) {
        document.getElementById('stepListLabel').style.display = 'none';
    }
}

function addDicionario()
{
    const dicionarioEl = document.getElementById('dicionario');
    const dicionarioListEl = document.getElementById('dicionarioList');

    if (dicionarioEl.value.trim() !== ''
        && !dicionario[dicionarioEl.value.trim()]
    ) {
        dicionario[dicionarioEl.value.trim()] = dicionarioEl.value.trim();

        dicionarioListEl.appendChild(
            createListItem(
                dicionarioEl.value.trim(),
                'removeStep(this, \'' + dicionarioEl.value.trim() + '\')'
                )
        );

        document.getElementById('dicionarioListLabel').style.display = 'block';
    }

    dicionarioEl.value = "";
    dicionarioEl.focus();
}

function removeDicionario(el, step)
{
    delete dicionario[step];
    el.parentElement.parentElement.remove();

    if (Object.keys(dicionario).length == 0) {
        document.getElementById('dicionarioListLabel').style.display = 'none';
    }
}

function createListItem(value, onclick)
{
    const a = document.createElement('a');
    a.classList.add("list-group-item", "clearfix");

    const span = document.createElement('span');
    span.classList.add("espaco-entre");

    const label = document.createElement('label')
    label.classList.add("espaco-entre");

    const stepName = document.createTextNode(value);

    const button = document.createElement('button');
    button.classList.add("btn", "btn-outline-dark");
    button.setAttribute('onclick', onclick);

    const i = document.createElement('i');
    i.classList.add("fas", "fa-trash");

    button.appendChild(i);
    label.appendChild(stepName);
    span.appendChild(label);
    span.appendChild(button);
    a.appendChild(span);

    return a;
}

function loadConfigStep()
{
    createStepTable();
    createStartEndTable();
}

function createStepTable()
{
    const header = document.querySelector('#tableSteps > thead > tr');
    const body = document.querySelector('#tableSteps > tbody');

    header.appendChild(
        createTableHeader('col', '')
    );

    Object.keys(steps).forEach(function (step) {
        header.appendChild(
            createTableHeader('col', step)
        );
    });

    Object.keys(dicionario).forEach(function (alfabeto) {
        const tableRow = document.createElement('tr');

        tableRow.appendChild(
            createTableHeader('row', alfabeto)
        )

        Object.keys(steps).forEach(function (step) {
            tableRow.appendChild(
                createTableCell()
            );
        });

        body.appendChild(tableRow);
    })

}

function createTableHeader(scope, value)
{
    const tableHeader = document.createElement('th');
    tableHeader.setAttribute('scope', scope);

    const text = document.createTextNode(value);

    tableHeader.appendChild(text);

    return tableHeader;
}

function createTableCell()
{
    const tabelCell = document.createElement('td');
    tabelCell.setAttribute('contenteditable', true);

    return tabelCell;
}

function createStartEndTable() {
    const createRadio = function (step) {
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'radioStartEnd');
        radio.setAttribute('id', 'radio-' + step);
        radio.setAttribute('value', step);

        return radio;
    }

    const createCheckbox = function (step) {
        const radio = document.createElement('input');
        radio.setAttribute('type', 'checkbox');
        radio.setAttribute('name', 'checkboxStartEnd');
        radio.setAttribute('id', 'checkbox-' + step);
        radio.setAttribute('value', step);

        return radio;
    }

    const body = document.querySelector('#tableStartEnd > tbody');

    Object.keys(steps).forEach(function (step) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');

        const thText = document.createTextNode(step);

        const tdRadio = document.createElement('td');
        tdRadio.appendChild(
            createRadio(step)
        );

        const tdCheckbox = document.createElement('td');
        tdCheckbox.appendChild(
            createCheckbox(step)
        );

        th.appendChild(thText);
        tr.appendChild(th);
        tr.appendChild(tdRadio);
        tr.appendChild(tdCheckbox);
        body.appendChild(tr);
    })
}

function configureAutomato()
{
    // automato = [
    //     {
    //         step: "",
    //         receive: "",
    //         destination: ["", ""]
    //     }
    // ];

    automato = [];

    const stepIndexer = Object.keys(steps);
    const dicionarioIndexer = Object.keys(dicionario);
    document
        .querySelectorAll('#tableSteps > tbody > tr')
        .forEach(
            function (rowEl, rowIndex) {
                rowEl
                    .childNodes
                    .forEach(
                        function (columnEl, columnIndex) {
                            if (rowEl.firstChild !== columnEl) {
                                var destination = columnEl.innerText.split(",");

                                destination
                                    .filter(
                                        function (dest) {
                                            if (dest.trim() !== "") {
                                                return dest.trim();
                                            }
                                        }
                                    );

                                if (destination.length == 0) {
                                    destination.push(stepIndexer[columnIndex -1]);
                                }
                                
                                automato.push({
                                    step: stepIndexer[columnIndex -1],
                                    receive: dicionarioIndexer[rowIndex],
                                    destination: destination
                                });
                            }
                        }
                    )
            }
        );

       automatoStart = document.querySelector('input[type=radio][name=radioStartEnd]:checked').value;
       
       document
            .querySelectorAll('input[type=checkbox][name=checkboxStartEnd]:checked')
            .forEach(
                function (el) {
                    automatoEnd.push(el.value.trim());
                }
            );
}

function createAutomatoVizualization()
{
    const line = [];

    line.push('digraph {');
    line.push('rankdir=LR;');
    line.push('node [shape = point, color=white, fontcolor=white]; start;');

    Object.keys(steps).forEach(function (step) {
        if (automatoEnd.indexOf(step) == -1) {
            line.push(`node [shape = circle, color=black, fontcolor=black]; ${step.trim()};`);
        } else {
            line.push(`node [shape = doublecircle, color=black, fontcolor=black]; ${step.trim()};`);
        }
    });

    line.push(`start -> ${automatoStart};`);

    automato.forEach(function (path) {
        path.destination.forEach(function (destination) {
            if (destination !== "") {
                line.push(`${path.step.trim()} -> ${destination.trim()} [ label = "${path.receive.trim()}" ];`);
            }
        });
    });

    line.push('}');

    d3.select('#automato').graphviz().fade(false).renderDot(line.join('\n'));
}

function loadSimulador()
{
    configureAutomato();
    createAutomatoVizualization();
}

function simular()
{
    var line = [];
    executionPath = [];

    const invalidInput = document
        .getElementById('entrada')
        .value
        .split(',')
        .filter(function (input) {
            return Object.keys(dicionario).indexOf(input) == -1;
        });
    
    if (invalidInput.length) {
        alert('Sua entrada possui os seguintes valores invalidos: \n'.invalidInput.join('\n'));
        return false;
    }

    const entrada = document
        .getElementById('entrada')
        .value
        .split(',')
        .map(
            function (val) {
                return {
                    hash: makeHash(10),
                    value: val
                };
            }
        );
    
    executionTree = createNode(automatoStart, '');
    
    entrada.forEach(function (val) {
        runValueOnLeaves(executionTree, val.value.trim());
    });
    

    
    line.push('digraph G {');

    line.push('subgraph cluster_0 {');
    entrada.forEach(function (val) {
        line.push(`node [shape = circle, color=black, fontcolor=black, label = "${val.value.trim()}"]; ${val.hash};`);
    });
    entrada.forEach(function (val ,index) {
        if (entrada[index + 1]) {
            line.push(`${val.hash} -> ${entrada[index + 1].hash};`);
        }
    });
    line.push('label = "Valor lido";');
    line.push('}');

    line.push('subgraph cluster_1 {');
    line = line.concat(executionPath);
    line.push('label = "Arvore de execução";');
    line.push('}');

    line.push('}');
    
    d3.select('#execucao').graphviz().fade(false).renderDot(line.join('\n'));

    const pass = getLeavesOfTree(executionTree).some(
        function (leaf) {
            return automatoEnd.indexOf(leaf) != -1;
        }
    );

    if (pass) {
        document.getElementById('resultado').innerHTML = "A entrada foi aceita";
        document.getElementById('resultado').setAttribute('class', 'alert alert-success');
    } else {
        document.getElementById('resultado').innerHTML = "A entrada não foi aceita";
        document.getElementById('resultado').setAttribute('class', 'alert alert-danger');
    }
}

function makeHash(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (hashes.indexOf(result) != -1) {
        return makeHash(length);
    }
    
    hashes.push(result);

    return result;
}

function createNode(value, parent)
{
    const newHash = makeHash(10)

    if (parent) {
        executionPath.push(`node [shape = circle, color=black, fontcolor=black, label = "${value.trim()}"]; ${newHash};`);
        executionPath.push(`${parent} -> ${newHash};`);
    }

    return {
        hash: newHash,
        value: value,
        parent: parent
    }
}

function runValueOnLeaves(node, val)
{
    // verifico se a subtree tem um no
    if (node.children) {
        node.children.forEach(function (child) {
            runValueOnLeaves(child, val)
        });
    } else {
        // verifico os possiveis caminhos
        const possiblePaths = automato
        .filter(
            function (rule) {
                return rule.step == node.value && rule.receive == val;
            }
        );

        // para cada possivel caminho, crio um novo no
        possiblePaths.forEach(
            function (rule) {
                rule.destination.forEach(function (dest) {
                    if (dest.trim() != "") {
                        //Inicializo os filhos caso ainda nao tenha nenhum
                        if (typeof node.children == "undefined") {
                            node.children = [];
                        }

                        node.children.push(
                            createNode(dest.trim(), node.hash)
                        );
                    }
                })
            }
        )
    }
}

function getLeavesOfTree(node)
{
    if (node.children) {
        var children = [];

        node.children.forEach(function (child) {
            children = children.concat(getLeavesOfTree(child));
        });

        return children;
    } else {
        return [node.value];
    }
}
var steps = {};
var dicionario = {};

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
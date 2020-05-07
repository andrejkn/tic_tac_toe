const grid = (() => {
    const initiateState = () => ({
        turnCount: 0,
    });

    let state = initiateState();

    return {
        incrementCount: () => {
            state.turnCount++;
            render();
        },
        getTurnCount: () => state.turnCount,
        reset: () => {
            state = initiateState();
            render();
        }
    };
})();

const Component = (tag, children, attributes, eventHandlers) => {
    const el = document.createElement(tag);

    if (children && children.length > 0) {
        children.forEach(child => el.appendChild(child));
    }

    if (attributes) {
        Object.keys(attributes)
            .forEach(attribute => el.setAttribute(attribute, attributes[attribute]));
    }

    if (eventHandlers) {
        Object.keys(eventHandlers)
            .forEach(event => el.addEventListener(event, eventHandlers[event]));
    }

    return el;
};

const Text = (content) => document.createTextNode(content);

const App = (children) => {
    const el = document.getElementById('app');
    el.innerHTML = null;

    if (children && children.length > 0) {
        children.forEach((child) => el.appendChild(child));
    }

    return el;
};

const render = () => {
    const counter = Text(grid.getTurnCount());

    const incrementButton = Component(
        'button',
        [Text('increment')],
        {class: 'button'},
        {click: () => grid.incrementCount()}
    );

    const resetButton = Component(
        'button',
        [Text('Reset')],
        {class: 'button'},
        {click: () => grid.reset()}
    );

    App([counter, incrementButton, resetButton]);
}

document.addEventListener('DOMContentLoaded', render);
const grid = (() => {
    const numFields = 9;
    const players = [
        '\u{1F9FC}', // 🧼
        '\u{1F9A0}'  // 🦠
    ];

    const initiateState = () => ({
        fields: Array(numFields).fill(null),
        turnCount: 0
    });

    let state = initiateState();

    return {
        markField: (index) => {
            const playerIndex = state.turnCount % players.length;
            if (state.fields[index] === null) {
                state.fields[index] = players[playerIndex];
                state.turnCount++;
                render();
            }
        },
        getField: (index) => state.fields[index],
        getFields: () => state.fields,
        reset: () => {
            state = initiateState();
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

const Button = (content, onClick) => Component(
    'button',
    [Text(content)],
    {},
    {click: onClick}
);

const Panel = (children) => Component(
    'div',
    children,
    {class: 'panel'}
);

const Field = (content, onClick, isWinner) => Component(
    'div',
    [Text(content ? content : '')],
    {class: `field ${isWinner ? 'winner-field' : ''}`},
    {click: onClick}
);

const Message = (content) => Component(
    'div',
    [Text(content)],
    {class: 'message-container'}
);

const Grid = (fields) => Component(
    'div',
    fields,
    {class: 'grid-container'}
);

const App = (children) => {
    const el = document.getElementById('app');
    el.innerHTML = null;

    if (children && children.length > 0) {
        children.forEach((child) => el.appendChild(child));
    }

    return el;
};

const render = () => {
    const restartButton = Button(
        'Restart \u{1f987}',
        () => {
            grid.reset();
            render();
        }
    );

    const panel = Panel([restartButton]);

    const messageContainer = Message('??? is the winner!');
    const fields = grid.getFields()
        .map((field, i) => Field(
            field,
            () => grid.markField(i),
            false
        ));
    const gridContainer = Grid(fields);

    App([
        messageContainer,
        panel,
        gridContainer
    ]);
}

document.addEventListener('DOMContentLoaded', render);
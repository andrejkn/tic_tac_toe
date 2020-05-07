const checkIfWinning = ([f1, f2, f3]) => (f1 && f1 === f2 && f1 === f3 && f2 === f3);

const findWinningFields = (fields, index) => {
    //    +0 +1 +2
    //   +--------
    // 0 | 0, 1, 2
    // 3 | 3, 4, 5
    // 6 | 6, 7, 8

    const verticalPos = index % 3;
    const vertical = [verticalPos, verticalPos + 3, verticalPos + 6];

    const horizontalPos = Number.parseInt(index / 3) * 3;
    const horizontal = [horizontalPos, horizontalPos + 1, horizontalPos + 2]

    const diagonal1 = [0, 4, 8].includes(index) ? [0, 4, 8] : null;
    const diagonal2 = [2, 4, 6].includes(index) ? [2, 4, 6] : null;

    if (checkIfWinning(vertical.map((i) => fields[i]))) {
        return vertical;
    } else if (checkIfWinning(horizontal.map((i) => fields[i]))) {
        return horizontal;
    } else if (diagonal1 && checkIfWinning(diagonal1.map((i) => fields[i]))) {
        return diagonal1;
    } else if (diagonal2 && checkIfWinning(diagonal2.map((i) => fields[i]))) {
        return diagonal2;
    }

    return null;
}

const grid = (() => {
    const numFields = 9;
    const players = [
        '\u{1F9FC}', // 🧼
        '\u{1F9A0}'  // 🦠
    ];

    const initiateState = () => ({
        fields: Array(numFields).fill(null),
        turnCount: 0,
        winningFields: null
    });

    let state = initiateState();

    return {
        markField: (index) => {
            if (state.fields[index] === null && state.winningFields === null) {
                state.fields[index] = players[state.turnCount % players.length];
                state.winningFields = findWinningFields(state.fields, index);
                state.turnCount++;
                render();

                if (state.turnCount % 2 === 1) {
                    zombieMove();
                }
            }
        },
        getField: (index) => state.fields[index],
        getFields: () => state.fields,
        getWinningFields: () => state.winningFields,
        reset: () => {
            state = initiateState();
        }
    };
})();

const zombieMove = () => {
    const emptyFields = grid.getFields()
        .map((field, index) => field === null ? index : null)
        .filter((freeIndex) => freeIndex !== null);

    const nextIndex = Math.floor(Math.random() * emptyFields.length);

    grid.markField(emptyFields[nextIndex]);
};

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

    const winnerFields = grid.getWinningFields();
    const messageContainer = Message(
        winnerFields
            ? `${grid.getField(winnerFields[0])} is the winner!` : ''
        );
    const fields = grid.getFields()
        .map((field, i) => Field(
            field,
            () => grid.markField(i),
            winnerFields ? winnerFields.includes(i) : false
        ))
    const gridContainer = Grid(fields);

    App([
        messageContainer,
        panel,
        gridContainer
    ]);
}

document.addEventListener('DOMContentLoaded', render);
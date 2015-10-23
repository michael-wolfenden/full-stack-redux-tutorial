import {List, Map} from 'immutable';

const INITIAL_STATE = Map();

export {
    setEntries,
    next,
    vote,
    INITIAL_STATE
};

function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

function next(state) {
    const winners = _getWinners(state.get('vote'));
    const entries = state.get('entries').concat(winners);

    if (entries.size === 1) {
        return state.remove('vote')
            .remove('entries')
            .set('winner', entries.first());
    } else {
        return state.merge({
            vote: Map({ pair: entries.take(2) }),
            entries: entries.skip(2)
        });
    }
}

function vote(state, entry) {
    return state.updateIn(
        ['vote', 'tally', entry],
        0,
        tally => tally + 1
        );
}

function _getWinners(vote) {
    if (!vote) return [];

    const [a, b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);

    if (aVotes > bVotes) return [a];
    else if (aVotes < bVotes) return [b];
    else return [a, b];
}

// Results are symmetric, so <A, B> = X and <B, A> = -X
// and <A,A> = 0
const name_scores: Record<string, Record<string, number>> = {};

const name_appearances: Record<string, number> = {};
const best_appearances: Record<string, number> = {};
const worst_appearances: Record<string, number> = {};

type vote = 'Best' | 'Worst' | '';

type NameGroup = [string, string, string, string];
type VoteGroup = [vote, vote, vote, vote];

const is_name_group_valid = (name_group: string[]): name_group is NameGroup => name_group.length === 4;

const is_vote_group_valid = (vote_group: string[]): vote_group is VoteGroup => {
    const isBestValid = vote_group.filter(vote => vote === 'Best').length === 1;
    const isWorstValid = vote_group.filter(vote => vote === 'Worst').length === 1;
    const isBlankValid = vote_group.filter(vote => vote === '').length === 2;

    return isBestValid && isWorstValid && isBlankValid && vote_group.length === 4;
};

const count_appearance = (name_group: string[]) => {
    if (!is_name_group_valid(name_group)) {
        return;
    }

    for (let i = 0; i < name_group.length; i++) {
        const name = name_group[i];
        if (name_appearances[name] === undefined) {
            name_appearances[name] = 0;
        }

        name_appearances[name]++;
        if (best_appearances[name] === undefined) {
            best_appearances[name] = 0;
        }
        if (worst_appearances[name] === undefined) {
            worst_appearances[name] = 0;
        }
    }
};

const validate_votes = () => {
    for (const name_a in Object.keys(name_scores)) {
        const vals = name_scores[name_a];
        if (vals === undefined) {
            return;
        }
        const reflect_score = name_scores[name_a][name_a];
        if (reflect_score !== 0) {
            throw new Error(
                `name score does not equal 0 for itself: name_scores[${name_a}][${name_a}] = ${reflect_score}`
            );
        }
        for (const name_b in Object.keys(vals)) {
            const score_1 = name_scores[name_a][name_b];
            const score_2 = name_scores[name_b][name_a];

            if (score_1 !== -score_2) {
                throw new Error(
                    `Scores are not symmetric: name_scores[${name_a}][${name_b}] = ${score_1} but name_scores[${name_b}][${name_a}] = ${score_2}`
                );
            }
        }
    }
};

const add_vote = (name_group: string[], vote_group: string[]) => {
    if (!is_vote_group_valid(vote_group) || !is_name_group_valid(name_group)) {
        return;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const name_a = name_group[i];
            const name_b = name_group[j];
            if (name_scores[name_a] === undefined) {
                name_scores[name_a] = {};
            }
            if (name_scores[name_b] === undefined) {
                name_scores[name_b] = {};
            }

            if (name_scores[name_a][name_b] === undefined) {
                name_scores[name_a][name_b] = 0;
            }

            if (name_scores[name_b][name_a] === undefined) {
                name_scores[name_b][name_a] === 0;
            }
        }
    }

    const best_name = name_group[vote_group.indexOf('Best')];
    const worst_name = name_group[vote_group.indexOf('Worst')];
    const [other_name_1, other_name_2] = name_group.filter(name => name !== best_name && name !== worst_name);

    name_scores[best_name][worst_name] += 2;
    name_scores[worst_name][best_name] -= 2;

    name_scores[best_name][other_name_1] += 1;
    name_scores[other_name_1][best_name] -= 1;

    name_scores[best_name][other_name_2] += 1;
    name_scores[other_name_2][best_name] -= 1;

    name_scores[other_name_1][worst_name] += 1;
    name_scores[worst_name][other_name_1] -= 1;

    name_scores[other_name_2][worst_name] += 1;
    name_scores[worst_name][other_name_2] -= 1;

    best_appearances[best_name]++;
    worst_appearances[worst_name]++;

    // call validation function after every vote added to make sure I'm not blowing up the results somehow
    validate_votes();
};

const normalize_by_appearances = () => {
    Object.entries(name_appearances).forEach(([name, count]) => {
        const pairs = Object.keys(name_scores[name]);
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            name_scores[name][pair] = Math.floor((1000 * name_scores[name][pair]) / count);
        }
    });
};

const calculate_best_worst = () => {
    let top_best_appearances = '';
    let top_worst_appearances = '';
    let top_appearances = '';

    let top_best_appearances_count = 0;
    let top_worst_appearances_count = 0;
    let top_appearances_count = 0;

    Object.entries(name_appearances)
        .sort(([name1], [name2]) => best_appearances[name2] - best_appearances[name1])
        .forEach(([name, count]) => {
            const best_appearances_for_name = best_appearances[name];
            const worst_appearances_for_name = worst_appearances[name];
            const appearances_for_name = best_appearances_for_name + worst_appearances_for_name;

            if (best_appearances_for_name > top_best_appearances_count) {
                top_best_appearances = name;
                top_best_appearances_count = best_appearances_for_name;
            }
            if (worst_appearances_for_name > top_worst_appearances_count) {
                top_worst_appearances = name;
                top_worst_appearances_count = worst_appearances_for_name;
            }
            if (appearances_for_name > top_appearances_count) {
                top_appearances = name;
                top_appearances_count = appearances_for_name;
            }
        });

    console.log(`${top_best_appearances} was voted best the most often, at ${top_best_appearances_count} times`);
    console.log(`${top_worst_appearances} was voted worst the most often, at ${top_worst_appearances_count} times`);
    console.log(`${top_appearances} was voted either way the most often, at ${top_appearances_count} times`);
};

const find_lowest_name = (): [string, number] => {
    let lowest_name = '';
    let lowest_score = 10000000000;

    const names = Object.keys(name_scores);

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const score = Object.values(name_scores[name]).reduce((sum, next) => sum + next, 0);

        if (score < lowest_score) {
            lowest_name = name;
            lowest_score = score;
        }
    }

    return [lowest_name, lowest_score];
};

const remove_name = (name_to_remove: string) => {
    delete name_scores[name_to_remove];

    const remaining_names = Object.keys(name_scores);

    for (let i = 0; i < remaining_names.length; i++) {
        const name = remaining_names[i];
        const pairs = Object.keys(name_scores[name]);
        for (let j = 0; j < pairs.length; j++) {
            const pair = pairs[j];
            if (name === pair || remaining_names.includes(pair)) {
                continue;
            }

            name_scores[name][pair] = Math.ceil(name_scores[name][pair] * 0.9);
        }
    }
};

const median = 3630;
const stdev = 4971;

const normalize_scores = (ordered_names_scores: [string, number][]): [string, number][] => {
    let positive_accumulator = 0;
    const result: [string, number][] = [];
    for (let i = 0; i < ordered_names_scores.length; i++) {
        const [name, score] = ordered_names_scores[i];
        const score_normalized = Math.ceil((100 * (score + positive_accumulator + median)) / stdev);
        if (score > 0) {
            positive_accumulator += score;
        }
        result.push([name, score_normalized]);
    }

    return result;
};

const has_names_remaining = (): boolean => Object.keys(name_scores).length > 0;

export {
    add_vote,
    find_lowest_name,
    remove_name,
    has_names_remaining,
    count_appearance,
    normalize_by_appearances,
    calculate_best_worst,
    normalize_scores,
};

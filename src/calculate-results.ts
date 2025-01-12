import {readFileSync} from 'fs';
import {
    add_vote,
    find_lowest_name,
    remove_name,
    has_names_remaining,
    count_appearance,
    normalize_by_appearances,
    calculate_best_worst,
    normalize_scores,
} from './name-scores';

const fileToArray = (): string[][] => {
    const content = readFileSync(`/Users/ajhorst/dev/fantasy-name-rankings/resources/responses.csv`, 'utf8');

    const result: string[][] = [];

    const rows = content.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (result[i] === undefined) {
            result[i] = [];
        }
        const cells = row.substring(1, row.length - 1).split('","');
        // starting at 1 because 0 is response timestamps and 1 is emails
        for (let j = 2; j < cells.length; j++) {
            const cell = cells[j];
            result[i].push(cell);
        }
    }

    return result;
};

const parse_name = (line: string): string => {
    const bracket_start = line.indexOf('[');
    const bracket_end = line.indexOf(']');
    return line.substring(bracket_start + 1, bracket_end);
};

const make_vote_group = (arr: string[][], row: number, i: number): string[] => {
    const vote_1 = arr[row][i];
    const vote_2 = arr[row][i + 1];
    const vote_3 = arr[row][i + 2];
    const vote_4 = arr[row][i + 3];

    return [vote_1, vote_2, vote_3, vote_4];
};

const arrayToVotes = (arr: string[][]) => {
    const rowCount = arr.length;
    const colCount = arr[0].length;

    for (let i = 0; i < colCount; i += 4) {
        const name_1 = parse_name(arr[0][i]);
        const name_2 = parse_name(arr[0][i + 1]);
        const name_3 = parse_name(arr[0][i + 2]);
        const name_4 = parse_name(arr[0][i + 3]);

        const name_group = [name_1, name_2, name_3, name_4];
        count_appearance(name_group);
        for (let j = 1; j < rowCount; j++) {
            const vote_group = make_vote_group(arr, j, i);
            add_vote(name_group, vote_group);
        }
    }
};

const names_scores: [string, number][] = [];

const calculateList = () => {
    normalize_by_appearances();
    while (has_names_remaining()) {
        const [lowest_name, lowest_score] = find_lowest_name();
        names_scores.push([lowest_name, lowest_score]);
        remove_name(lowest_name);
    }
};

const arr = fileToArray();

arrayToVotes(arr);

calculateList();
calculate_best_worst();

const final_scores = normalize_scores(names_scores);
console.log('final list is:');

for (let i = 0; i < final_scores.length; i++) {
    const [name, score] = final_scores[i];
    console.log(`${name} with a score of ${score}`);
}

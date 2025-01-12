const base_weight = 2;
const batch_size = 4;

const random_not_in = (max: number, exclude: number[]): number => {
    let result = Math.floor(Math.random() * max);
    while (exclude.includes(result)) {
        result = Math.floor(Math.random() * max);
    }

    return result;
};

const pick_names_list = (all_names: string[][], rand: number): string[] => {
    let remaining_weight = rand;
    for (let i = 0; i < all_names.length; i++) {
        // if the random number is within the weight of the next list up
        // (aka the length plus base), then return that list. Else,
        // subtract that weight from the rand and keep going
        const names_list = all_names[i];
        const names_list_weight = names_list.length + base_weight;
        if (remaining_weight < names_list_weight) {
            return names_list;
        }

        remaining_weight -= names_list_weight;
    }

    // if somehow no names list is picked, return the last one
    return all_names[all_names.length - 1];
};

const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const names_aj_immutable = new Set([
    'SaQuonDo',
    'Oh Saquon You See',
    'Count Olave',
    'L Ron Hubbard',
    'Austin Bowers',
    "Diontae's Inferno",
    'Boswell That Ends Well',
    "If I Win I'll Leave You",
    'Saigon Barkley',
    'Holiday in Lambeaudia',
    'Pachec Yourself',
    'Pickens Little',
    'Never in Dowdle',
    'Najee or Nice',
    'McConkey Kong',
]);

const names_sharv_immutable = new Set([
    'Aaron Rodgers, Hall Pass',
    'Moore to Love',
    'Ridley Me This',
    'Breece Witherspoon',
    'You Wilson, You Lose Some',
    'Mixon It Up',
    'If I lose ill leave you',
    'Mixon in China',
    'Judge Jeudy',
]);

const names_sarah_immutable = new Set([
    'Stainless Steel Mahomes',
    'Purdy Little Liars',
    'CeeDee Roms',
    'Swifties',
    'Bijan Mustard',
    'AnaKen Skywalker II',
    'Happy Lamb',
    'DangeRuss woman',
    'Nacua Matata',
    'The Gibber',
    'The Adams Family',
    'Tua Lipa',
    'Brock Lobster',
    'Up and Adams',
    'Ford F-150',
]);

const names_noah_immutable = new Set([
    'Finding Deebo',
    'Freemasons',
    'Let Cook Cook',
    'Reign of Terror',
    "Won't You Be My Nabers",
    'Hurts Donut',
    'HOTTO Deebo',
    'The Jackson 5 (TDs)',
    'RedZone Supernova',
    'Run CMC',
    'The Full Monty',
    'Chuba Chups',
    'Jaxon, Jaxoff',
    'Corpse McBride',
    'Collins Me Maybe',
    'Bye Bye Bye',
    'Superb Owl Champ',
]);

const names_zoe_immutable = new Set([
    'The Stroud Family ',
    'Dear Evans Hansen',
    'LaPorta Potties',
    'Hey Darnold!',
    'TEE TIME',
    'lights kamara action',
    '3 Receivers in a Trenchcoat',
    '3 RBs in a Trenchcoat',
    'Django Achaned',
    'Herbie Fully Loaded',
    'Chief of Stafford',
    'Herbie Fully Loaded (Redux)',
    'Herbie Rides Again',
    'The Bucky Stops Here',
    'Courtland is in Session',
    "Gettin' Higgy Wit It",
    'Thomas the Tank Engine',
]);

const names_mark_immutable = new Set(['White Josh', 'Half Chubb', 'White Josh', 'Half Chubb']);

const all_names_immutable = new Set([
    names_aj_immutable,
    names_sharv_immutable,
    names_sarah_immutable,
    names_noah_immutable,
    names_zoe_immutable,
    names_mark_immutable,
]);

const random_name_not_in = (exclude: string[]): string => {
    const all_names = [...all_names_immutable];
    for (let i = 0; i < 100; i++) {
        const name_list = [...all_names[Math.floor(Math.random() * all_names.length)]];
        const random_name = name_list[Math.floor(Math.random() * name_list.length)];
        if (!exclude.includes(random_name)) {
            return random_name;
        }
    }

    throw new Error('random name selector ran 100 times and still failed');
};

const pop_name = (name_list: string[], exclude: string[]): string => {
    const name = name_list.shift();

    if (name) {
        return name;
    }

    return random_name_not_in(exclude);
};

// goal - run through all the names at least once, in batches of four,
// always putting at least two of the first name's group together

const names_aj = shuffle([...names_aj_immutable]);
const names_sharv = shuffle([...names_sharv_immutable]);
const names_sarah = shuffle([...names_sarah_immutable]);
const names_noah = shuffle([...names_noah_immutable]);
const names_zoe = shuffle([...names_zoe_immutable]);
const names_mark = shuffle([...names_mark_immutable]);

const all_names = [names_aj, names_sharv, names_sarah, names_noah, names_zoe, names_mark];

let loop_count = 0;
while (true) {
    loop_count++;
    const all_names_length = all_names.reduce((sum, names_list) => sum + names_list.length, 0);

    if (all_names_length === 0) {
        break;
    }

    const weights = all_names.map(names_list => names_list.length + base_weight);
    const weights_max = weights.reduce((sum, weight) => sum + weight, 0);

    const rands: number[] = [];

    for (let i = 0; i < batch_size; i++) {
        const rand = random_not_in(weights_max, rands);
        rands.push(rand);
    }

    const names_lists: string[][] = [];

    for (let i = 0; i < batch_size; i++) {
        const names_list = pick_names_list(all_names, rands[i]);
        names_lists.push(names_list);
    }

    const names_batch: string[] = [];

    for (let i = 0; i < batch_size; i++) {
        const name = pop_name(names_lists[i], names_batch);
        names_batch.push(name);
    }

    shuffle(names_batch);
    console.log(names_batch);
}

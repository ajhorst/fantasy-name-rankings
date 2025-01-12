`npm run start` generates groups of four names at a time, until all names are used at least once. I ran this twice to generate the questions in the survey.

`npm run results` reads the results of the survey (stored in `resources/responses.csv`) and produces the ordered rankings of the names.

The responses csv file from Google Forms came out in a wild format that I did not expect (every name in every question is a column, for a total of over 300 columns), so the logic to parse it into something usable in JS is wonky.

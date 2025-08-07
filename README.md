# Coding Assessment for eBacon

## Get it running

Install it first
```
$ yarn install
```

Run the program
```
$ yarn start
```

Run the program for development
```
$ yarn start-dev
```

## Breakdown

- Installed nodemon for development
- Turned the jsonc into a jsonc
  - The instructions mentioned that I can "reformat the meta data as needed" so I turned the jsonc into a json.
  - I could have installed one of the jsonc packages that I found for npm but it seemed simpler to separate the instructions from the data and make it a json.
  - In production I would have used whatever methods an procedures that I saw being employed in the codebase already.
- I decided to make the caclculator modular and take in an array to map through rather than hard coding the employees by name in case you guys gave points for that.
- Used [Moment](https://www.npmjs.com/package/moment) to get the difference between the start and end timestamps on the shifts.
- I started from the "Math" and worked my way outwards from there.
  - I iterated throught he punches for Mike first.
  - After I got that to work I then iterated through the other Employees.
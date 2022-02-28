import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import './App.css';
import { Typography } from '@mui/material';
import { words } from './words';

const style = { width: '70px' };

const idxs = [0, 1, 2, 3, 4];

function App() {
	const [inputState, setInputState] = React.useState({
		0: { letter: '', color: 0 },
		1: { letter: '', color: 0 },
		2: { letter: '', color: 0 },
		3: { letter: '', color: 0 },
		4: { letter: '', color: 0 },
	});

	const [badLetters, setBadLetters] = React.useState([]);
	const [goodLetters, setGoodLetters] = React.useState([]);
	const [correctLetters, setCorrectLetters] = React.useState([]);

	const [foundWords, setFoundWords] = React.useState(words);

	const [checks, setChecks] = React.useState([]);

	const changeInputLetter = (i, letter) => {
		if (!letter) return setInputState({ ...inputState, [i]: { ...inputState[i], letter: '' } });
		setInputState({ ...inputState, [i]: { ...inputState[i], letter } });
	};
	const changeInputColor = (i) => {
		let color = inputState[i].color < 2 ? inputState[i].color + 1 : 0;
		setInputState({ ...inputState, [i]: { ...inputState[i], color } });
	};

	const getColor = (i) => (i === 2 ? 'green' : i === 1 ? 'yellow' : 'gray');

	const handleNextClick = () => {
		const bads = [...badLetters];
		const goods = [];
		const corrects = [];

		idxs.map((i) => {
			if (inputState[i].color === 0) return bads.push(inputState[i].letter);
			if (inputState[i].color > 0) goods.push(inputState[i].letter);
			if (inputState[i].color === 2) corrects.push({ pos: i, letter: inputState[i].letter });
			return false;
		});

		setBadLetters([...badLetters, bads]);
		setGoodLetters([...goodLetters, goods]);
		setCorrectLetters([...correctLetters, corrects]);

		//search words
		const results = [];

		console.log(bads);
		console.log(goods);
		console.log(corrects);

		for (let word of foundWords) {
			// check if the word has some of the bad letters
			const rs1 = bads.some((letter) => word.includes(letter));
			if (rs1) continue;

			// check if the word has all of the green letters in exact positions
			const rs2 = corrects.every((correct) => correct.letter === word[correct.pos]);
			if (!rs2) continue;

			// check if the word has all of the good letters
			const rs3 = goods.every((letter) => word.includes(letter));
			if (rs3) results.push(word);
		}

		// console.log(results);
		setFoundWords(results);

		//add the word to checks with color
		const newCheck = {
			0: { letter: inputState[0].letter, color: inputState[0].color },
			1: { letter: inputState[1].letter, color: inputState[1].color },
			2: { letter: inputState[2].letter, color: inputState[2].color },
			3: { letter: inputState[3].letter, color: inputState[3].color },
			4: { letter: inputState[4].letter, color: inputState[4].color },
		};
		setChecks([...checks, newCheck]);
	};

	const addToInput = (word) => {
		let newInputState = { ...inputState };
		console.log(word);
		idxs.map((i) => {
			newInputState[i].letter = word[i];
			newInputState[i].color = 0;
			return true;
		});
		setInputState(newInputState);
		console.log(inputState);
	};

	return (
		<div className="App">
			<header className="App-header">
				<Stack direction="row" spacing={20}>
					<Stack direction="column">
						<Typography>Next Round Suggestions</Typography>
						{foundWords.length !== words.length &&
							foundWords.map((foundWord) => (
								<Typography key={Math.random()} onClick={() => addToInput(foundWord)}>
									{foundWord}
								</Typography>
							))}
					</Stack>

					<Stack direction="column" spacing={2}>
						<Stack direction="row" spacing={2}>
							{idxs.map((i) => (
								<TextField
									key={Math.random()}
									id={`letter-${i}`}
									variant="outlined"
									value={inputState[i].letter}
									style={{ ...style, backgroundColor: getColor(inputState[i].color) }}
									onChange={(e) => changeInputLetter(i, e.target.value)}
								/>
							))}
						</Stack>

						<Stack direction="row" spacing={2}>
							{idxs.map((i) => (
								<Button
									key={Math.random()}
									id={`button-${i}`}
									variant="outlined"
									style={style}
									onClick={() => changeInputColor(i)}
								>
									^
								</Button>
							))}
						</Stack>

						<Stack direction="row" spacing={2}>
							<Button id="button-next" variant="outlined" style={style} onClick={handleNextClick}>
								Next
							</Button>
						</Stack>
					</Stack>

					<Stack direction="column">
						<Typography>Checks</Typography>
						{checks.map((check) => (
							<Stack key={Math.random()} direction="row">
								{idxs.map((i) => (
									<Typography key={Math.random()} color={getColor(check[i].color)}>
										{check[i].letter}
									</Typography>
								))}
							</Stack>
						))}
					</Stack>
				</Stack>
			</header>
		</div>
	);
}

export default App;

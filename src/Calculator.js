import React, { Component } from 'react';

import Calculations from './Calculations';
import Answer from './Answer';
import CalcButton from './CalcButton';

import { convertInfixToReversePolish, evaluateReversePolish } from './utils';

import { TOKEN_TYPE } from './constants';
import './Calculator.css';

const { OPERATOR, NUMBER } = TOKEN_TYPE;

class Calculator extends Component {
  static DECIMAL = '.';
  static NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  static BUTTONS = [
    '7',
    '8',
    '9',
    '/',
    '4',
    '5',
    '6',
    '*',
    '1',
    '2',
    '3',
    '-',
    '.',
    '0',
    'DEL',
    '+'
  ];
  static OPERATORS = ['+', '-', '/', '*'];

  state = {
    tokens: [
      // {type, value}
    ],
    answer: 0,
    oldCalculations: [
      // {query, answer}
    ]
  };

  handleKeyPress = ({ key }) => {
    if (Calculator.NUMBERS.includes(key)) {
      this.onNumber(key);
    } else if (Calculator.OPERATORS.includes(key)) {
      this.onOperator(key);
    } else if (key === Calculator.DECIMAL) {
      this.onDecimal();
    } else if (key === 'Backspace') {
      this.onDelete();
    } else if (key === '=' || key === 'Enter') {
      this.startNewOperation();
    }
  };

  updateTokens = tokens => {
    this.setState(() => ({
      tokens
    }));
  };

  updateAnswer = tokens => {
    this.setState({
      answer: evaluateReversePolish(convertInfixToReversePolish(tokens)) || 0
    });
  };

  updateTokensAndAnswer = tokens => {
    this.setState({
      tokens,
      answer: evaluateReversePolish(convertInfixToReversePolish(tokens)) || 0
    });
  };

  startNewOperation = () => {
    const { tokens, oldCalculations, answer } = this.state;
    // only continue if there is answer and if query has changed
    const { query: oldQuery } =
      oldCalculations[oldCalculations.length - 1] || {};
    const query = tokens.map(({ value }) => value).join(' ');

    if (answer && oldQuery !== query) {
      this.setState(() => ({
        oldCalculations: [
          ...oldCalculations,
          {
            query,
            answer
          }
        ],
        answer, // same as evaluateReversePolish(convertInfixToReversePolish({ type: NUMBER, value: answer }))
        tokens: [{ type: NUMBER, value: String(answer) }]
      }));
    }
  };

  onNumber = num => {
    const { tokens } = this.state;
    const tokensLength = tokens.length;
    const lastToken = tokens[tokensLength - 1];
    let newTokens;

    if (lastToken && lastToken.type === NUMBER) {
      newTokens = [
        ...tokens.slice(0, tokensLength - 1),
        {
          type: NUMBER,
          value: lastToken.value + num
        }
      ];
    } else {
      newTokens = [...this.state.tokens, { type: NUMBER, value: num }];
    }
    this.updateTokensAndAnswer(newTokens);
  };

  onOperator = operator => {
    const { tokens } = this.state;
    const tokensLength = tokens.length;
    const lastToken = tokens[tokensLength - 1];

    if (lastToken) {
      const { value, type } = lastToken;
      if (type === OPERATOR) {
        this.updateTokens([
          ...tokens.slice(0, tokensLength - 1),
          { type: OPERATOR, value: operator }
        ]);
      } else if (type === NUMBER) {
        if (value[value.length - 1] !== Calculator.DECIMAL) {
          this.updateTokens([
            ...this.state.tokens,
            { type: OPERATOR, value: operator }
          ]);
        } else {
          this.updateTokens([
            ...tokens.slice(0, tokensLength - 1),
            {
              type: NUMBER,
              value: value.slice(0, value.length - 1)
            },
            { type: OPERATOR, value: operator }
          ]);
        }
      }
    }
  };

  onDelete = () => {
    const { tokens } = this.state;
    const tokensLength = tokens.length;
    const { value, type } = tokens[tokensLength - 1] || {};
    let newTokens;
    if (type === OPERATOR) {
      newTokens = tokens.slice(0, tokens.length - 1);
      this.updateTokensAndAnswer(newTokens);
    } else if (type === NUMBER) {
      const newValue = value.slice(0, value.length - 1);
      if (newValue) {
        newTokens = [
          ...tokens.slice(0, tokens.length - 1),
          { type: NUMBER, value: newValue }
        ];
        this.updateTokensAndAnswer(newTokens);
      } else {
        newTokens = [...tokens.slice(0, tokens.length - 1)];
        if (newTokens.length > 0) {
          //do not update answer when last digit is operator
          this.updateTokens(newTokens);
        } else {
          this.updateTokensAndAnswer(newTokens);
        }
      }
    }
  };

  onDecimal = () => {
    const { tokens } = this.state;
    const tokensLength = tokens.length;
    const { value = '', type } = tokens[tokensLength - 1] || {};

    if (type === NUMBER && value[value.length - 1] !== Calculator.DECIMAL) {
      this.updateTokens([
        ...tokens.slice(0, tokensLength - 1),
        {
          type: NUMBER,
          value: value + Calculator.DECIMAL
        }
      ]);
    } else {
      this.updateTokens([
        ...tokens,
        {
          type: NUMBER,
          value: '0' + Calculator.DECIMAL
        }
      ]);
    }
  };
  render() {
    const { oldCalculations, tokens, answer } = this.state;
    const roundedAnswer = Math.round(answer * 10000) / 10000;

    return (
      <div className="App" tabIndex="0" onKeyUp={this.handleKeyPress}>
        <div className="calc">
          <div className="calc__top">
            <Calculations data={oldCalculations} />
            <div className="calc__query">
              {tokens.map(({ value }) => value).join(' ')}
            </div>
            <Answer data={roundedAnswer} />
          </div>
          <div className="calc__middle">
            {Calculator.BUTTONS.map(num => {
              if (num === 'DEL') {
                return (
                  <CalcButton onClick={this.onDelete} number={num} key={num} />
                );
              }
              if (Calculator.OPERATORS.includes(num)) {
                return (
                  <CalcButton
                    onClick={this.onOperator}
                    number={num}
                    key={num}
                  />
                );
              }
              return (
                <CalcButton onClick={this.onNumber} number={num} key={num} />
              );
            })}
          </div>
          <div className="calc__bottom">
            <CalcButton
              onClick={this.startNewOperation}
              number="="
              className="calc__equals"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Calculator;

import { operatorPrecedence } from './constants';

export const evaluateReversePolish = tokens => {
  const stack = [];
  tokens.forEach(({ value, type }) => {
    if (type === 'NUMBER') {
      stack.push(parseFloat(value));
    } else {
      const numberOnRight = stack.pop();
      const numberOnLeft = stack.pop();
      switch (value) {
        case '+':
          stack.push(numberOnLeft + numberOnRight);
          break;
        case '-':
          stack.push(numberOnLeft - numberOnRight);
          break;
        case '*':
          stack.push(numberOnLeft * numberOnRight);
          break;
        case '/':
          stack.push(numberOnLeft / numberOnRight);
          break;
        default:
          // wat is happening
          debugger;
      }
    }
  });
  return stack.pop();
};

// we need not to support "(" and ")"
export const convertInfixToReversePolish = tokens => {
  const queue = [];
  const stack = [];

  tokens.forEach(token => {
    const { type, value } = token;
    const tokenPrecedence = operatorPrecedence[value] || 0;
    let stackPrecedence = stack.length
      ? operatorPrecedence[stack[stack.length - 1].value]
      : 0;

    if (type === 'NUMBER') {
      queue.push(token);
    } else if (
      type === 'OPERATOR' &&
      (!stack.length || tokenPrecedence > stackPrecedence)
    ) {
      stack.push(token);
    } else {
      while (tokenPrecedence <= stackPrecedence) {
        queue.push(stack.pop());
        stackPrecedence = stack.length
          ? operatorPrecedence[stack[stack.length - 1].value]
          : 0;
      }
      stack.push(token);
    }
  });

  while (stack.length) {
    queue.push(stack.pop());
  }

  return queue;
};

export const getFontSize = length => {
  if (length >= 1 && length < 12) {
    return 52;
  } else if (length >= 12 && length < 17) {
    return 38;
  } else if (length >= 17 && length < 40) {
    return 28;
  } else {
    return 28;
  }
};

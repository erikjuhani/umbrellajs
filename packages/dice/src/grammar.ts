// TODO: use pegjs grammar file with cli to generate a parser
// This will be necessary in order to inject external functions to the grammar itself.
export default `
{
  function roll(sides, type) {
    const rand = Math.random();
    switch(type) {
      case "d%":
        return { max: 100, result: Math.floor(rand * 100) };
      case "dF":
        return { max: 3, result: Math.floor(rand * 2) - 1 };
    }
    return { max: sides, result: Math.floor(rand * sides) };
  }
  
  function sum(value) {
    return Array.isArray(value) ? value.reduce((acc, v) => acc + v, 0) : value;
  }
    
  function parseLeaf(result, expr) {
    function omitWhitespace(str) {
      return str !== " ";
    }
    
    const [operator, ...value] = expr
      .flat()
      .filter(omitWhitespace);

    return value.reduce((acc, val) => parse(operator, acc, val), result)
  }

  function parse(operator, result, value) {
    const sumResult = sum(result);

    switch(operator) {
      case "+":
        return sumResult + value;
      case "-":
        return sumResult - value;
      case "/":
        return sumResult / value;
      case "x":
      case "*":
        return sumResult * value;
      default:
        return result;
    }
  }

  function asc(a, b) {
    return a > b ? 1 : -1;
  }

  function desc(a, b) {
    return a < b ? 1 : -1;
  }

  function drop(rolls, args) {
    const [modifier, amount] = args;
    return rolls
      .sort(modifier === "h" ? desc : asc)
      .slice(amount || 1)
  }

  function keep(rolls, args) {
    const [modifier, amount] = args;
    return rolls
      .sort(modifier === "l" ? desc : asc)
      .slice(-1 * (amount || 1))
  }

  function compare(roll, operator, value) {
    const { max, result } = roll;
    switch(operator) {
      case "=":
        return result === value;
      case "!=":
        return result !== value;
      case "<":
        return result < value;
      case "<=":
        return result <= value;
      case ">=":
        return result >= value;
      case ">":
        return result > value;
      default:
        return max === result;
    }
  }

  function explode(rolls, args) {
    const [operator, comparison] = args.flat();

    return rolls.reduce((acc, r) => {
      const res = [...acc, r];
      if (compare(r, operator, comparison)) {
        // Do additional roll
        return [...res, ...explode([roll(r.max)], args)];
      }
      return res;
    }, [])
  }

  function toNumber({ result }) {
    return result;
  }

  function result(rolls, modifier) {
    const [mod, ...args] = modifier.flat();  	
    switch(mod) {
      case "k":
        return keep(rolls.map(toNumber), args);
      case "d":
        return drop(rolls.map(toNumber), args);
      case "!":
        return explode(rolls, args).map(toNumber);
      default:
        return rolls.map(toNumber);
    }
  }
  
  function exec(amount, sides, type) {
    if (amount > 1) {
    return Array.from({ length: amount })
      .fill(sides)
      .map((value) => roll(value, type));
    }

    return [roll(sides, type)];
  }
}

Main = Expression

Expression
 = root:Factor leaf:(Operator Factor )* { return leaf.reduce(parseLeaf, root); }

Dice = rolls:(StandardDie / PercentileDie / FudgeDie) modifier:Modifier* {
  const res = result(rolls, modifier);
  return res.length === 1 ? res[0] : res;
}

StandardDie
 = amount:NonZeroInteger? "d" sides:Integer { return exec(amount, sides); }

PercentileDie
 = amount:NonZeroInteger? t:"d%" { return exec(amount, 100, t); }
 
FudgeDie
 = amount:NonZeroInteger? t:"dF" { return exec(amount, 3, t); }

Modifier
 = Keep
 / Drop
 / Explode

Explode
 = "!" CompareModifier?

Keep
 = "k" [lh]? NonZeroInteger?

Drop
 = "d" [lh]? NonZeroInteger?

Factor
  = "(" expr:Expression ")" { return expr; }
 / Dice
 / Integer
 
Operator
 = "+" / "-" / "/" / "x" / "*"

CompareModifier
 = CompareOperator Integer

CompareOperator
 = "<=" / ">=" / "<" /  ">" / "!=" / "="

NonZeroInteger
 = [1-9]+ Integer? { return parseInt(text(), 10); }

Integer
 = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace" = [ \t\w]*
`;

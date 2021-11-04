export default `
{
  function roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function parseLeaf(result, expr) {
    const [operator, value] = expr.flat(2).filter(whiteSpaceFilter)
    return parse(result, operator, value);
  }

  function parse(result, operator, value) {
    switch(operator) {
      case "+":
          return result + value;
        case "-":
          return result - value;
        case "/":
          return result / (value || 1);
        case "x":
        case "*":
          return result * value;
        default:
          return result;
    }
  }

  function whiteSpaceFilter(s) {
    return s !== " ";
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
}

Main = Expression

Expression
 = root:Factor leaf:(_ Operator _ Factor _ )* { return leaf.reduce(parseLeaf, root); }

Dice = rolls:StandardDie modifier:Modifier* {
  const [mod, ...args] = modifier.flat();
  
  if (typeof rolls === "number") {
  	return rolls;
  }
  
  switch(mod) {
    case "k":
    	return keep(rolls, args)
  	case "d":
    	return drop(rolls, args)
	default:
    	return rolls;
  }
}

StandardDie
 = amount:NonZeroInteger? "d" sides:Integer {
   if (amount > 1) {
    return Array.from({ length: amount }).fill(sides).map(roll);
   }
   
   return roll(sides);
 }

Modifier
 = KeepModifier
 / DropModifier

KeepModifier
 = "k" [lh]? NonZeroInteger?

DropModifier
 = "d" [lh]? NonZeroInteger?

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
 / Dice
 / Integer
 
Operator
 = "+" / "-" / "/" / "x" / "*"

NonZeroInteger
 = [1-9]+ Integer? { return parseInt(text(), 10); }

Integer "integer"
 = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace" = [ \t\w]*
`;

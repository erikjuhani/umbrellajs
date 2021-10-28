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
        case "*":
          return result * value;
        default:
          return result;
    }
  }

  function whiteSpaceFilter(s) {
    return s !== " ";
  }
}

Main = Expression

Expression
 = root:Factor leaf:(_ Operator _ Factor _ )* { return leaf.reduce(parseLeaf, root); }

Dice
 = qty:NonZeroInteger? "d" sides:Integer { return (qty || 1) * roll(sides); }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
 / Dice
 / Integer
 
Operator
 = "+" / "-" / "/" / "*"

NonZeroInteger
 = [1-9]+ { return parseInt(text(), 10); }

Integer "integer"
 = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace" = [ \t\w]*
`;

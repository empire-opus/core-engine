import { Parser } from './parser';
import { TokenError } from './errors';
import { TokenType } from './token-type';
import { Token, TokenKind } from './token';

class Lexer {
  private line = 1;
  private column = 0;
  private currentChar = '';

  private filePath = '';
  private fileContent = '';

  constructor(filePath, fileContent) {
    this.filePath = filePath;
    this.fileContent = fileContent;
  }

  private nextChar() {
    if (this.column >= this.fileContent.length) {
      this.line++;
      this.column = 0;
      return '';
    }
    return this.fileContent[this.column++];
  }

  private peekChar() {
    if (this.column >= this.fileContent.length) {
      this.line++;
      this.column = 0;
      return '';
    }
    return this.fileContent[this.column];
  }

  private skipWhitespace() {
    while (/\s/.test(this.currentChar = this.nextChar())) {}
  }

  private match(expectedChar) {
    if (this.currentChar !== expectedChar) {
      throw new TokenError(
        `Unexpected character '${this.currentChar}' on line ${this.line} at column ${this.column}`,
        this.filePath,
        this.line,
        this.column
      );
    }
    this.column++;
  }

  private consumeToken(kind, value) {
    if (!value) value = this.currentChar;
    return new Token(kind, value, this.line, this.column);
  }

  private isIdentifierStart(char) {
    return /[a-zA-Z_$]/.test(char);
  }

  private isIdentifierPart(char) {
    return /[a-zA-Z_$0-9]/.test(char);
  }

  private identifier() {
    let value = this.currentChar;
    while (this.isIdentifierPart(this.peekChar())) {
      this.column++;
      value += this.nextChar();
    }
    return this.consumeToken(TokenKind.Identifier, value);
  }

  private string() {
    let value = this.currentChar;
    while (this.peekChar() !== '"' && this.peekChar() !== undefined) {
      this.column++;
      value += this.nextChar();
    }
    this.match '"';
    return this.consumeToken(TokenKind.String, value);
  }

  private number() {
    let value = this.currentChar;
    while (/[0-9]/.test(this.peekChar())) {
      this.column++;
      value += this.nextChar();
    }
    return this.consumeToken(TokenKind.Number, value);
  }

  private operator() {
    switch (this.currentChar) {
      case '+':
        return this.consumeToken(TokenKind.Plus);
      case '-':
        return this.consumeToken(TokenKind.Minus);
      case '*':
        return this.consumeToken(TokenKind.Asterisk);
      case '/':
        return this.consumeToken(TokenKind.Slash);
      default:
        throw new TokenError(
          `Unexpected character '${this.currentChar}' on line ${this.line} at column ${this.column}`,
          this.filePath,
          this.line,
          this.column
        );
    }
  }

  private nextToken() {
    const tokens = [];

    while (this.currentChar !== '') {
      this.skipWhitespace();

      switch (this.currentChar) {
        case '(':
          tokens.push(this.consumeToken(TokenKind.LParen));
          break;
        case ')':
          tokens.push(this.consumeToken(TokenKind.RParen));
          break;
        case '[':
          tokens.push(this.consumeToken(TokenKind.LBracket));
          break;
        case ']':
          tokens.push(this.consumeToken(TokenKind.RBracket));
          break;
        case '{':
          tokens.push(this.consumeToken(TokenKind.LBrace));
          break;
        case '}':
          tokens.push(this.consumeToken(TokenKind.RBrace));
          break;
        case ',':
          tokens.push(this.consumeToken(TokenKind.Comma));
          break;
        case '.':
          tokens.push(this.consumeToken(TokenKind.Dot));
          break;
        case ':':
          tokens.push(this.consumeToken(TokenKind.Colon));
          break;
        case '=':
          tokens.push(this.consumeToken(TokenKind.Equals));
          break;
        case '!':
          tokens.push(this.consumeToken(TokenKind.NotEquals));
          break;
        case '<':
          tokens.push(this.consumeToken(TokenKind.LessThan));
          break;
        case '>':
          tokens.push(this.consumeToken(TokenKind.GreaterThan));
          break;
        case '/':
          tokens.push(this.consumeToken(TokenKind.Divide));
          break;
        case '%':
          tokens.push(this.consumeToken(TokenKind.Mod));
          break;
        case '&':
          tokens.push(this.consumeToken(TokenKind.Ampersand));
          break;
        case '^':
          tokens.push(this.consumeToken(TokenKind.Caret));
          break;
        case '|':
          tokens.push(this.consumeToken(TokenKind.Pipe));
          break;
        case '~':
          tokens.push(this.consumeToken(TokenKind.Tilde));
          break;
        case '-':
          tokens.push(this.consumeToken(TokenKind.Minus));
          break;
        case '+':
          tokens.push(this.consumeToken(TokenKind.Plus));
          break;
        case '*':
          tokens.push(this.consumeToken(TokenKind.Asterisk));
          break;
        case '/':
          tokens.push(this.consumeToken(TokenKind.Slash));
          break;
        default:
          if (this.isIdentifierStart(this.currentChar)) {
            tokens.push(this.identifier());
          } else if (this.currentChar === '"') {
            tokens.push(this.string());
          } else if (/[0-9]/.test(this.currentChar)) {
            tokens.push(this.number());
          } else if (['+', '-', '*', '/', '%', '&', '^', '|', '~'].includes(this.currentChar)) {
            tokens.push(this.operator());
          } else {
            throw new TokenError(
              `Unexpected character '${this.currentChar}' on line ${this.line} at column ${this.column}`,
              this.filePath,
              this.line,
              this.column
            );
          }
      }

      this.currentChar = this.nextChar();
    }

    return tokens;
  }

  parse() {
    const tokens = this.nextToken();
    return new Parser(tokens);
  }
}

export default Lexer;
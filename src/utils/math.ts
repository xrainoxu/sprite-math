// 题目类型
export type QuestionType = 'addition' | 'subtraction' | 'comparison';

// 题目接口
export interface Question {
  id: string;
  type: QuestionType;
  num1: number;
  num2: number;
  question: string;
  answer: number | string;
  options?: (number | string)[]; // 用于大小判断的选择题选项
}

// 生成随机整数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 打乱数组
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 生成加法题目
function generateAddition(): Question {
  const num1 = randomInt(1, 20);
  const num2 = randomInt(1, 20 - num1); // 确保结果不超过 20
  return {
    id: crypto.randomUUID(),
    type: 'addition',
    num1,
    num2,
    question: `${num1} + ${num2} = ?`,
    answer: num1 + num2,
  };
}

// 生成减法题目
function generateSubtraction(): Question {
  const num1 = randomInt(2, 20);
  const num2 = randomInt(1, num1); // 确保结果非负
  return {
    id: crypto.randomUUID(),
    type: 'subtraction',
    num1,
    num2,
    question: `${num1} - ${num2} = ?`,
    answer: num1 - num2,
  };
}

// 生成单个表达式（加法或减法）
function generateExpression(): { expr: string; result: number } {
  const isAddition = Math.random() > 0.5;

  if (isAddition) {
    // 加法：a + b
    const num1 = randomInt(1, 15);
    const num2 = randomInt(1, 20 - num1);
    return {
      expr: `${num1} + ${num2}`,
      result: num1 + num2,
    };
  } else {
    // 减法：a - b
    const num1 = randomInt(5, 20);
    const num2 = randomInt(1, num1 - 1);
    return {
      expr: `${num1} - ${num2}`,
      result: num1 - num2,
    };
  }
}

// 生成大小判断题目（比较两个表达式的结果）
function generateComparison(): Question {
  const expr1 = generateExpression();
  const expr2 = generateExpression();

  // 确保两个表达式结果不同
  while (expr1.result === expr2.result) {
    Object.assign(expr2, generateExpression());
  }

  const options = ['>', '<', '='];
  let answer: string;

  if (expr1.result > expr2.result) {
    answer = '>';
  } else if (expr1.result < expr2.result) {
    answer = '<';
  } else {
    answer = '=';
  }

  return {
    id: crypto.randomUUID(),
    type: 'comparison',
    num1: expr1.result,
    num2: expr2.result,
    question: `${expr1.expr} ? ${expr2.expr}`,
    answer,
    options: shuffleArray(options),
  };
}

// 根据类型生成随机题目
export function generateQuestion(types: QuestionType[] = ['addition', 'subtraction', 'comparison']): Question {
  const randomType = types[randomInt(0, types.length - 1)];

  switch (randomType) {
    case 'addition':
      return generateAddition();
    case 'subtraction':
      return generateSubtraction();
    case 'comparison':
      return generateComparison();
    default:
      return generateAddition();
  }
}

// 生成多个题目
export function generateQuestions(count: number, types: QuestionType[] = ['addition', 'subtraction', 'comparison']): Question[] {
  return Array.from({ length: count }, () => generateQuestion(types));
}

// 检查答案
export function checkAnswer(question: Question, answer: number | string): boolean {
  return String(question.answer) === String(answer);
}

// 获取题目类型的显示名称
export function getTypeName(type: QuestionType): string {
  switch (type) {
    case 'addition':
      return '加法';
    case 'subtraction':
      return '减法';
    case 'comparison':
      return '大小判断';
    default:
      return '未知';
  }
}

// 获取题目类型的图标
export function getTypeIcon(type: QuestionType): string {
  switch (type) {
    case 'addition':
      return '➕';
    case 'subtraction':
      return '➖';
    case 'comparison':
      return '⚖️';
    default:
      return '❓';
  }
}

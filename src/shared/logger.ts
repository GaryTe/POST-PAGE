import chalk from 'chalk';

export const info = (text: string): void => console.log(chalk.green(text)); 

export const mistake = (text: string, error?: unknown): void => console.log(chalk.red(text, error));

export const warn = (text: string) =>  console.log(chalk.yellow(text));
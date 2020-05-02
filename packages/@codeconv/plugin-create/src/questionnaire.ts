import * as prompts from 'prompts'
import { PromptObject } from 'prompts'

/**
 type Fields = {[key: string]: string | number | string[] | number[]};

 type Answers<T extends Fields> = { [K in keyof T]: T[K] };

 function prompts<T extends Fields, S extends Extract<keyof T, string>>(
   questions: prompts.PromptObject<S> | Array<prompts.PromptObject<S>>,
   options?: prompts.Options
 ): Promise<prompts.Answers<T>>;
 * */

type AddCommandAnswers = {
  name: string;
  type: string;
  age: number;
}
type AddCommandAnswerKeys = Extract<keyof AddCommandAnswers, string>

export const questionnaire = async (): Promise<AddCommandAnswers> => {
  const type: PromptObject<AddCommandAnswerKeys> = {
    type: 'text',
    name: 'type',
    message: 'Project type',
  }
  const name: PromptObject<AddCommandAnswerKeys> = {
    type: 'text',
    name: 'name',
    message: 'Project name',
  }
  const age: PromptObject<AddCommandAnswerKeys> = {
    type: 'number',
    name: 'age',
    message: 'How old are you?',
    initial: 0,
    style: 'default',
    min: 2,
    max: 10,
  }
  const questions: Array<PromptObject<AddCommandAnswerKeys>> = [
    type,
    name,
    age,
  ]

  // prompts.override(argv)
  return prompts(questions)
}

import * as REFLECT from 'reflect-metadata';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { codingAgent } from './agents/coding-agent';

console.log(REFLECT.default)
function decorator(){
    return (obj: any, attr?: any) => {
        Reflect.defineMetadata('mastra:agent', true, obj, attr)
    }
}

@decorator()
class Test {
    @decorator()
    test: string = 'test'
    constructor(arg: Map<string, number>){}
}

Reflect.defineMetadata("mastra:agent", true, Test, "test")

const designParams = Reflect.getMetadata("design:paramtypes", Test)
console.log(designParams) // "should be ["Map"]

const agentClassMetadata = Reflect.getMetadata("mastra:agent", Test)
console.log(agentClassMetadata) // logs "true" because it was explicitly assigned

const test = new Test(new Map())

const attrDesignType = Reflect.getMetadata("design:type", test, "test")
console.log(attrDesignType.name) // should log "String"


export const mastra = new Mastra({
  agents: { codingAgent },
  storage: new LibSQLStore({ url: 'file:../../mastra.db' }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),
  bundler: {
    externals: ["reflect-metadata"],
    sourcemap: true,
  },
});

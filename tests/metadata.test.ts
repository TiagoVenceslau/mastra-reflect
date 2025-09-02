import 'reflect-metadata';

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

    doSomething(test: string): Promise<string>{
        return Promise.resolve(test)
    }
}

describe('metadata', () => {

    it('should be able to get class constructor params', () => {

        const designParams = Reflect.getMetadata("design:paramtypes", Test)
        expect(designParams).toEqual([Map])
    });

    it("should be able to get class metadata", () => {
        const agentClassMetadata = Reflect.getMetadata("mastra:agent", Test)
        expect(agentClassMetadata).toEqual(true)
    })

    it("should be able to get type metadata", () => {

        const test = new Test(new Map())

        const attrDesignType = Reflect.getMetadata("design:type", test, "test")
        expect(attrDesignType).toEqual(String)
    })
});
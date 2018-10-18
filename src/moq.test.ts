import { Mock, It, Times, ExpectedGetPropertyExpression } from 'moq.ts';
interface ITestObject
{
    property1: number;
    property2: number;
    property3: number;
    property4: number;
    method(): void;
}

describe('Moq', () => {
    it('test', () => {
        
        const property4Name = 'property4';
        const mockName = 'mock name is optional';
        const mock = new Mock<ITestObject>(mockName)
        .setup(instance => instance.property1)
        .returns(1)
        
        .setup(instance => It.Is((expression: ExpectedGetPropertyExpression) => expression.name === 'property2'))
        .returns(100)
        
        //let's deny any write operation on the property for all values
        .setup(instance => { instance.property2 = It.Is(() => true) })
        .returns(false)
        
        .setup(instance => instance.property3)
        .callback(() => 10 + 10)
        
        .setup(instance => instance[property4Name])
        .throws(new Error('property4 access'))
        
        //since a method is a property that holds a pointer to a function
        .setup(instance => instance.method)
        .returns(()=>2);
        
        const object = mock.object();
        const ret = object.method();
        console.log(ret);
        
        mock.verify(instance => instance.property1, Times.Never());
        
    });
});
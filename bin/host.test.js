"use strict";
// import { BluePillWebDriver } from "./Main";
// import { Mock, Times, It } from "moq.ts";
// import { IAppConfig } from "./Storage/AppConfig";
// import { hostname } from "os";
// import { IServer } from "./IServer";
// import { ServerResponse, IServerResponse } from "./ServerResponse";
// import { IDriver } from "./Driver/Driver";
// export class Client
// {
//     constructor()
//     {
//     }
// }
// test(BluePillWebDriver.name, () =>
// {
//     // Given
//     const responseMock = new Mock<IServerResponse>()
//         .setup(i => i.Text(It.IsAny<any>()))
//         .callback(() => { });
//     const _server = new Mock<IServer>().object();
//     const driverMock = new Mock<IDriver>()
//         .setup(i => i.Read(It.IsAny<number>()))
//         .returns(() => 100);
//     const _driver = driverMock.object();
//     const sut = new BluePillWebDriver(_server, _driver);
//     // When
//     sut.Run();
//     _server.OnIoGet(1, responseMock.object());
//     // Then
//     driverMock.verify(i => i.Read(1), Times.Once());
//     responseMock.verify(i => i.Text("100"), Times.Once());
// });
// // test('Actuator update should send message to driver and other clients', () =>
// // {
// //     const configMock = new Mock<IAppConfig>()
// //         .setup(i => i.HostPort)
// //         .returns(3000)
// //         .setup(i => i.Usb)
// //         .returns('dummy');
// //     const _config = configMock.object();
// //     const main = new BluePillWebDriver(_server, _driver);
// //     const client1 = new Client();
// //     const client2 = new Client();
// //     client1.Send(Addr.Output1, 5);
// //     driverMock.Verify(i=>i.Set(1, 5), Times.Once());
// //     client2.OnUpdate((addr,val)=>expect(addr)...);
// // }); 
//# sourceMappingURL=host.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerResponse {
    constructor(expressResponse) {
        this.expressResponse = expressResponse;
    }
    Text(value) {
        this.expressResponse.send(value.toString);
    }
    Accepted() {
        this.expressResponse.sendStatus(202);
    }
}
exports.ServerResponse = ServerResponse;
//# sourceMappingURL=ServerResponse.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPlugin = void 0;
function jwtPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.decorate("authenticate", function (request, reply) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield request.jwtVerify();
                    const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    if (token) {
                        const data = app.jwt.decode(token);
                        request.routeConfig.jwtData = data;
                    }
                    else {
                        throw new Error('Wrong auth token');
                    }
                }
                catch (err) {
                    reply.send(err);
                }
            });
        });
    });
}
exports.jwtPlugin = jwtPlugin;

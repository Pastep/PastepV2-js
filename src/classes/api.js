const { databaseConfig } = require("../../config");
const userDatabase = require("../apps/accounts/models/user");

async function userWithVerification(request, response, next) {
    if (request.headers["authorization"]) {
        if (request.headers.authorization.startsWith("Bearer")) {
            let authorization = request.headers.authorization.replace("Bearer ", "");
            let result = await userDatabase.getByToken(authorization);
            if (result.length != 0) {
                result = result[0];
                if (!result.is_verified) {
                    response.status(403).json({
                        message: "Please verify your email.",
                    });
                } else {
                    request.user = result;
                    next();
                    return;
                }
            } else {
                response.status(401).json({
                    message: "Token is incorrect.",
                });
            }
        }
    }
    response.status(400).json({
        message: "Authorization is missing.",
    });
}

async function userCheck(request, response, next) {
    if (request.headers["authorization"]) {
        if (request.headers.authorization.startsWith("Bearer")) {
            let authorization = request.headers.authorization.replace("Bearer ", "");
            let result = await database.getByToken(authorization);
            if (result.length != 0) {
                request.user = result[0];
                next();
                return;
            } else {
                response.status(401).json({
                    message: "Token is incorrect.",
                });
            }
        }
    }
    response.status(400).json({
        message: "Authorization is missing.",
    });
}

module.exports.userWithVerification = userWithVerification;
module.exports.userCheck = userCheck;
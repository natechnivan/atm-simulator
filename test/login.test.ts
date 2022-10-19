import { UserBase } from "../src/models/user";
import { LoginCommand } from "../src/modules/command/login";
import fs, { promises } from 'fs';

jest.mock("../src/models/wallet", () => {
    return {
        WalletBase: jest.fn().mockImplementation(() => {
            return { 
                get: jest.fn().mockReturnValue({
                    balance: 0
                })
            };
        }),
    }
});

jest.mock("../src/models/user", () => {
    return {
        UserBase: jest.fn().mockImplementation(() => {
            return { 
                get: jest.fn(),
                create: jest.fn()
            };
        }),
    }
});

describe('login chetan', () => {
    beforeEach(() => {
        
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Login with name', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        const userModel = new UserBase("Chetan");
        userModel.get = jest.fn().mockResolvedValue("Chetan");
        userModel.create = jest.fn().mockResolvedValue({ });

        const writeSpy = jest.spyOn(promises, 'writeFile').mockResolvedValue();

        const command = new LoginCommand(["login","Chetan"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(2);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Hello, Chetan!');
        expect(consoleSpy.mock.calls[1][0]).toEqual('Your balance is $0');
        expect(writeSpy).toBeCalledTimes(1);
    });

    // Please provide user name
    it('Login without name', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        const userModel = new UserBase("Chetan");
        userModel.get = jest.fn().mockResolvedValue("");
        userModel.create = jest.fn().mockResolvedValue({ });

        const command = new LoginCommand(["login",""]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Please provide user name');
    });
});
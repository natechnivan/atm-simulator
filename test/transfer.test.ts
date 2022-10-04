import { UserBase } from "../src/models/user";
import { WalletBase } from "../src/models/wallet";
import { TransferCommand  } from "../src/modules/command/transfer";
const userHelper = require("../src/utils/userHelper");

describe('transfer', () => {
    let mockedGet: jest.SpyInstance<Promise<any>>;
    let mockedCreate: jest.SpyInstance<Promise<any>>;
    let mockedUserGet: jest.SpyInstance<Promise<any>>;

    beforeEach(() => {
        mockedGet = jest.spyOn(WalletBase.prototype, 'get');
        mockedCreate = jest.spyOn(WalletBase.prototype, 'create');
        mockedUserGet = jest.spyOn(UserBase.prototype, 'get');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('transfer without login', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("");

        const command = new TransferCommand(["transfer", "alice", ""]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual("Please login to continue");
    });

    it('transfer alice 50 balance from 80', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");

        mockedUserGet.mockResolvedValueOnce({ });
       
        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 80 })

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new TransferCommand(["transfer", "alice",  "50"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(2);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Transferred $50 to alice');
        expect(consoleSpy.mock.calls[1][0]).toEqual('Your balance is $30');
    });

    it('transfer alice 100 balance from 30', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");

        mockedUserGet.mockResolvedValueOnce({ });

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 30 , debtAmount: 0 });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new TransferCommand(["transfer", "alice", "100"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(3);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Transferred $30 to alice');
        expect(consoleSpy.mock.calls[1][0]).toEqual('Your balance is $0');
        expect(consoleSpy.mock.calls[2][0]).toEqual('Owed $70 to alice');
    });

    it('transfer alice 100 balance from 20', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");

        mockedUserGet.mockResolvedValueOnce({ });

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 20, debtAmount: 50 , debtTouser: 'alice' });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new TransferCommand(["transfer", "alice" , "100"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(3);
        expect(consoleSpy.mock.calls[0][0]).toEqual("Transferred $20 to alice");
        expect(consoleSpy.mock.calls[1][0]).toEqual("Your balance is $0");
        expect(consoleSpy.mock.calls[2][0]).toEqual("Owed $130 to alice");
    });

    it('transfer bob 30 balance from 20 owed 40 from bob', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("alice");

        mockedUserGet.mockResolvedValueOnce({ });

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 20 , debtAmount: 40, debtFromUser: 'bob' });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new TransferCommand(["transfer", "bob" , "30"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(2);
        expect(consoleSpy.mock.calls[0][0]).toEqual("Your balance is $20");
        expect(consoleSpy.mock.calls[1][0]).toEqual("Owed $10 from bob");
    });

    it('transfer bob 30 balance from 20 owed 40 from bob', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("alice");

        mockedUserGet.mockResolvedValueOnce({ });

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 20 , debtAmount: 40, debtFromUser: 'bob' });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new TransferCommand(["transfer", "bob" , "30"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(2);
        expect(consoleSpy.mock.calls[0][0]).toEqual("Your balance is $20");
        expect(consoleSpy.mock.calls[1][0]).toEqual("Owed $10 from bob");
    });
});
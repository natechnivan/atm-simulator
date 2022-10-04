import { WalletBase } from "../src/models/wallet";
import { DepositCommand  } from "../src/modules/command/deposit";
const userHelper = require("../src/utils/userHelper");

describe('deposit', () => {
    let mockedGet: jest.SpyInstance<Promise<any>>;
    let mockedCreate: jest.SpyInstance<Promise<any>>;

    beforeEach(() => {
        mockedGet = jest.spyOn(WalletBase.prototype, 'get');
        mockedCreate = jest.spyOn(WalletBase.prototype, 'create');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('deposit without login', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("");

        mockedGet.mockResolvedValue({ })
        .mockResolvedValueOnce({ balance: 0 });

        mockedCreate.mockResolvedValue(true)
           .mockResolvedValueOnce(true);

        const command = new DepositCommand(["deposit", "100"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Please login first');
    });

    it('deposit 10', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");
       
        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 0 });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new DepositCommand(["deposit", "10"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Your balance is $10');
    });

    it('deposit 10 with debt 20 to bob', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 0 , debtAmount: 20, debtToUser: 'bob' });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new DepositCommand(["deposit","10"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(3);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Transferred $10 to bob');
        expect(consoleSpy.mock.calls[1][0]).toEqual('Your balance is $0');
        expect(consoleSpy.mock.calls[2][0]).toEqual('Owed $10 to bob');
    });

    it('deposit 100 with debt 20 to alice', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");

        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 0 , debtAmount: 20, debtToUser: 'alice' });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new DepositCommand(["deposit","100"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(2);
        expect(consoleSpy.mock.calls[0][0]).toEqual("Transferred $20 to alice");
        expect(consoleSpy.mock.calls[1][0]).toEqual("Your balance is $80");
    });
});
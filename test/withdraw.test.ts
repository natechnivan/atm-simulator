import { WalletBase } from "../src/models/wallet";
import { WithdrawCommand  } from "../src/modules/command/withdraw";
const userHelper = require("../src/utils/userHelper");

describe('withdraw', () => {
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

    it('withdraw without login', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("");

        mockedGet.mockResolvedValue({ })
        .mockResolvedValueOnce({ balance: 0 });

        mockedCreate.mockResolvedValue(true)
           .mockResolvedValueOnce(true);

        const command = new WithdrawCommand(["withdraw", "100"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Please login to continue');
    });

    it('withdraw 10', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        userHelper.getLoggedInUser = jest.fn().mockResolvedValueOnce("chetan");
       
        mockedGet.mockResolvedValue({ })
                 .mockResolvedValueOnce({ balance: 100 });

        mockedCreate.mockResolvedValue(true)
                    .mockResolvedValueOnce(true);

        const command = new WithdrawCommand(["withdraw", "10"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Your balance is $90');
    });
});
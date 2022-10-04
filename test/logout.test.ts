import { LogoutCommand  } from "../src/modules/command/logout";
jest.mock("../src/utils/userHelper", () => {
    return {
        getLoggedInUser: jest.fn().mockResolvedValue("Chetan")
    }
});
describe('logout', () => {
    beforeEach(() => {
        
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Logout', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        const command = new LogoutCommand(["logout"]);
        await command.execute();

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy.mock.calls[0][0]).toEqual('Goodbye, Chetan!');
    });
});
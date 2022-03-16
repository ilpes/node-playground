import UserModel from "../models/user";

class UserService {

    async getRandom (): Promise<UserModel | undefined> {

        // Ugly (and weak) way to select a random id
        // Not using SORT BY RAND() due to performance issues
        const maxIdQuery = await UserModel.query().max('id as maxId').first();
        const randomId = Math.floor(Math.random() * (maxIdQuery?.maxId || 1)) + 1;

        return UserModel
            .query()
            .select('*')
            .findById(randomId);
    }
}

export default UserService;

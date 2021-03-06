import { createContext,useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Store{
    activityStore: ActivityStore
    userStore: UserStore;
    commonStore : CommonStore
}

export const store: Store = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}

import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/use-storage';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface UserInfoContext {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo) => void;
  removeUserInfo: () => void;
}

const UserInfoContext = createContext<UserInfoContext | undefined>(undefined);

export function useUserInfo() {
  return useContext(UserInfoContext)!;
}

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo, removeUserInfo] = useLocalStorage<
    UserInfo | undefined
  >('user-info', undefined);

  const value: UserInfoContext = {
    userInfo,
    setUserInfo: (userInfo: UserInfo) => setUserInfo(userInfo),
    removeUserInfo: () => removeUserInfo(),
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
}

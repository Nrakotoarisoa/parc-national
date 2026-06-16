import { useEffect } from "react";
import { useMeQuery } from "@/features/auth/api/authApi";
import { setUser } from "@/features/auth/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export function AuthSession() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { data: profile } = useMeQuery(undefined, { skip: !token || Boolean(user) });

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [dispatch, profile]);

  return null;
}

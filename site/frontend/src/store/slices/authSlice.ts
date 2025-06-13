import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const savedUser = localStorage.getItem("user")
const savedToken = localStorage.getItem("token")

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken ?? null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    },
  },
})

export const { setUser, setToken, logout } = authSlice.actions
export default authSlice.reducer

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

const getUserIdFromToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = getUserIdFromToken();
    if (!userId) return;

    socketRef.current = io("/", {
      path: "/api/socket.io",
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("joinUserRoom", userId);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
